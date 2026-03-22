import Link from 'next/link'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  showActions?: boolean
  onDelete?: (id: string) => void
}

export default function PostCard({ post, showActions, onDelete }: PostCardProps) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <article className="post-card rounded-sm overflow-hidden fade-up">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge-unit">Unit {post.unit_number}</span>
          <span className="text-xs text-ink/50 font-mono">{date}</span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="font-serif text-xl font-semibold text-ink leading-tight hover:text-[var(--gold-dark)] transition-colors mb-2 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-ink/65 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center text-[10px] text-gold font-bold">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-ink/60">{post.author_name}</span>
          </div>

          <div className="flex items-center gap-2">
            {showActions ? (
              <>
                <Link href={`/dashboard/edit/${post.id}`}
                  className="text-xs text-ink/50 hover:text-ink border border-[var(--border)] px-3 py-1 rounded-sm transition-colors">
                  Edit
                </Link>
                <button onClick={() => onDelete?.(post.id)}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1 rounded-sm transition-colors">
                  Delete
                </button>
              </>
            ) : (
              <Link href={`/blog/${post.slug}`}
                className="text-xs text-[var(--gold-dark)] hover:underline font-medium">
                Read →
              </Link>
            )}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-[10px] font-mono text-ink/50 bg-parchment-dark px-2 py-0.5 rounded-sm">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
