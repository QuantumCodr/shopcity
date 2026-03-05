'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
  id: string
  full_name: string
  phone: string
  email: string
  role: 'customer' | 'staff' | 'admin'
  is_active: boolean
  created_at?: string
  trust_score?: number
  verification_level?: string
}

export default function ProfilePage() {
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // For add-member form
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  // Editable fields
  const [editingName, setEditingName] = useState('')
  const [editingPhone, setEditingPhone] = useState('')

  // Mocked / fetched data
  const [orders, setOrders] = useState<any[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [deliveries, setDeliveries] = useState<any[]>([])

  // Fetch profile
  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('Profile not found')

      setProfile({
        ...data,
        trust_score: 85,
        verification_level: 'Verified',
      })
      setEditingName(data.full_name)
      setEditingPhone(data.phone)

      // Mock order history, delivery, locations, wallet
      setOrders([
        { id: 'ORD-001', item: 'Rice', status: 'Delivered', amount: 50 },
        { id: 'ORD-002', item: 'Beans', status: 'In Transit', amount: 30 },
      ])
      setLocations(['123 Main St, Freetown', '45 Brook Rd, Freetown'])
      setWalletBalance(120)
      setDeliveries([
        { id: 'DLV-001', item: 'Rice', status: 'Pending', eta: '30 min' },
      ])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Update Profile
  const updateProfile = async () => {
    if (!profile) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingName,
          phone: editingPhone,
          modified_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
      if (error) throw error
      setSuccess('Profile updated successfully.')
      fetchProfile()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Add Member
  const addMember = async (fullName: string, phone: string) => {
    if (!profile) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin/add-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, inviterId: profile.id }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to add member')
      setSuccess('Member added successfully.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    )

  if (!profile) return null

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 space-y-8">

      {/* HERO */}
      <div className="bg-indigo-600 text-white px-6 pt-10 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center text-2xl font-bold">
            {profile.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <p className="text-sm opacity-90">{profile.email}</p>
            <div className="mt-2 flex gap-2">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize">
                {profile.role}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  profile.is_active
                    ? 'bg-green-400/30 text-green-900'
                    : 'bg-red-400/30 text-red-900'
                }`}
              >
                {profile.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-1 flex gap-2">
              <span className="text-xs bg-yellow-100 text-yellow-900 px-2 py-1 rounded-full">
                Trust: {profile.trust_score}%
              </span>
              <span className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-full">
                {profile.verification_level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg">{success}</div>}

      {/* ACCOUNT SETTINGS */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        <h2 className="font-semibold text-slate-800">Account Settings</h2>
        <div>
          <label className="text-sm text-slate-500">Full Name</label>
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm text-slate-500">Phone</label>
          <input
            type="tel"
            value={editingPhone}
            onChange={(e) => setEditingPhone(e.target.value)}
            className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm text-slate-500">Email</label>
          <p className="font-semibold text-slate-700">{profile.email}</p>
        </div>

        <button
          onClick={updateProfile}
          disabled={saving}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* ORDER HISTORY */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">📦 Order History</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="border border-slate-200 rounded-lg px-4 py-2 flex justify-between items-center"
            >
              <span>{o.item}</span>
              <span className="text-sm text-slate-500">{o.status}</span>
              <span className="font-medium text-indigo-600">${o.amount}</span>
            </div>
          ))
        )}
      </div>

      {/* SAVED LOCATIONS */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">📍 Saved Delivery Locations</h2>
        {locations.length === 0 ? (
          <p className="text-sm text-slate-500">No saved locations yet.</p>
        ) : (
          locations.map((loc, i) => (
            <div key={i} className="border border-slate-200 rounded-lg px-4 py-2">
              {loc}
            </div>
          ))
        )}
      </div>

      {/* WALLET */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">💳 Wallet & Payments</h2>
        <p className="text-sm text-slate-500">Current Balance</p>
        <p className="text-xl font-bold text-indigo-600">${walletBalance}</p>
      </div>

      {/* DELIVERY TRACKING */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">🛵 Delivery Tracking</h2>
        {deliveries.length === 0 ? (
          <p className="text-sm text-slate-500">No active deliveries.</p>
        ) : (
          deliveries.map((d) => (
            <div
              key={d.id}
              className="border border-slate-200 rounded-lg px-4 py-2 flex justify-between"
            >
              <span>{d.item}</span>
              <span>{d.status}</span>
              <span className="text-sm text-slate-500">{d.eta}</span>
            </div>
          ))
        )}
      </div>

      {/* INVITE MEMBER */}
      {profile.role === 'customer' && (
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Invite a Family Member</h2>
          <p className="text-sm text-slate-500">Add someone who can receive deliveries under your account.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!fullName || !phone) return
              addMember(fullName, phone)
              setFullName('')
              setPhone('')
            }}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 w-full"
              disabled={saving}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 w-full"
              disabled={saving}
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Member
            </button>
          </form>
        </div>
      )}
    </div>
  )
}