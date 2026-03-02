'use client'

import { useEffect, useState } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('shopcity-cart')
    if (stored) {
      setCart(JSON.parse(stored))
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('shopcity-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity } : p
      )
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

return {
  items: cart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  total,
  count,
}
}