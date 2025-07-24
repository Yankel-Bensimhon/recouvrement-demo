import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Recouvrement App</h1>
      <div className="flex space-x-4 mt-4">
        <Link href="/auth/signin" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          Sign In
        </Link>
        <Link href="/auth/signup" className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
          Sign Up
        </Link>
      </div>
    </div>
  )
}
