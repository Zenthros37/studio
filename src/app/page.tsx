
"use client";
import LoginForm from '@/components/auth/LoginForm';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/feed'); // Redirect to feed if already logged in
    }
  }, [user, isLoading, router]);

  if (isLoading) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
     );
  }
  
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
        {/* TODO: Add Registration form or link here for a full registration flow */}
        <LoginForm />
      </div>
    );
  }
  
  // If user is loaded and exists, redirection to /feed is imminent.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Redirecting...</p>
    </div>
  );
}
