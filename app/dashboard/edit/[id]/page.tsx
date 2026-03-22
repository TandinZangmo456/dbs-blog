import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import PostEditor from '@/components/PostEditor'

interface Props { params: { id: string } }

export default async function EditPostPage({ params }: Props) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .eq('author_id', userId)
    .single()

  if (!post) notFound()

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <PostEditor mode="edit" initialData={post} postId={post.id} />
      </div>
    </>
  )
}
