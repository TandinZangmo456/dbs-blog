import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserRole } from '@/lib/roles'

interface Context { params: { id: string } }

// PATCH - update a post (author only)
export async function PATCH(req: Request, { params }: Context) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('author_id')
    .eq('id', params.id)
    .single()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  if (post.author_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, content, excerpt, unit_number, unit_title, tags, published } = body

  const { data, error } = await supabaseAdmin
    .from('posts')
    .update({
      title,
      content,
      excerpt: excerpt || content?.slice(0, 160).replace(/[#*`]/g, ''),
      unit_number: Number(unit_number),
      unit_title,
      tags: tags ?? [],
      published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE - delete a post (author or admin)
export async function DELETE(_req: Request, { params }: Context) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await getUserRole()

  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('author_id')
    .eq('id', params.id)
    .single()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Only author or admin can delete
  if (post.author_id !== userId && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
