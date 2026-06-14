import Link from 'next/link'

interface RestaurantProps {
  restaurant: {
    id: string;
    name: string;
    category: string;
    rating: number;
    deliveryTime: string;
    image?: string;
  }
}

export default function RestaurantCard({ restaurant }: RestaurantProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
          {restaurant.image && (
             <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-dark group-hover:text-primary transition-colors line-clamp-1">{restaurant.name}</h3>
            <span className="bg-gray-100 text-sm font-bold px-2 py-1 rounded flex items-center gap-1">
               ⭐ {restaurant.rating}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-3">{restaurant.category}</p>
          <div className="flex items-center text-sm text-gray-600">
             <span>🕒 {restaurant.deliveryTime}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
