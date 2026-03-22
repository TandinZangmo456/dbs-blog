import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserRole } from '@/lib/roles'

interface Context { params: { clerkId: string } }

export async function PATCH(req: Request, { params }: Context) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = await getUserRole()
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { role: newRole } = await req.json()
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role: newRole })
    .eq('clerk_id', params.clerkId)
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
