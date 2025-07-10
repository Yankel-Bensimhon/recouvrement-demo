const { getToken } = require('next-auth/jwt'); // Using next-auth/jwt to decode

const secret = process.env.NEXTAUTH_SECRET;

// Middleware to verify NextAuth.js session token from cookie
const verifyNextAuthSession = async (req, res, next) => {
  // Try to get the token from the standard NextAuth cookie name
  // Production cookie name might be prefixed with __Secure-
  const cookieName = process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';

  const tokenFromCookie = req.cookies[cookieName];

  if (!tokenFromCookie) {
    // Also check for the CSRF token cookie as NextAuth v4+ might use it for session verification in some cases,
    // or a different cookie name if customized. This is primarily for API routes within the Next.js app.
    // For a truly separate backend, relying on the session-token (JWE) is more direct.
    // console.log("No session token cookie found. Cookies:", req.cookies);
    // return res.status(401).json({ message: 'Not authorized, no session token cookie' });
  }

  // If no direct cookie, try to use getToken which can also read Authorization header if configured.
  // getToken will decrypt the JWE cookie or verify the Bearer token.
  try {
    const decodedToken = await getToken({
        req,
        secret,
        // raw: true, // If you want the raw JWT string, not the decoded payload
        cookieName: req.cookies[cookieName] ? cookieName : undefined // Prioritize the found cookie
    });

    if (decodedToken && decodedToken.id) {
      // Token is valid, and has the 'id' we added in the jwt callback
      req.user = {
        id: decodedToken.id,
        email: decodedToken.email,
        name: decodedToken.name
      };
      // console.log("User authenticated by middleware:", req.user);
      next();
    } else {
      // Fallback: Check Authorization header if no cookie worked or token was invalid
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const rawJwt = authHeader.split(' ')[1];
        try {
          // This verify is for a raw JWT, not a JWE.
          // The token from `getToken` (if not raw) is already the payload.
          // If getToken didn't work, this raw JWT might be one issued by another system or manually passed.
          // For NextAuth JWTs, they are typically JWEs in cookies.
          // If the Bearer token IS the JWE string, then getToken should have handled it.
          // If it's a raw JWT signed with NEXTAUTH_SECRET, jsonwebtoken.verify can check it.
          const jwt = require('jsonwebtoken'); // Only require if using this path
          const payload = jwt.verify(rawJwt, secret);
          if (payload && payload.id) {
            req.user = { id: payload.id, email: payload.email, name: payload.name };
            // console.log("User authenticated by Bearer token:", req.user);
            return next();
          }
        } catch (jwtError) {
          // console.error("Bearer token verification error:", jwtError.message);
          return res.status(401).json({ message: 'Not authorized, Bearer token invalid.' });
        }
      }
      // console.log("No valid token found via getToken or Bearer header. Decoded token:", decodedToken);
      return res.status(401).json({ message: 'Not authorized, token missing or invalid' });
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

module.exports = verifyNextAuthSession;
