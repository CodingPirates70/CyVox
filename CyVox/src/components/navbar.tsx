import { Home, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-50 rounded-full border bg-background/80 backdrop-blur-md shadow-lg">
      <div className="container flex h-14 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2 rounded-full"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <SignedIn>
            <Link to="/records">
              <Button
                variant={location.pathname === '/records' ? 'default' : 'ghost'}
                size="sm"
                className="gap-2 rounded-full"
              >
                <History className="h-4 w-4" />
                Past Records
              </Button>
            </Link>
          </SignedIn>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <Button size="sm" className="rounded-full">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}