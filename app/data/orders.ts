export type Order = {
  id: string
  total: number
  status: "Processing" | "Shipped" | "Delivered"
  date: string
}

export const orders: Order[] = [
  {
    id: "ORD-001",
    total: 149,
    status: "Delivered",
    date: "2026-02-10",
  },
  {
    id: "ORD-002",
    total: 89,
    status: "Processing",
    date: "2026-02-18",
  },
]
