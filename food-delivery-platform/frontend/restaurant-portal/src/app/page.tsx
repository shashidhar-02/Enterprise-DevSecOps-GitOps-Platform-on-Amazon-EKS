import React from 'react';

export default function RestaurantDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded shadow border">
            <h2 className="text-xl font-semibold mb-4">Incoming Orders</h2>
            <div className="space-y-3">
               <div className="p-4 bg-gray-50 border rounded flex justify-between items-center">
                  <div><span className="font-bold">#ORD-992</span> - 3 Items</div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">Accept</button>
               </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded shadow border">
            <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded mb-4">+ Add Item</button>
            <div className="space-y-3">
               <div className="p-4 bg-gray-50 border rounded flex justify-between">
                  <span>Spicy Burger</span>
                  <span className="font-bold">$12.99</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
