'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

export default function Navbar() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Notes' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-parchment/95 backdrop-blur-sm border-b border-[var(--border)]">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-ink rounded-sm flex items-center justify-center">
            <span className="text-gold font-serif font-bold text-sm">DB</span>
          </div>
          <div className="leading-none">
            <div className="font-serif font-semibold text-ink text-base tracking-tight">DBS Notes</div>
            <div className="text-[10px] tracking-widest uppercase text-[var(--gold-dark)] font-mono">Database Systems</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors ${pathname === link.href ? 'text-[var(--gold-dark)]' : 'text-ink/70 hover:text-ink'}`}>
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <>
              <Link href="/dashboard"
                className={`text-sm font-medium tracking-wide transition-colors ${pathname.startsWith('/dashboard') ? 'text-[var(--gold-dark)]' : 'text-ink/70 hover:text-ink'}`}>
                My Posts
              </Link>
              <Link href="/dashboard/new"
                className="text-sm font-medium bg-ink text-gold px-4 py-1.5 rounded-sm hover:bg-ink-light transition-colors">
                + Write
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="text-sm text-ink/70 hover:text-ink font-medium px-3 py-1.5 transition-colors">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm bg-ink text-gold px-4 py-1.5 rounded-sm hover:bg-ink-light transition-colors font-medium">Sign up</button>
              </SignUpButton>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
