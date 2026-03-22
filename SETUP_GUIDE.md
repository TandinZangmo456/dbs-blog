# DBS Notes Blog — Complete Setup Guide

A professional academic blog for Database Systems students.  
Stack: **Next.js 14 · Supabase · Clerk · Tailwind CSS · Vercel**

---

## Overview of Roles

| Role     | Can Do                                              |
|----------|-----------------------------------------------------|
| Guest    | Browse and read all published posts                 |
| Student  | Write, edit, delete **their own** posts             |
| Teacher  | View all posts (including drafts) at `/teacher`     |
| Admin    | Full control — manage all posts + assign roles at `/admin` |

---

## Step 1 — Clone & Install

```bash
# After downloading the project files:
cd dbs-blog
npm install
```

---

## Step 2 — Set Up Clerk (Authentication)

1. Go to **https://clerk.com** and create a free account
2. Create a new application — name it "DBS Notes"
3. Choose **Email + Password** as sign-in method (you can add Google later)
4. In the Clerk dashboard, go to **API Keys**
5. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

---

## Step 3 — Set Up Supabase (Database)

1. Go to **https://supabase.com** and create a free account
2. Create a new project — name it "dbs-notes"
3. Wait for it to finish setting up (~1 min)
4. Go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → click **Run**
5. Go to **Project Settings → API**
6. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 4 — Create `.env.local`

In the root of your project, create a file called `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxxxxxxxxxxx
```

> ⚠️ Never commit `.env.local` to GitHub!

---

## Step 5 — Fix Dynamic Route Folders

The API routes and page routes use dynamic segments.
You need to rename two folders manually:

```
app/api/posts/id/           →   app/api/posts/[id]/
app/api/admin/posts/id/     →   app/api/admin/posts/[id]/
app/api/admin/users/clerkId/→   app/api/admin/users/[clerkId]/
app/dashboard/edit/id/      →   app/dashboard/edit/[id]/
app/blog/slug/              →   app/blog/[slug]/
```

**In your terminal:**
```bash
mv app/api/posts/id           "app/api/posts/[id]"
mv app/api/admin/posts/id     "app/api/admin/posts/[id]"
mv app/api/admin/users/clerkId "app/api/admin/users/[clerkId]"
mv app/dashboard/edit/id      "app/dashboard/edit/[id]"
mv app/blog/slug              "app/blog/[slug]"
```

> Note: The brackets `[id]` are special Next.js dynamic route syntax.
> They couldn't be created directly in this guide, so rename them now.

---

## Step 6 — Run Locally

```bash
npm run dev
```

Open **http://localhost:3000** — your blog is running!

---

## Step 7 — Make Yourself an Admin

1. Sign up at your blog
2. In **Supabase → Table Editor → profiles**, find your row
3. Change your `role` from `student` to `admin`
4. Now visit `/admin` — you can manage all users and posts

**To assign Teacher role to someone:**
- Visit `/admin` → Users tab → change their role dropdown to `Teacher`
- They can now access `/teacher` for the read-only view

---

## Step 8 — Deploy to Vercel

1. Push your code to a **GitHub repository**
2. Go to **https://vercel.com** → New Project → import your repo
3. Add all your environment variables (same as `.env.local`) in Vercel's settings
4. Click **Deploy** — done! 🎉

---

## Project Structure

```
dbs-blog/
├── app/
│   ├── page.tsx                    ← Homepage
│   ├── layout.tsx                  ← Root layout (Clerk provider)
│   ├── globals.css                 ← Design tokens & styles
│   ├── sign-in/page.tsx            ← Sign in page
│   ├── sign-up/page.tsx            ← Sign up page
│   ├── blog/
│   │   ├── page.tsx                ← All posts (with unit filter)
│   │   └── [slug]/page.tsx         ← Individual post
│   ├── dashboard/
│   │   ├── page.tsx                ← Student: view own posts
│   │   ├── DashboardPosts.tsx      ← Client component for CRUD
│   │   ├── new/page.tsx            ← Create new post
│   │   └── edit/[id]/page.tsx      ← Edit a post
│   ├── admin/
│   │   ├── page.tsx                ← Admin: manage all posts & users
│   │   └── AdminPanel.tsx          ← Client component
│   ├── teacher/
│   │   └── page.tsx                ← Teacher: read-only all posts
│   └── api/
│       ├── posts/
│       │   ├── route.ts            ← GET all, POST new
│       │   └── [id]/route.ts       ← PATCH, DELETE by id
│       └── admin/
│           ├── posts/[id]/route.ts ← Admin post management
│           └── users/[clerkId]/route.ts ← Admin role assignment
├── components/
│   ├── Navbar.tsx                  ← Site navigation
│   ├── PostCard.tsx                ← Post preview card
│   └── PostEditor.tsx              ← Create/Edit form
├── lib/
│   ├── supabase.ts                 ← Supabase client
│   └── roles.ts                   ← Role & profile helpers
├── types/index.ts                  ← TypeScript types
├── middleware.ts                   ← Clerk route protection
├── supabase-schema.sql             ← Run this in Supabase SQL Editor
└── .env.local.example              ← Copy → .env.local and fill in keys
```

---

## Key Features

- ✅ Students can **Create, Edit, Delete** their own posts
- ✅ Teachers see all posts (including drafts) at `/teacher`
- ✅ Admins can manage everything + assign roles at `/admin`
- ✅ Guests can browse and read all published posts
- ✅ Posts grouped by **unit number** for easy navigation
- ✅ **Markdown** support for rich content
- ✅ Professional academic design with Playfair Display serif font
- ✅ Fully deployed on Vercel

