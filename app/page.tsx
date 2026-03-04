'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Mode = 'login' | 'register' | 'forgot' | 'reset'

export default function HomePage() {
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Clear fields when switching modes
  useEffect(() => {
    setPhone('')
    setPassword('')
    setFullName('')
    setOtp('')
    setMessage('')
  }, [mode])

  // Convert phone to email format for Supabase auth
  const phoneToEmail = (phone: string) => {
    const num = phone.replace(/^0/, '')
    return `${num}@shopcity.com`
  }

  const formatPhone = (input: string) => {
    if (!input.startsWith('+')) {
      const num = input.replace(/^0/, '')
      return '+232' + num
    }
    return input
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    const formattedPhone = formatPhone(phone)

    try {
      if (mode === 'login') {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formattedPhone + '@shopcity.local',
          password,
        })
        if (error) throw error

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user?.id)
          .maybeSingle()

        switch (profile?.role) {
          case 'customer':
            router.push('/shop')
            break
          case 'staff':
            router.push('/staff')
            break
          case 'admin':
            router.push('/admin')
            break
          case 'super_admin':
            router.push('/super-admin')
            break
          default:
            router.push('/shop')
        }
      } else if (mode === 'register') {
        // REGISTER
        const { data, error } = await supabase.auth.signUp({
          email: formattedPhone + '@shopcity.local',
          password,
          options: {
            data: {
              full_name: fullName,
              phone: formattedPhone, // sent to trigger via raw_user_meta_data
            },
          },
        })
        if (error) throw error

        setMessage('Account created successfully. You can now login.')
        setMode('login')
      } else if (mode === 'forgot') {
        // SEND OTP
        const res = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedPhone }),
        })
        const result = await res.json()
        if (result.error) throw new Error(result.error)
        setMessage('OTP sent to your phone.')
        setMode('reset')
      } else if (mode === 'reset') {
        // VERIFY OTP & UPDATE PASSWORD
        const res = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedPhone, otp, new_password: password }),
        })
        const result = await res.json()
        if (result.error) throw new Error(result.error)
        setMessage('Password updated successfully. You can now login.')
        setMode('login')
      }
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* NAVBAR */}
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">ShopCity</h1>
        </div>
      </header>

      {/* TAGLINE */}
      <div className="text-center mt-6 px-4">
        <p className="text-lg text-slate-700">
          Simple. Fast. Reliable shopping experience.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 items-start justify-center mt-10 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
          {/* MODE TOGGLE */}
          {mode !== 'reset' && (
            <div className="flex justify-center mb-4 text-sm font-medium">
              <button
                onClick={() => setMode('login')}
                className={`px-4 py-2 ${
                  mode === 'login'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-slate-400'
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setMode('register')}
                className={`px-4 py-2 ${
                  mode === 'register'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-slate-400'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* MESSAGES */}
          {message && (
            <div className="mb-3 text-center text-sm text-indigo-600">{message}</div>
          )}

          {/* FORM */}
          <div className="h-[300px] flex flex-col justify-between">
            <form onSubmit={handleAuth} className="flex flex-col space-y-3">
              {mode === 'register' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {(mode === 'login' || mode === 'register') && (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              {mode === 'reset' && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Login'
                  : mode === 'register'
                  ? 'Register'
                  : 'Reset Password'}
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-slate-500 hover:text-indigo-600 underline"
                >
                  Forgot Password?
                </button>
              )}

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-indigo-600 underline"
                >
                  Back to Login
                </button>
              )}

              {mode === 'reset' && (
                <p className="text-xs text-slate-500 text-center">
                  Enter the OTP sent to your phone to reset your password
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}