'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, company_name: companyName }),
    })
    if (res.ok) {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Sign Up</h1>
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
        <div className="flex flex-col mt-2">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border px-2 py-1"
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded hover:bg-green-700">
          Sign Up
        </button>
      </form>
    </div>
  )
}
