'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/types'

interface PostEditorProps { initialData?: Partial<Post>; mode: 'create' | 'edit'; postId?: string }

const UNITS = [
  { num: 1, title: 'Introduction to Database Systems' },
  { num: 2, title: 'Entity-Relationship Model' },
  { num: 3, title: 'Relational Model' },
  { num: 4, title: 'SQL Fundamentals' },
  { num: 5, title: 'Database Design & Normalization' },
  { num: 6, title: 'Transaction Management' },
  { num: 7, title: 'Concurrency Control' },
  { num: 8, title: 'Database Recovery' },
]

export default function PostEditor({ initialData, mode, postId }: PostEditorProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    unit_number: initialData?.unit_number ?? 1,
    unit_title: initialData?.unit_title ?? UNITS[0].title,
    content: initialData?.content ?? '',
    excerpt: initialData?.excerpt ?? '',
    tags: initialData?.tags?.join(', ') ?? '',
    published: initialData?.published ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUnitChange = (num: number) => {
    const unit = UNITS.find(u => u.num === num)
    setForm(f => ({ ...f, unit_number: num, unit_title: unit?.title ?? '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const url = mode === 'create' ? '/api/posts' : `/api/posts/${postId}`
    const method = mode === 'create' ? 'POST' : 'PATCH'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) { const { error: msg } = await res.json(); setError(msg ?? 'Something went wrong.'); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">{mode === 'create' ? 'Write a New Note' : 'Edit Post'}</h1>
          <p className="text-sm text-ink/50 mt-1">Document what you learned in class, unit by unit.</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Post Title *</label>
          <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Introduction to NoSQL Databases — Unit 1 Notes"
            className="w-full font-serif text-xl text-ink bg-white border border-[var(--border)] rounded-sm px-4 py-3 focus:outline-none focus:border-[var(--gold)] placeholder:text-ink/25" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Unit Number *</label>
            <select value={form.unit_number} onChange={e => handleUnitChange(Number(e.target.value))}
              className="w-full text-sm text-ink bg-white border border-[var(--border)] rounded-sm px-3 py-2.5 focus:outline-none focus:border-[var(--gold)]">
              {UNITS.map(u => <option key={u.num} value={u.num}>Unit {u.num} — {u.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Tags <span className="text-ink/30">(comma separated)</span></label>
            <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="nosql, mongodb, cap-theorem"
              className="w-full text-sm text-ink bg-white border border-[var(--border)] rounded-sm px-3 py-2.5 focus:outline-none focus:border-[var(--gold)] placeholder:text-ink/25" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Excerpt <span className="text-ink/30">(shown on cards)</span></label>
          <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2}
            placeholder="A short 1–2 sentence summary..."
            className="w-full text-sm text-ink bg-white border border-[var(--border)] rounded-sm px-3 py-2.5 focus:outline-none focus:border-[var(--gold)] placeholder:text-ink/25 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-ink/50 mb-2">Content * <span className="text-ink/30">(Markdown supported)</span></label>
          <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={20}
            placeholder={`## Overview\n\nWrite your unit notes here...\n\n## Key Concepts\n\n- Point 1\n- Point 2`}
            className="w-full text-sm text-ink bg-white border border-[var(--border)] rounded-sm px-4 py-3 focus:outline-none focus:border-[var(--gold)] placeholder:text-ink/25 resize-y font-mono leading-relaxed" />
          <p className="text-xs text-ink/40 mt-1 font-mono">{form.content.length} characters · Supports GitHub Flavored Markdown</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-ink after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
          <span className="text-sm text-ink/70">{form.published ? 'Published — visible to everyone' : 'Draft — only visible to you'}</span>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
          <button type="submit" disabled={loading}
            className="bg-ink text-gold font-medium px-8 py-2.5 rounded-sm hover:bg-ink-light transition-colors disabled:opacity-50 text-sm">
            {loading ? 'Saving...' : mode === 'create' ? 'Publish Note' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.back()} className="text-sm text-ink/50 hover:text-ink px-4 py-2.5">Cancel</button>
        </div>
      </form>
    </div>
  )
}
