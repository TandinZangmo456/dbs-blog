import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserRole } from '@/lib/roles'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'

export default async function TeacherPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const role = await getUserRole()
  if (role !== 'teacher' && role !== 'admin') redirect('/')

  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('unit_number', { ascending: true })
    .order('created_at', { ascending: false })

  const allPosts = posts ?? []

  // Group by unit
  const byUnit: Record<number, typeof allPosts> = {}
  allPosts.forEach(p => {
    if (!byUnit[p.unit_number]) byUnit[p.unit_number] = []
    byUnit[p.unit_number].push(p)
  })

  // Students with post counts
  const studentMap: Record<string, { name: string; count: number }> = {}
  allPosts.forEach(p => {
    if (!studentMap[p.author_id]) studentMap[p.author_id] = { name: p.author_name, count: 0 }
    studentMap[p.author_id].count++
  })

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="mb-10 pb-6 border-b border-[var(--border)]">
          <span className="text-xs font-mono text-[var(--gold-dark)] uppercase tracking-widest">Teacher View</span>
          <h1 className="font-serif text-2xl font-semibold text-ink mt-1">Student Submissions</h1>
          <p className="text-sm text-ink/50 mt-1">
            Read-only view of all student notes — {allPosts.length} total posts from {Object.keys(studentMap).length} students.
          </p>
        </div>

        {/* Student Summary */}
        <section className="mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-4">Student Contributions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(studentMap).map(([id, s]) => (
              <div key={id} className="bg-white border border-[var(--border)] rounded-sm p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-gold font-bold text-sm shrink-0">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{s.name}</p>
                  <p className="text-xs text-ink/40 font-mono">{s.count} note{s.count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Posts by unit */}
        <section>
          {Object.keys(byUnit).map(Number).sort((a, b) => a - b).map(unitNum => (
            <div key={unitNum} className="mb-12">
              <div className="flex items-center gap-4 mb-5">
                <span className="badge-unit">Unit {unitNum}</span>
                <h2 className="font-serif text-lg font-semibold text-ink">
                  {byUnit[unitNum][0]?.unit_title}
                </h2>
                <div className="flex-1 border-t border-[var(--border)]" />
                <span className="text-xs text-ink/40 font-mono">{byUnit[unitNum].length} notes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {byUnit[unitNum].map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </>
  )
}
