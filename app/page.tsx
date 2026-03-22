import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import type { Post } from '@/types'

async function getRecentPosts(): Promise<Post[]> {
  const { data } = await supabase.from('posts').select('*').eq('published', true)
    .order('created_at', { ascending: false }).limit(6)
  return data ?? []
}

async function getUnitSummary() {
  const { data } = await supabase.from('posts').select('unit_number, unit_title')
    .eq('published', true).order('unit_number', { ascending: true })
  if (!data) return []
  const seen = new Set<number>()
  return data.filter(p => { if (seen.has(p.unit_number)) return false; seen.add(p.unit_number); return true })
}

export default async function HomePage() {
  const [posts, units] = await Promise.all([getRecentPosts(), getUnitSummary()])

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-ink text-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl fade-up">
            <div className="text-gold font-mono text-xs tracking-widest uppercase mb-4">
              CST · Royal University of Bhutan
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4">
              Database Systems<br />
              <span className="italic text-gold-light font-normal">Unit Notes</span>
            </h1>
            <p className="text-parchment/70 text-lg leading-relaxed mb-8 max-w-lg">
              A collaborative space where students document their learning — unit by unit, concept by concept. Structured notes, shared knowledge.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="bg-gold text-ink font-semibold px-6 py-3 rounded-sm hover:bg-gold-light transition-colors text-sm">
                Browse All Notes
              </Link>
              <Link href="/dashboard/new" className="border border-parchment/30 text-parchment px-6 py-3 rounded-sm hover:border-parchment/60 transition-colors text-sm">
                Write a Post
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Units strip */}
      {units.length > 0 && (
        <section className="border-b border-[var(--border)] bg-parchment-dark">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-xs font-mono text-ink/40 uppercase tracking-widest whitespace-nowrap">Jump to unit:</span>
              {units.map(u => (
                <Link key={u.unit_number} href={`/blog?unit=${u.unit_number}`}
                  className="whitespace-nowrap text-xs font-medium bg-ink text-gold px-3 py-1.5 rounded-sm hover:bg-ink-light transition-colors">
                  Unit {u.unit_number} — {u.unit_title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink gold-underline">Recent Notes</h2>
            <p className="text-sm text-ink/50 mt-3">Latest contributions from students</p>
          </div>
          <Link href="/blog" className="text-sm text-[var(--gold-dark)] hover:underline font-medium">View all →</Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-ink/40">
            <p className="font-serif text-xl mb-2">No notes yet.</p>
            <p className="text-sm">Be the first to contribute!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div key={post.id} className={`fade-up-delay-${Math.min(i+1,3)}`}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-[var(--border)] bg-ink text-parchment/60">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-xs font-mono">
          <span>DBS Notes · Database Systems · CST, RUB</span>
          <span>Built with Next.js · Supabase · Clerk</span>
        </div>
      </footer>
    </>
  )
}
