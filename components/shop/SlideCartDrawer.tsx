'use client'

import { useState } from 'react'
import { useCartContext } from './CartProvider'

export default function SlideCartDrawer() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCartContext()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg z-40">
        Cart
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg transform transition-transform translate-x-0">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>

            <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100%-140px)]">
              {cart.length === 0 ? (
                <p className="text-slate-500">Cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <img src={item.image} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3>{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity-1)} disabled={item.quantity <=1 } className="px-2 py-1 bg-slate-200 rounded">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity+1)} className="px-2 py-1 bg-slate-200 rounded">+</button>
                      </div>
                    </div>
                    <p>${item.price * item.quantity}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">Remove</button>
                  </div>
                ))
              )}
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t flex flex-col gap-2">
              <p className="font-bold text-indigo-600">Total: ${total}</p>
              <button onClick={clearCart} className="bg-slate-200 p-2 rounded">Clear Cart</button>
              <button className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition">Checkout</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}