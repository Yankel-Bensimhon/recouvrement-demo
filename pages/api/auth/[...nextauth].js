import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Potentiellement d'autres fournisseurs comme EmailProvider, GoogleProvider, etc.

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // This will call our backend API
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, { // We'll create this backend route
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const user = await res.json();

        if (res.ok && user) {
          // Any object returned will be saved in `user` property of the JWT
          // The user object here will be what's available in the session
          return { id: user.id, email: user.email, name: user.company_name }; // Adjust according to your user model
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          // throw new Error(user.message || 'Authentication failed'); // More specific error
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),
    // ...add more providers here, e.g. GoogleProvider
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for sessions
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the user id, email to the token right after signin
      // If using CredentialsProvider, 'user' object is what authorize returns.
      // 'account' is populated for OAuth providers.
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name; // Assuming 'name' is returned by authorize (e.g. company_name)
      }
      // This is where we can attach the raw JWT token if needed by the client for backend API calls
      // However, NextAuth typically handles this by encrypting the JWT itself into a session cookie (JWE).
      // If we want the *actual* JWT string to be available client-side via getSession().jwt,
      // we might need to explicitly add it here, though it's often better to let NextAuth manage it.
      // For sending to a separate backend, the `accessToken` from an OAuth provider might be more relevant,
      // or we might need to sign a new token for our backend if NextAuth's token is opaque.

      // For now, let's assume the structure { id, email, name } is sufficient for the session.
      // The verifyToken middleware in the backend uses NEXTAUTH_SECRET to decode the JWT cookie that NextAuth sets.
      // So the JWT that NextAuth creates internally IS the one we're verifying.
      // The key is that the cookie must be sent with API requests to our backend.
      // The `getToken({ req })` on the backend, if it were a Next.js API route, would decrypt this.
      // For a separate backend, the cookie needs to be forwarded by the proxy and then manually handled if not using Bearer.
      // Our current middleware `verifyToken` expects a Bearer token.
      // So, the frontend MUST send it. The `jwt` callback in NextAuth is where the token sent to the client is formed.
      // Let's add the actual token string to the token object so client can grab it.
      // This is not standard practice for NextAuth to expose its own JWT string directly for client use,
      // but can be a workaround for custom backend integration if not using OAuth accessTokens.
      // A better way might be for NextAuth's authorize to return a token *from the backend* if the backend issues its own.

      // Let's try to make the JWT that NextAuth *creates* available.
      // The `token` object here *is* the JWT payload. `account?.id_token` or `account?.access_token` is for OAuth.
      // The actual signed JWT string is not directly exposed here by default to pass around.
      // The `encode` and `decode` functions in NextAuth handle the JWT creation and reading.

      // Let's stick to the standard: session.user will have id, email, name.
      // The frontend will need to make authenticated requests. The cookie handles this for same-site.
      // For cross-site or API to separate backend, Bearer token is better.
      // If our backend middleware `verifyToken` is to work with `Authorization: Bearer <token>`,
      // then the frontend *must* get this token.
      // The `token` parameter in this jwt callback *is* the content of the JWT.
      // The `session` callback receives this `token` object.
      // We need to ensure `getSession()` on client gives access to this token string.
      // By default, `getSession()` returns the session object, not the raw JWT string.
      // `getToken()` from `next-auth/jwt` can get the decoded token.

      // To make the raw JWT available to the client (getSession().jwt):
      // This is a bit of a hack: the `token` here is the *decoded* payload.
      // To get the *signed* JWT string, we'd need to re-sign it or access it before decoding.
      // This is not how NextAuth is designed to be used typically.
      // The standard way is:
      // 1. NextAuth handles auth, sets secure HTTPOnly cookie.
      // 2. API routes (if part of Next.js app) can read session from this cookie.
      // 3. For external backend:
      //    a. Use NextAuth as OAuth client, get `accessToken` from provider, send that to backend.
      //    b. Or, backend has its own auth, NextAuth calls it.
      //    c. Or, Next.js API route acts as proxy, verifies NextAuth session, then calls backend with privileged key.

      // Our current setup: NextAuth calls backend `/login`, backend validates, returns user.
      // NextAuth creates JWT session. Middleware `verifyToken` expects this JWT as Bearer.
      // The simplest way to get this JWT on the client is if NextAuth provides it.
      // The `token` in `jwt` callback is the payload. The `session` callback gets this payload.
      // Let's assume the default JWT cookie set by NextAuth is forwarded by the proxy
      // and the backend `verifyToken` can decrypt it using `NEXTAUTH_SECRET`.
      // This means `verifyToken` should not expect `Authorization: Bearer` but rather read the cookie.
      // This is a significant change to `verifyToken`.

      // OR, we make the frontend explicitly send the token.
      // To get the actual signed JWT string to send as Bearer, we need to modify how NextAuth makes it available.
      // One way is to store the signed JWT string in the `token` object itself if possible,
      // or use a custom `encode` function in NextAuth options to have more control.

      // For now, let's assume the JWT payload is what we need in `req.user` after `verifyToken`.
      // The `id` and `email` are correctly added to `token`.
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like user id from the token.
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name; // Ensure name is part of the session user object
      // To make the raw token available in useSession().jwt or getSession().jwt
      // session.jwt = token.jwt_string; // if we managed to put jwt_string in the token object
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  // Adapter: PrismaAdapter(prisma), // If using Prisma with NextAuth for DB interactions directly
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
