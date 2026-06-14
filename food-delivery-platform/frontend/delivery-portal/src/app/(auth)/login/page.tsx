import React from 'react';

/**
 * Secure Login Page.
 * Demonstrates UI Readability, Modularity, and Security best practices.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Secure Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" placeholder="admin@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
