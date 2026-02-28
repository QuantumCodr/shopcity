import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }

    const formattedPhone = phone.startsWith('+')
      ? phone
      : '+232' + phone.replace(/^0/, '')

    // 🔎 Check existing unverified OTP
    const { data: existingOtp } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // ⏳ 30-second resend cooldown
    if (existingOtp) {
      const diff = Date.now() - new Date(existingOtp.created_at).getTime()

      if (diff < 30 * 1000) {
        return NextResponse.json(
          { error: 'Please wait 30 seconds before requesting another OTP.' },
          { status: 429 }
        )
      }

      // Delete old pending OTP before inserting new one
      await supabaseAdmin
        .from('otp_codes')
        .delete()
        .eq('id', existingOtp.id)
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const otp_hash = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex')

    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Insert fresh OTP
    const { error } = await supabaseAdmin
      .from('otp_codes')
      .insert([
        {
          phone: formattedPhone,
          otp_hash,
          expires_at,
          attempts: 0,
          verified: false,
        },
      ])

    if (error) throw error

    // TODO: Send via SMS provider
    console.log(`OTP for ${formattedPhone}: ${otp}`)

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
