import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import type { Post } from '@/types'

interface Props { searchParams: { unit?: string } }

async function getPosts(unit?: string): Promise<Post[]> {
  let query = supabase.from('posts').select('*').eq('published', true)
    .order('unit_number', { ascending: true }).order('created_at', { ascending: false })
  if (unit) query = query.eq('unit_number', parseInt(unit))
  const { data } = await query
  return data ?? []
}

async function getUnits() {
  const { data } = await supabase.from('posts').select('unit_number, unit_title').eq('published', true).order('unit_number', { ascending: true })
  if (!data) return []
  const seen = new Set<number>()
  return data.filter(p => { if (seen.has(p.unit_number)) return false; seen.add(p.unit_number); return true })
}

export default async function BlogPage({ searchParams }: Props) {
  const [posts, units] = await Promise.all([getPosts(searchParams.unit), getUnits()])

  const grouped = posts.reduce((acc, post) => {
    const key = post.unit_number
    if (!acc[key]) acc[key] = { title: post.unit_title, posts: [] }
    acc[key].posts.push(post)
    return acc
  }, {} as Record<number, { title: string; posts: Post[] }>)
  const unitNums = Object.keys(grouped).map(Number).sort((a, b) => a - b)

  return (
    <>
      <Navbar />
      <div className="border-b border-[var(--border)] bg-parchment-dark">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="font-serif text-3xl font-semibold text-ink mb-1">All Unit Notes</h1>
          <p className="text-ink/55 text-sm">{posts.length} post{posts.length !== 1 ? 's' : ''} · Database Systems</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10">

          <aside className="md:w-52 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-3">Filter by Unit</h3>
              <nav className="space-y-1">
                <Link href="/blog" className={`block text-sm px-3 py-1.5 rounded-sm transition-colors ${!searchParams.unit ? 'bg-ink text-gold font-medium' : 'text-ink/70 hover:text-ink hover:bg-parchment-dark'}`}>
                  All Units
                </Link>
                {units.map(u => (
                  <Link key={u.unit_number} href={`/blog?unit=${u.unit_number}`}
                    className={`block text-sm px-3 py-1.5 rounded-sm transition-colors ${searchParams.unit === String(u.unit_number) ? 'bg-ink text-gold font-medium' : 'text-ink/70 hover:text-ink hover:bg-parchment-dark'}`}>
                    Unit {u.unit_number} — {u.unit_title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-ink/40">
                <p className="font-serif text-xl">No notes found.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {unitNums.map(unitNum => (
                  <section key={unitNum}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="badge-unit">Unit {unitNum}</span>
                      <h2 className="font-serif text-lg font-semibold text-ink">{grouped[unitNum].title}</h2>
                      <div className="flex-1 border-t border-[var(--border)]" />
                      <span className="text-xs text-ink/40 font-mono">{grouped[unitNum].posts.length} note{grouped[unitNum].posts.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {grouped[unitNum].posts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
