import { supabase } from './supabaseClient'

export async function redirectBasedOnRole(router: any) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) return

  if (profile.role === 'admin') router.push('/admin')
  else if (profile.role === 'staff') router.push('/fulfillment')
  else router.push('/shop')
}
