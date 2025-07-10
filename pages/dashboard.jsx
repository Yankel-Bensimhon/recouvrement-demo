import DashboardLayout from "../components/DashboardLayout";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router"; // Import if you need client-side redirect checks

export default function DashboardPage() {
  // const router = useRouter();
  // const { data: session, status } = useSession();

  // Client-side protection (optional, as getServerSideProps should handle it)
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth/signin?callbackUrl=/dashboard');
  //   }
  // }, [status, router]);

  // if (status === 'loading') {
  //   return <p>Chargement...</p>;
  // }

  // if (status === 'unauthenticated') {
  //   // This might flash before redirect, getServerSideProps is preferred for initial block
  //   return <p>Accès non autorisé. Redirection...</p>;
  // }

  return <DashboardLayout />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/dashboard', // Redirect to sign-in page
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // Pass session to the page if needed, or just return empty props {}
  };
}
