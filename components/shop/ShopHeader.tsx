'use client'

import Link from 'next/link'
import { useCartContext } from './CartProvider'
import { useEffect, useRef, useState } from 'react'
import SlideCartDrawer from './SlideCartDrawer'

export default function ShopHeader() {
  const { count } = useCartContext()
  const [animate, setAnimate] = useState(false)
  const prevCount = useRef(count)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    if (count > prevCount.current) {
      setAnimate(true)
      const timeout = setTimeout(() => setAnimate(false), 200)
      return () => clearTimeout(timeout)
    }
    prevCount.current = count
  }, [count])

  return (
    <>
      <header className="sticky top-0 z-50 bg-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/shop" className="text-2xl font-bold">ShopCity</Link>

          <div className="flex items-center gap-6">
            <Link href="/shop" className="hover:opacity-80 transition">Shop</Link>
            <Link href="/shop/profile" className="hover:opacity-80 transition">Profile</Link>

            <button
              className="relative hover:opacity-80 transition"
              onClick={() => setCartOpen(true)}
            >
              Cart
              {count > 0 && (
                <span
                  className={`absolute -top-2 -right-3 bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full transition-transform duration-200 ${animate ? 'scale-125' : 'scale-100'}`}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over drawer */}
      <SlideCartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  )
}