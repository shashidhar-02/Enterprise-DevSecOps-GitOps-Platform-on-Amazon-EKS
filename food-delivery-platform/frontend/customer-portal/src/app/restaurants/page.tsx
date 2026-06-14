import RestaurantCard from '../../components/RestaurantCard'

// Mock Data
const restaurants = [
  { id: '1', name: 'Burger Joint', category: 'American', rating: 4.5, deliveryTime: '25-35 min', image: '/images/burger.png' },
  { id: '2', name: 'Sushi Zen', category: 'Japanese', rating: 4.8, deliveryTime: '40-55 min', image: '/images/sushi.png' },
  { id: '3', name: 'Mamma Mia Pizza', category: 'Italian', rating: 4.3, deliveryTime: '30-45 min', image: '/images/pizza.png' },
  { id: '4', name: 'Spicy Thai', category: 'Thai', rating: 4.6, deliveryTime: '35-50 min', image: '/images/thai.png' },
];

export default function Restaurants() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-dark mb-8">Popular Restaurants Near You</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map(r => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  )
}
