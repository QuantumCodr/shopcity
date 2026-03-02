export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Hoodie",
    description: "Soft cotton blend hoodie.",
    price: 59,
    image: "https://picsum.photos/400?1",
  },
  {
    id: "2",
    name: "Minimal Sneakers",
    description: "Comfort everyday sneakers.",
    price: 89,
    image: "https://picsum.photos/400?2",
  },
  {
    id: "3",
    name: "Classic Watch",
    description: "Elegant stainless steel watch.",
    price: 120,
    image: "https://picsum.photos/400?3",
  },
  {
    id: "4",
    name: "Leather Backpack",
    description: "Modern everyday carry.",
    price: 140,
    image: "https://picsum.photos/400?4",
  },
]
