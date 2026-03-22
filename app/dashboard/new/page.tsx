import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PostEditor from '@/components/PostEditor'

export default async function NewPostPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <PostEditor mode="create" />
      </div>
    </>
  )
}
