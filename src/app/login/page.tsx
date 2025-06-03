"use client";
import LoginForm from '@/components/auth/LoginForm';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/'); // Redirect if already logged in
    }
  }, [user, isLoading, router]);

  if (isLoading) {
     return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10">Loading...</div>;
  }
  
  // Only show login form if not loading and no user
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
        <LoginForm />
      </div>
    );
  }
  
  // If user is loaded and exists, it means redirection is about to happen or has happened.
  // Showing loading or null prevents flicker of login form.
  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10">Redirecting...</div>;
}