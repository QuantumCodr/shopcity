import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { phone, otp, new_password } = await req.json()

    if (!phone || !otp || !new_password) {
      return NextResponse.json(
        { error: 'Phone, OTP, and new password required' },
        { status: 400 }
      )
    }

    const formattedPhone = phone.startsWith('+')
      ? phone
      : '+232' + phone.replace(/^0/, '')

    // 🔎 Fetch latest unverified OTP
    const { data: otpData } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!otpData) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // ⏰ Expiry check
    if (new Date(otpData.expires_at) < new Date()) {
      await supabaseAdmin
        .from('otp_codes')
        .update({ verified: true })
        .eq('id', otpData.id)

      return NextResponse.json(
        { error: 'OTP expired. Request a new one.' },
        { status: 400 }
      )
    }

    // 🚫 Attempt limit (invalidate if exceeded)
    if (otpData.attempts >= 5) {
      await supabaseAdmin
        .from('otp_codes')
        .update({ verified: true })
        .eq('id', otpData.id)

      return NextResponse.json(
        { error: 'Too many incorrect attempts. Request new OTP.' },
        { status: 429 }
      )
    }

    // 🔐 Compare hash
    const hashedInput = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex')

    if (hashedInput !== otpData.otp_hash) {
      await supabaseAdmin
        .from('otp_codes')
        .update({ attempts: otpData.attempts + 1 })
        .eq('id', otpData.id)

      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // ✅ OTP is correct → invalidate it
    await supabaseAdmin
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', otpData.id)

    // 🔎 Find user
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('phone', formattedPhone)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 🔐 Update password
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userData.id, {
        password: new_password,
      })

    if (updateError) throw updateError

    return NextResponse.json({
      message: 'Password reset successfully',
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}

