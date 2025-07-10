import { getCsrfToken, signIn, getProviders, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link

export default function SignIn({ csrfToken, providers }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(router.query.callbackUrl || '/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before new attempt
    const result = await signIn('credentials', {
      redirect: false, // Handle redirect manually to show errors
      email,
      password,
      // callbackUrl: router.query.callbackUrl || '/dashboard', // NextAuth handles this if redirect is true
    });

    if (result.error) {
      setError(result.error);
      console.error("SignIn Error:", result.error);
      // Map common errors to user-friendly messages if desired
      if (result.error === "CredentialsSignin") {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } else if (result.ok && result.url) {
       // Successful sign in, NextAuth would redirect if redirect:true.
       // Since we handle it, we push the user to the dashboard or callbackUrl.
      router.push(router.query.callbackUrl || '/dashboard');
    }
  };

  if (status === 'loading' || status === 'authenticated') {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>; // Or a spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Connectez-vous</h1>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="votreadresse@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Remember me and Forgot password could be added here */}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              Se connecter
            </button>
          </div>
        </form>

        {/* Alternative providers could be looped here if configured */}
        {/* {Object.values(providers).map((provider) => {
          if (provider.id === 'credentials') return null; // Don't show button for credentials
          return (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: router.query.callbackUrl || '/dashboard' })}
                className="w-full flex justify-center py-3 px-4 mt-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                Se connecter avec {provider.name}
              </button>
            </div>
          );
        })} */}

        <p className="mt-6 text-sm text-center text-gray-600">
          Pas encore de compte ?{' '}
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Inscrivez-vous
          </Link>
        </p>
         <p className="text-sm text-center text-gray-600">
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken
    },
  };
}
