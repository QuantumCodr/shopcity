"use client"

import Link from "next/link"
import { useCart } from "./CartContext"

export default function CartIcon() {
  const { items } = useCart()

  const totalCount = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  return (
    <Link href="/cart" className="relative">
      <span className="text-2xl">🛒</span>

      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
          {totalCount}
        </span>
      )}
    </Link>
  )
}