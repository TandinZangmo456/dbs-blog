import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { ensureProfile } from '@/lib/roles'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import DashboardPosts from './DashboardPosts'

export default async function DashboardPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  const profile = await ensureProfile()
  if (!profile) redirect('/sign-in')
  const { data: posts } = await supabaseAdmin.from('posts').select('*').eq('author_id', userId).order('created_at', { ascending: false })
  const myPosts = posts ?? []

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-10 pb-8 border-b border-[var(--border)]">
          <div>
            <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-1">My Dashboard</p>
            <h1 className="font-serif text-2xl font-semibold text-ink">Hello, {profile.full_name || 'Student'} 👋</h1>
            <p className="text-sm text-ink/50 mt-1">
              {myPosts.length} note{myPosts.length !== 1 ? 's' : ''} contributed · Role:{' '}
              <span className="font-medium text-[var(--gold-dark)] capitalize">{profile.role}</span>
            </p>
          </div>
          <Link href="/dashboard/new" className="bg-ink text-gold px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-ink-light transition-colors">
            + Write New Note
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Notes', value: myPosts.length },
            { label: 'Published', value: myPosts.filter(p => p.published).length },
            { label: 'Drafts', value: myPosts.filter(p => !p.published).length },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-[var(--border)] rounded-sm p-4 text-center">
              <div className="font-serif text-2xl font-bold text-ink">{stat.value}</div>
              <div className="text-xs font-mono text-ink/40 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <DashboardPosts initialPosts={myPosts} />
      </div>
    </>
  )
}
