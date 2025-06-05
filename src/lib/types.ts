import type { UserRole } from '@/contexts/UserContext';
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id: string; // Firebase UID
  name: string;
  role: UserRole;
  avatarUrl: string;
  school: string;
  email?: string; // Firebase Auth email
}

export interface Post {
  id: string; // Firestore document ID
  author: Pick<UserProfile, 'id' | 'name' | 'avatarUrl' | 'role'>; // Denormalized author info
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  commentsCount: number;
  createdAt: Timestamp; // Firestore Timestamp
  aiHint?: string;
}

export interface Comment {
  id: string;
  author: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>;
  text: string;
  createdAt: Timestamp; // Firestore Timestamp
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'quiz';
  url?: string;
  filePath?: string;
  subject: string;
  grade: string;
  addedBy: Pick<UserProfile, 'id' | 'name'>;
  createdAt: string; // Keep as string for now if not migrating this module
  coverImageUrl?: string;
  aiHint?: string;
}

export interface Member extends UserProfile {
  // Member specific properties can be added here if any
}

// Chat specific types
export interface ChatMessage {
  id: string; // Firestore document ID
  senderId: string;
  senderName: string; // Denormalized
  senderAvatar: string; // Denormalized
  text: string;
  timestamp: Timestamp; // Firestore Timestamp
}

export interface Conversation {
  id: string; // Firestore document ID
  participantIds: string[];
  participantNames: { [userId: string]: string }; // Denormalized for display
  participantAvatars: { [userId: string]: string }; // Denormalized for display
  lastMessageText?: string;
  lastMessageTimestamp?: Timestamp;
  lastMessageSenderId?: string;
  isGroup: boolean;
  groupName?: string; // if isGroup is true
  groupAvatar?: string; // if isGroup is true
}
