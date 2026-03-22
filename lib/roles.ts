import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from './supabase'
import type { Role, UserProfile } from '@/types'

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await currentUser()
  if (!user) return null

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_id', user.id)
    .single()

  return data
}

export async function getUserRole(): Promise<Role | null> {
  const profile = await getUserProfile()
  return profile?.role ?? null
}

export async function ensureProfile(): Promise<UserProfile | null> {
  const user = await currentUser()
  if (!user) return null

  // Upsert profile on first sign-in
  const { data } = await supabaseAdmin
    .from('profiles')
    .upsert({
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      full_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      role: 'student', // default role
    }, { onConflict: 'clerk_id', ignoreDuplicates: true })
    .select()
    .single()

  // If upsert ignored, fetch existing
  if (!data) {
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('clerk_id', user.id)
      .single()
    return existing
  }

  return data
}
