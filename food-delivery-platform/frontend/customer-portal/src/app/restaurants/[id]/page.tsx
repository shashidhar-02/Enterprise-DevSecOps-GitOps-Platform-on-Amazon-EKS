export default function RestaurantDetail({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="h-64 bg-gray-200 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h1 className="absolute bottom-6 left-8 text-4xl font-bold text-white">Restaurant #{params.id}</h1>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Mock menu items */}
             {[1,2,3,4,5,6].map(item => (
                <div key={item} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div>
                        <h3 className="font-bold text-lg">Delicious Item {item}</h3>
                        <p className="text-gray-500 text-sm mb-2">A tasty description of this amazing dish.</p>
                        <span className="font-semibold text-primary">$12.99</span>
                    </div>
                    <button className="bg-gray-100 hover:bg-gray-200 text-dark font-medium py-2 px-4 rounded-md">Add</button>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
