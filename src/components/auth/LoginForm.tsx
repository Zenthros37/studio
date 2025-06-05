
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, type UserRole } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const [email, setEmail] = useState('student@example.com'); // Default for easier testing
  const [password, setPassword] = useState('password'); // Default for easier testing
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const { loginWithEmail, isLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      await loginWithEmail(email, password, selectedRole);
      router.push('/feed'); // Redirect to feed page on successful login
      toast({ title: "Login Successful", description: `Welcome back, ${selectedRole}!` });
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed. Please check your credentials.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      toast({ title: "Login Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <CardTitle className="font-headline text-3xl">Welcome to CampusConnect</CardTitle>
        <CardDescription>Please sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Sign in as</Label>
            <Select onValueChange={(value) => setSelectedRole(value as UserRole)} defaultValue="student">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : <> <LogIn className="mr-2 h-4 w-4" /> Sign In </>}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-sm">
        <p>Don't have an account? <span className="text-primary hover:underline cursor-pointer">Contact admin</span></p>
        <p className="mt-2 text-muted-foreground text-xs">
          (For demo: student@example.com / password)
        </p>
      </CardFooter>
    </Card>
  );
}
