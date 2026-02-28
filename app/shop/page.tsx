'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Product = {
  id: string
  name: string
  price: number
}

export default function ShopPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function fetchUser() {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        router.push('/')
        return
      }
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.user.id)
        .single()
      if (!profile || profile.role !== 'customer') {
        router.push('/')
        return
      }
      setUserName(profile.full_name)
    }

    async function fetchProducts() {
      // TODO: Replace with real Supabase products table fetch
      setProducts([
        { id: '1', name: 'Apple', price: 3 },
        { id: '2', name: 'Banana', price: 2 },
        { id: '3', name: 'Orange', price: 4 },
      ])
    }

    fetchUser().then(() => setLoading(false))
    fetchProducts()
  }, [router])

  const addToCart = (product: Product) => setCart([...cart, product])
  const removeFromCart = (productId: string) =>
    setCart(cart.filter(p => p.id !== productId))

  const total = cart.reduce((sum, p) => sum + p.price, 0)

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ShopCity</h1>
          <span>Welcome, {userName}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        {/* Products */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-gray-600">${p.price}</p>
              <button
                className="mt-2 bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700"
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="w-full md:w-80 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Your Cart</h2>
          {cart.length === 0 && <p className="text-gray-500">No items yet</p>}
          {cart.map(p => (
            <div key={p.id} className="flex justify-between items-center mb-2">
              <span>{p.name}</span>
              <span>${p.price}</span>
              <button
                className="text-red-500"
                onClick={() => removeFromCart(p.id)}
              >
                x
              </button>
            </div>
          ))}
          {cart.length > 0 && (
            <>
              <hr className="my-2" />
              <p className="font-bold">Total: ${total}</p>
              <button className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Checkout
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
