import { SignIn } from '@clerk/nextjs'
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-ink rounded-sm flex items-center justify-center mx-auto mb-3">
          <span className="text-gold font-serif font-bold text-lg">DB</span>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-ink">DBS Notes</h1>
        <p className="text-sm text-ink/50 mt-1">Sign in to contribute your unit notes</p>
      </div>
      <SignIn />
    </div>
  )
}
