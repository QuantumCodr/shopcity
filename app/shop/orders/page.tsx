import { orders } from "@/app/data/orders"

export default function OrdersPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-gray-500">
                  {order.date}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">${order.total}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}