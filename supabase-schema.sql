-- ============================================
-- DBS Notes Blog — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Profiles table (mirrors Clerk users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id    TEXT UNIQUE NOT NULL,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Posts table
CREATE TABLE IF NOT EXISTS posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  content      TEXT NOT NULL DEFAULT '',
  excerpt      TEXT NOT NULL DEFAULT '',
  unit_number  INT NOT NULL DEFAULT 1,
  unit_title   TEXT NOT NULL DEFAULT '',
  tags         TEXT[] DEFAULT '{}',
  cover_url    TEXT,
  author_id    TEXT NOT NULL,      -- Clerk user ID
  author_name  TEXT NOT NULL DEFAULT '',
  author_email TEXT NOT NULL DEFAULT '',
  published    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS posts_author_idx   ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_unit_idx     ON posts(unit_number);
CREATE INDEX IF NOT EXISTS posts_slug_idx     ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published);

-- 4. RLS (Row Level Security) — important!
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts    ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS (used by our API)
-- These policies allow public read of published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (published = TRUE);

-- Service role has full access (our Next.js API uses service role key)
-- No additional policies needed since we use supabaseAdmin (service role) server-side

-- 5. Optional: storage bucket for cover images
-- Run this if you want to add cover images later
-- INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
