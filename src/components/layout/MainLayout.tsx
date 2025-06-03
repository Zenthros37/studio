"use client";
import type { ReactNode } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar'; // Corrected path
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();

  if (!user) {
    // This should ideally not be reached if ProtectedPage handles redirection,
    // but as a fallback or if MainLayout is used elsewhere.
    return null; 
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("flex min-h-screen flex-col", user.role === 'admin' ? 'bg-muted/20' : 'bg-background')}>
        <AppHeader />
        <div className="flex flex-1 pt-14"> {/* pt-14 to offset fixed AppHeader height */}
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}