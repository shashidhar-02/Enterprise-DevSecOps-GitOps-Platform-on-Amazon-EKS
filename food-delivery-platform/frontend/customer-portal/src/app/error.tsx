'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">We encountered an unexpected error while loading this page.</p>
      <button
        onClick={() => reset()}
        className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-md transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
