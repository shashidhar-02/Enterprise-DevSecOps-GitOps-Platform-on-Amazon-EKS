export default function Cart() {
    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-bold text-lg mb-4">Your Cart</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span>2x Delicious Item</span>
                    <span className="font-semibold">$25.98</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>$25.98</span>
                </div>
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition-colors">
                    Checkout
                </button>
            </div>
        </div>
    )
}
