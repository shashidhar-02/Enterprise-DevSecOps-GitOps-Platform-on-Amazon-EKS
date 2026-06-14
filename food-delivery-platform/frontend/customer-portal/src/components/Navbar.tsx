import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-primary tracking-tighter">NEXUS FOOD POINT</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/restaurants" className="text-gray-600 hover:text-primary font-medium px-3 py-2">
              Restaurants
            </Link>
            <Link href="/checkout" className="text-gray-600 hover:text-primary font-medium px-3 py-2 flex items-center">
              Cart <span className="ml-1 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
            </Link>
            <Link href="/login" className="bg-gray-100 hover:bg-gray-200 text-dark font-medium py-2 px-4 rounded-full transition-colors ml-2">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
