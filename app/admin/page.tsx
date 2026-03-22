import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserRole } from '@/lib/roles'
import Navbar from '@/components/Navbar'
import AdminPanel from './AdminPanel'

export default async function AdminPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const role = await getUserRole()
  if (role !== 'admin') redirect('/')

  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 pb-6 border-b border-[var(--border)]">
          <span className="text-xs font-mono text-[var(--gold-dark)] uppercase tracking-widest">Admin Panel</span>
          <h1 className="font-serif text-2xl font-semibold text-ink mt-1">Site Management</h1>
          <p className="text-sm text-ink/50 mt-1">Manage all posts and users across the platform.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Posts', value: posts?.length ?? 0 },
            { label: 'Published', value: posts?.filter(p => p.published).length ?? 0 },
            { label: 'Drafts', value: posts?.filter(p => !p.published).length ?? 0 },
            { label: 'Users', value: profiles?.length ?? 0 },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-[var(--border)] rounded-sm p-4 text-center">
              <div className="font-serif text-3xl font-bold text-ink">{stat.value}</div>
              <div className="text-xs font-mono text-ink/40 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <AdminPanel initialPosts={posts ?? []} initialProfiles={profiles ?? []} />
      </div>
    </>
  )
}
