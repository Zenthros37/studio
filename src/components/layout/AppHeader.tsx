"use client";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from '@/contexts/UserContext';
import { LogOut, Menu, Settings, UserCircle, Sun, Moon } from 'lucide-react';
import UserRoleSwitcher from '@/components/shared/UserRoleSwitcher';
import AppSidebarContent from './AppSidebarContent'; // To reuse sidebar content in mobile sheet
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function AppHeader() {
  const { user, logout } = useUser();
  const { toggleSidebar, isMobile } = useSidebar();
  const [mounted, setMounted] = useState(false);
  // Simple theme toggle example state - in a real app, use context or a library
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system/saved theme preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark));
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, mounted]);

  if (!mounted) {
    return <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6"></header>; // Placeholder for SSR
  }

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b bg-card px-4 shadow-sm md:px-6 print:hidden")}>
      <div className="flex items-center gap-4">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <AppSidebarContent />
            </SheetContent>
          </Sheet>
        )}
        {!isMobile && (
           <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
             <Menu className="h-5 w-5" />
             <span className="sr-only">Toggle Sidebar</span>
           </Button>
        )}
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <span className="font-headline text-xl font-semibold text-primary">CampusConnect</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <UserRoleSwitcher />
        <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.role} at {user.school}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings#profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}