'use client'

import { useState } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import SlideCartDrawer from '@/components/shop/SlideCartDrawer'
import { useCartContext } from '@/components/shop/CartProvider'

const products = [
  { id: '1', name: 'Premium Hoodie', description: 'Soft cotton blend hoodie.', price: 59, image: 'https://picsum.photos/400?1' },
  { id: '2', name: 'Minimal Sneakers', description: 'Comfort everyday sneakers.', price: 89, image: 'https://picsum.photos/400?2' },
]

export default function ShopPage() {
  const [open, setOpen] = useState(false)
  const { count } = useCartContext()

  return (
    <div className="space-y-8">

      {/* Cart Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="relative bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Products */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Drawer */}
      <SlideCartDrawer open={open} setOpen={setOpen} />
    </div>
  )
}