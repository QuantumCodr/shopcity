'use client'

import ShopHeader from '@/components/shop/ShopHeader'
import { CartProvider, useCartContext } from '@/components/shop/CartProvider'

function ShopLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const cart = useCartContext()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ShopHeader cartCount={cart.count} />
      <main className="flex-1 max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <ShopLayoutContent>{children}</ShopLayoutContent>
    </CartProvider>
  )
}