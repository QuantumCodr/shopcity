'use client'

import { useCartContext } from '@/components/shop/CartProvider'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    total,
    clearCart,
  } = useCartContext()

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

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-slate-200 rounded"
                    >
                      -
                    </button>

                    <span className="font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-slate-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-indigo-600">
                    ${item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-500 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-lg font-semibold">
                Total
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                ${total}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-slate-200 rounded-lg"
              >
                Clear Cart
              </button>

              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}