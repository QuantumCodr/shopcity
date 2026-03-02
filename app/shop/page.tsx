'use client'

import { useState } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import SlideCartDrawer from '@/components/shop/SlideCartDrawer'
import { useCartContext } from '@/components/shop/CartProvider'

const products = [
  { id: '1', name: 'Premium Hoodie', description: 'Soft cotton blend hoodie.', price: 59, image: 'https://picsum.photos/400?1' },
  { id: '2', name: 'Minimal Sneakers', description: 'Comfort everyday sneakers.', price: 89, image: 'https://picsum.photos/400?2' },
   { id: '3', name: 'Premium Hoodie', description: 'Soft cotton blend hoodie.', price: 59, image: 'https://picsum.photos/400?3' },
  { id: '4', name: 'Minimal Sneakers', description: 'Comfort everyday sneakers.', price: 89, image: 'https://picsum.photos/400?4' },
   { id: '5', name: 'Premium Hoodie', description: 'Soft cotton blend hoodie.', price: 59, image: 'https://picsum.photos/400?5' },
  { id: '6', name: 'Minimal Sneakers', description: 'Comfort everyday sneakers.', price: 89, image: 'https://picsum.photos/400?6' },
]

export default function ShopPage() {
  const [open, setOpen] = useState(false)
  const { count } = useCartContext()

  return (
    <div className="space-y-8">

 

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