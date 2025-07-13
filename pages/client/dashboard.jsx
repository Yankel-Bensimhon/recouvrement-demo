import ClientDashboardLayout from "../../components/ClientDashboardLayout";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ClientDashboardPage() {
  return <ClientDashboardLayout />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/client/dashboard', // Redirect to sign-in page
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
