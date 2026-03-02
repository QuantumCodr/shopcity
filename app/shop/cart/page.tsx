'use client'

import { useCartContext } from '@/components/shop/CartProvider'

export default function CartPage() {
  const { items, removeFromCart, total } = useCartContext()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-slate-500">Cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    ${item.price}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <span className="text-lg font-semibold">
              Total
            </span>
            <span className="text-xl font-bold text-indigo-600">
              ${total}
            </span>
          </div>
        </>
      )}
    </div>
  )
}