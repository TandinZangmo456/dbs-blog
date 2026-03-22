'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Post } from '@/types'

export default function DashboardPosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (res.ok) { setPosts(prev => prev.filter(p => p.id !== id)); router.refresh() }
    else alert('Failed to delete post.')
  }

  if (posts.length === 0) return (
    <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-sm">
      <p className="font-serif text-lg text-ink/40 mb-2">No notes yet.</p>
      <p className="text-sm text-ink/30 mb-6">Start documenting what you've learned in class.</p>
      <Link href="/dashboard/new" className="bg-ink text-gold px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-ink-light transition-colors">
        Write your first note
      </Link>
    </div>
  )

  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-4">Your Notes</h2>
      <div className="space-y-2">
        {posts.map(post => {
          const date = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          return (
            <div key={post.id} className="flex items-center justify-between bg-white border border-[var(--border)] rounded-sm px-5 py-4 hover:border-[var(--gold)]/40 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <span className="badge-unit shrink-0">Unit {post.unit_number}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-ink truncate">{post.title}</p>
                  <p className="text-xs text-ink/40 font-mono mt-0.5">{date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${post.published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <Link href={`/blog/${post.slug}`} className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-sm text-ink/60 hover:text-ink transition-colors">View</Link>
                <Link href={`/dashboard/edit/${post.id}`} className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-sm text-ink/60 hover:text-ink transition-colors">Edit</Link>
                <button onClick={() => handleDelete(post.id)} className="text-xs border border-red-200 px-3 py-1.5 rounded-sm text-red-400 hover:text-red-600 hover:border-red-400 transition-colors">Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
