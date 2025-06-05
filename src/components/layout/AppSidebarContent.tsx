
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Users, Library, ClipboardList, Gamepad2, MessageSquare, BarChartBig, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/feed', label: 'Feed', icon: Home, roles: ['student', 'mentor', 'admin'] }, // Updated href
  { href: '/members', label: 'Members', icon: Users, roles: ['student', 'mentor', 'admin'] },
  { href: '/library', label: 'Library', icon: Library, roles: ['student', 'mentor', 'admin'] },
  { href: '/quizzes', label: 'Quizzes', icon: ClipboardList, roles: ['student', 'mentor', 'admin'] },
  { href: '/games', label: 'Games', icon: Gamepad2, roles: ['student'] },
  { href: '/chat', label: 'Chat', icon: MessageSquare, roles: ['student', 'mentor', 'admin'] },
];

const adminNavItems = [
  { href: '/analytics', label: 'Analytics', icon: BarChartBig, roles: ['admin', 'mentor'] },
  { href: '/manage-users', label: 'Manage Users', icon: ShieldCheck, roles: ['admin'] },
];

export default function AppSidebarContent() {
  const { user, logout } = useUser();
  const pathname = usePathname();

  if (!user) return null;

  const availableNavItems = navItems.filter(item => item.roles.includes(user.role));
  const availableAdminNavItems = adminNavItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/settings#profile" className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-sidebar-foreground">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/80">{user.role} - {user.school}</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {availableNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className={cn(pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground")}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {availableAdminNavItems.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              {availableAdminNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                       className={cn(pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground")}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" passHref legacyBehavior>
              <SidebarMenuButton isActive={pathname === '/settings'} tooltip="Settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Log Out" variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600">
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
