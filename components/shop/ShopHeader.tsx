'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ShopHeader({
  cartCount,
}: {
  cartCount: number
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-indigo-600 text-white py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link href="/shop" className="text-2xl font-bold">
          ShopCity
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/shop" className="hover:text-indigo-200">
            Shop
          </Link>
          <Link href="/shop/profile" className="hover:text-indigo-200">
            Profile
          </Link>
          <Link href="/shop/cart" className="relative hover:text-indigo-200">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-white text-indigo-600 text-xs rounded-full px-2 py-0.5 font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 px-6 space-y-3 text-sm font-medium">
          <Link href="/shop" className="block">
            Shop
          </Link>
          <Link href="/shop/profile" className="block">
            Profile
          </Link>
          <Link href="/shop/cart" className="block">
            Cart ({cartCount})
          </Link>
        </div>
      )}
    </header>
  )
}