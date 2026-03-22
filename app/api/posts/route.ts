import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ensureProfile } from '@/lib/roles'
import slugify from 'slugify'

// GET - public list of published posts
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST - create a new post (students only)
export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await ensureProfile()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  if (profile.role === 'teacher') return NextResponse.json({ error: 'Teachers cannot post' }, { status: 403 })

  const body = await req.json()
  const { title, content, excerpt, unit_number, unit_title, tags, published } = body

  if (!title || !content) return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })

  // Generate unique slug
  const baseSlug = slugify(title, { lower: true, strict: true })
  const timestamp = Date.now().toString(36)
  const slug = `${baseSlug}-${timestamp}`

  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert({
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 160).replace(/[#*`]/g, ''),
      unit_number: Number(unit_number),
      unit_title,
      tags: tags ?? [],
      published: published ?? true,
      author_id: userId,
      author_name: profile.full_name || 'Student',
      author_email: profile.email,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
