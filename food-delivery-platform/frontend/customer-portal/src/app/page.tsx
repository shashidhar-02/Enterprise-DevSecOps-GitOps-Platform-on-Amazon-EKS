import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h1 className="text-5xl font-extrabold text-center mb-6 text-dark tracking-tight">
        Craving something <span className="text-primary">delicious?</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl text-center">
        Get the best food from your favorite local restaurants delivered right to your doorstep.
      </p>
      <div className="flex gap-4">
        <Link href="/restaurants" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
          Browse Restaurants
        </Link>
        <Link href="/login" className="bg-white hover:bg-gray-100 text-dark font-bold py-3 px-8 rounded-full border border-gray-200 transition-colors shadow-sm">
          Sign In
        </Link>
      </div>
    </div>
  )
}
