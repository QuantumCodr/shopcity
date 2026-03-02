export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Profile
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div>
          <p className="text-sm text-slate-500">Name</p>
          <p className="font-semibold">John Doe</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Phone</p>
          <p className="font-semibold">+232 00 000 000</p>
        </div>
      </div>
    </div>
  )
}