import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

export default function App() {
  return (
    <header>
      <SignedOut>
        <h1 className="text-2xl font-bold">pls sign in</h1>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <h1 className="text-2xl font-extralight bg-red-200">Welcome to My App</h1>
        <UserButton />
      </SignedIn>
    </header>
  )
}