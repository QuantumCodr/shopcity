"use client"

import type { Product } from "@/app/data/products"
import { useCart } from "./CartContext"

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100 flex flex-col">
      <div className="aspect-square overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      <h3 className="text-base md:text-lg font-semibold">
        {product.name}
      </h3>

      <p className="text-sm text-gray-500 mb-2">
        {product.description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold">
          ${product.price}
        </span>

        <button
          onClick={() => addToCart(product)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
        >
          Add
        </button>
      </div>
    </div>
  )
}