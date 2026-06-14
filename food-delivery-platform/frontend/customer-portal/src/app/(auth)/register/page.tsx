import Link from 'next/link'

export default function Register() {
  return (
    <div className="max-w-md mx-auto mt-16 p-8 border border-gray-200 rounded-xl shadow-sm bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-dark">Create Account</h2>
      <form className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-md transition-colors mt-2">
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link href="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
      </p>
    </div>
  )
}
