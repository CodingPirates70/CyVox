import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/navbar';
import { HomePage } from '@/pages/home';
import { RecordsPage } from '@/pages/records';    
import { ProtectedRoute } from '@/components/protected-routes';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we have a valid Clerk key (not the placeholder)
const hasValidClerkKey = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' && 
  PUBLISHABLE_KEY.startsWith('pk_');

function AppContent() {
  return (
    <div className="min-h-screen bg-background pt-16"> {/* Added pt-16 for navbar spacing */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/records" 
          element={
            hasValidClerkKey ? (
              <ProtectedRoute>
                <RecordsPage />
              </ProtectedRoute>
            ) : (
              <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                    Authentication Setup Required
                  </h2>
                  <p className="text-yellow-700 text-sm">
                    To access protected routes, please set up your Clerk publishable key in the .env file.
                  </p>
                </div>
              </div>
            )
        } />
      </Routes>
      <Toaster />
    </div>
  );
}

function App() {
  // If we don't have a valid Clerk key, render without ClerkProvider
  if (!hasValidClerkKey) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="voice-app-theme">
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    );
  }

  // If we have a valid key, use ClerkProvider
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider defaultTheme="system" storageKey="voice-app-theme">
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;