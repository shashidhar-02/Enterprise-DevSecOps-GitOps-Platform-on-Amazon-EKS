import Link from 'next/link'

export default function Checkout() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
             <textarea className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" rows={3} placeholder="Enter your full delivery address..."></textarea>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h2 className="text-xl font-bold mb-4">Payment Method</h2>
             <div className="p-4 border rounded-md bg-gray-50 text-gray-700">Credit Card ending in 4242</div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-20">
             <h2 className="text-xl font-bold mb-4">Order Summary</h2>
             <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>$25.98</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>$3.99</span></div>
                <div className="flex justify-between text-gray-600"><span>Taxes</span><span>$2.40</span></div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-dark"><span>Total</span><span>$32.37</span></div>
             </div>
             <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-md transition-colors text-lg">
                Place Order
             </button>
           </div>
        </div>
      </div>
    </div>
  )
}
