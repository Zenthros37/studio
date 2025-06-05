
"use client";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, type UserRole } from '@/contexts/UserContext'; // Ensure UserRole is imported
import MainLayout from './MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';


export default function ProtectedPage({ children, allowedRoles }: { children: ReactNode, allowedRoles?: UserRole[] }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/'); // Redirect to the main page (which is now login)
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // If roles are specified and user doesn't have one, redirect to feed page
      router.push('/feed'); 
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !user) {
    // For initial load or if user is null (before redirection), show a more generic loading screen
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading user session...</p>
        </div>
      </div>
    );
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
     // This state means user is logged in but not authorized for this specific page.
     // Redirection to /feed is handled by the useEffect. Show loading while redirecting.
     return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Checking authorization... Redirecting...</p>
        </div>
      </div>
    );
  }

  // If user exists and (no specific roles are required OR user has an allowed role)
  return <MainLayout>{children}</MainLayout>;
}
