'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-2 py-1"
            required
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-2 py-1"
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  )
}
