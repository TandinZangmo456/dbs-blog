import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Post } from '@/types'

interface Props { params: { slug: string } }

async function getPost(slug: string): Promise<Post | null> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <>
      <Navbar />

      <article className="max-w-4xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-ink/40 mb-8">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-ink">Notes</Link>
          <span>/</span>
          <span className="text-ink/70">Unit {post.unit_number}</span>
        </nav>

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-unit">Unit {post.unit_number}</span>
            <span className="text-xs text-ink/40 font-mono">{post.unit_title}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-sm text-gold font-bold">
                {post.author_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-ink">{post.author_name}</div>
                <div className="text-xs text-ink/50">{date}</div>
              </div>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-ink/50 bg-parchment-dark border border-[var(--border)] px-2 py-0.5 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:text-ink
          prose-p:text-ink/80 prose-p:leading-relaxed
          prose-a:text-[var(--gold-dark)] prose-a:no-underline hover:prose-a:underline
          prose-code:font-mono prose-code:bg-parchment-dark prose-code:text-ink prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-ink prose-pre:text-parchment
          prose-blockquote:border-l-[var(--gold)] prose-blockquote:text-ink/60
          prose-hr:border-[var(--border)]
          prose-th:text-ink prose-th:font-semibold
          prose-strong:text-ink">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-[var(--border)] flex items-center justify-between">
          <Link href="/blog" className="text-sm text-ink/50 hover:text-ink flex items-center gap-2">
            ← Back to all notes
          </Link>
          <span className="text-xs font-mono text-ink/30">DBS Notes · {date}</span>
        </div>

      </article>
    </>
  )
}
