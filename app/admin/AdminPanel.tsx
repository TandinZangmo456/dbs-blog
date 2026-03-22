'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Post, UserProfile } from '@/types'

interface Props {
  initialPosts: Post[]
  initialProfiles: UserProfile[]
}

export default function AdminPanel({ initialPosts, initialProfiles }: Props) {
  const [posts, setPosts] = useState(initialPosts)
  const [profiles, setProfiles] = useState(initialProfiles)
  const [tab, setTab] = useState<'posts' | 'users'>('posts')
  const router = useRouter()

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.id !== id))
      router.refresh()
    }
  }

  const togglePublish = async (id: string, current: boolean) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    })
    if (res.ok) {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !current } : p))
    }
  }

  const updateRole = async (clerkId: string, role: string) => {
    const res = await fetch(`/api/admin/users/${clerkId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    if (res.ok) {
      setProfiles(prev => prev.map(p => p.clerk_id === clerkId ? { ...p, role: role as any } : p))
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)] mb-6">
        {(['posts', 'users'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'border-b-2 border-ink text-ink'
                : 'text-ink/50 hover:text-ink'
            }`}
          >
            {t} ({t === 'posts' ? posts.length : profiles.length})
          </button>
        ))}
      </div>

      {/* Posts tab */}
      {tab === 'posts' && (
        <div className="space-y-2">
          {posts.map(post => {
            const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            return (
              <div key={post.id} className="flex items-center justify-between bg-white border border-[var(--border)] rounded-sm px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="badge-unit shrink-0">U{post.unit_number}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{post.title}</p>
                    <p className="text-xs text-ink/40 font-mono">{post.author_name} · {date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => togglePublish(post.id, post.published)}
                    className={`text-xs font-mono px-2 py-1 rounded-sm border transition-colors ${
                      post.published
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                  <Link href={`/blog/${post.slug}`} className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-sm text-ink/60 hover:text-ink transition-colors">View</Link>
                  <button onClick={() => deletePost(post.id)} className="text-xs border border-red-200 px-3 py-1.5 rounded-sm text-red-400 hover:text-red-600 hover:border-red-400 transition-colors">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div className="space-y-2">
          {profiles.map(profile => (
            <div key={profile.id} className="flex items-center justify-between bg-white border border-[var(--border)] rounded-sm px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-sm text-gold font-bold shrink-0">
                  {profile.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{profile.full_name || 'Unnamed'}</p>
                  <p className="text-xs text-ink/40 font-mono">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={profile.role}
                  onChange={e => updateRole(profile.clerk_id, e.target.value)}
                  className="text-xs border border-[var(--border)] rounded-sm px-2 py-1.5 bg-white text-ink focus:outline-none focus:border-[var(--gold)]"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
