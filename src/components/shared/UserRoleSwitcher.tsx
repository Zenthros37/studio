"use client";
import { useUser, type UserRole } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

export default function UserRoleSwitcher() {
  const { user, login, isLoading } = useUser();

  const handleRoleChange = (newRole: string) => {
    if (isLoading) return;
    login(newRole as UserRole);
  };

  if (!user && !isLoading) return null; // Don't show if not logged in and not loading
  if (isLoading) return <Button variant="outline" size="sm" disabled>Loading roles...</Button>;


  return (
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-muted-foreground hidden md:block" />
      <Select onValueChange={handleRoleChange} defaultValue={user?.role}>
        <SelectTrigger className="w-auto h-9 text-xs md:text-sm md:w-[120px] bg-transparent border-muted hover:border-primary focus:ring-primary">
          <SelectValue placeholder="Switch Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="mentor">Mentor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
