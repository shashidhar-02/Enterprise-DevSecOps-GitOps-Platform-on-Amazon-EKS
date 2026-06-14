"use client";
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-200 rounded-xl shadow-sm bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-dark">Restaurant Sign In</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
            placeholder="manager@restaurant.com" 
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
            placeholder="••••••••" 
            required
          />
        </div>
        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
          Sign In to Dashboard
        </button>
      </form>
    </div>
  )
}
