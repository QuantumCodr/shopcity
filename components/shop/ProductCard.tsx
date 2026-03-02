'use client'

import { useCartContext } from './CartProvider'

type Product = { 
  id: string
  name: string
  description: string
  price: number
  image: string 
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCartContext()

  const inCart =
    items.find((item) => item.id === product.id)?.quantity || 0

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col min-h-[280px]">
      <div className="aspect-square rounded-lg overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      <h3 className="font-semibold text-slate-800">{product.name}</h3>
      <p className="text-sm text-slate-500 mb-3">{product.description}</p>

      <div className="mt-auto flex justify-between items-center min-h-[3rem]">
        <span className="font-bold text-indigo-600">
          ${product.price}
        </span>

        <button
          onClick={() => addToCart(product)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Add {inCart > 0 && `(${inCart})`}
        </button>
      </div>
    </div>
  )
}