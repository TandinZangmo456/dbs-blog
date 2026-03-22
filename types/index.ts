export type Role = 'student' | 'teacher' | 'admin'

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  unit_number: number
  unit_title: string
  tags: string[]
  cover_url: string | null
  author_id: string
  author_name: string
  author_email: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  clerk_id: string
  email: string
  full_name: string
  role: Role
  created_at: string
}
