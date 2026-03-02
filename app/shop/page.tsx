'use client'

import { useCartContext } from '@/components/shop/CartProvider'

const products = [
  {
    id: '1',
    name: 'Premium Hoodie',
    description: 'Soft cotton blend hoodie.',
    price: 59,
    image: 'https://picsum.photos/400?1',
  },
  {
    id: '2',
    name: 'Minimal Sneakers',
    description: 'Comfort everyday sneakers.',
    price: 89,
    image: 'https://picsum.photos/400?2',
  },
]

export default function ShopPage() {
  const { addToCart } = useCartContext()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col"
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>

            <h3 className="font-semibold text-slate-800">
              {product.name}
            </h3>

            <p className="text-sm text-slate-500 mb-3">
              {product.description}
            </p>

            <div className="mt-auto flex justify-between items-center">
              <span className="font-bold text-indigo-600">
                ${product.price}
              </span>

              <button
                onClick={() => addToCart(product)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}