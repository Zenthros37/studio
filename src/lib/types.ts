import type { UserRole } from '@/contexts/UserContext';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  school: string;
  email?: string; // Optional
}

export interface Post {
  id: string;
  author: Pick<UserProfile, 'id' | 'name' | 'avatarUrl' | 'role'>;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  commentsCount: number;
  createdAt: string; // ISO date string
  aiHint?: string; // For placeholder images
}

export interface Comment {
  id: string;
  author: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>;
  text: string;
  createdAt: string; // ISO date string
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'quiz'; // Example types
  url?: string; // For link or video
  filePath?: string; // For document
  subject: string;
  grade: string;
  addedBy: Pick<UserProfile, 'id' | 'name'>;
  createdAt: string; // ISO date string
  coverImageUrl?: string;
  aiHint?: string; // For placeholder images
}

export interface Member extends UserProfile {
  // Member specific properties can be added here if any
}