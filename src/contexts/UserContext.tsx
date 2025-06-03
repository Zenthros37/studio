"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';

export type UserRole = 'student' | 'mentor' | 'admin';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
  setUser: (user: UserProfile | null) => void; // Allow direct setting for flexibility
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, Omit<UserProfile, 'id' | 'school'>> = {
  student: { name: 'Studious Student', role: 'student', avatarUrl: 'https://placehold.co/100x100.png?text=S' },
  mentor: { name: 'Inspiring Mentor', role: 'mentor', avatarUrl: 'https://placehold.co/100x100.png?text=M' },
  admin: { name: 'Efficient Admin', role: 'admin', avatarUrl: 'https://placehold.co/100x100.png?text=A' },
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user from localStorage or a cookie
    try {
      const storedUser = localStorage.getItem('campusConnectUser');
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('campusConnectUser');
    }
    setIsLoading(false);
  }, []);

  const setUser = (userData: UserProfile | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('campusConnectUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('campusConnectUser');
    }
  };

  const login = (role: UserRole, name?: string) => {
    setIsLoading(true);
    const baseUser = MOCK_USERS[role];
    const loggedInUser: UserProfile = {
      id: `user-${Date.now()}`,
      ...baseUser,
      name: name || baseUser.name,
      school: 'CampusConnect Academy',
    };
    setUser(loggedInUser);
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};