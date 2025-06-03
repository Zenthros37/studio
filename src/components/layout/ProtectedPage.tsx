"use client";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import MainLayout from './MainLayout';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProtectedPage({ children, allowedRoles }: { children: ReactNode, allowedRoles?: UserRole[] }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // If roles are specified and user doesn't have one, redirect to home or an unauthorized page
      router.push('/'); 
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <p>You are not authorized to view this page. Redirecting...</p>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}