import type { Post, Member, Resource, Conversation, ChatMessage } from './types';
import { Timestamp } from 'firebase/firestore';

const commonAvatar = "https://placehold.co/40x40.png";
const commonSchool = "CampusConnect Academy";

// Helper to create a Firestore Timestamp from a Date
const dateToTimestamp = (date: Date): Timestamp => Timestamp.fromDate(date);

export const mockMentors: Member[] = [
  { id: 'mentor-1', name: 'Dr. Ada Lovelace', role: 'mentor', avatarUrl: `${commonAvatar}?text=AL`, school: commonSchool, email: 'ada@example.com' },
  { id: 'mentor-2', name: 'Mr. Alan Turing', role: 'mentor', avatarUrl: `${commonAvatar}?text=AT`, school: commonSchool, email: 'alan@example.com' },
  { id: 'admin-1', name: 'Ms. Grace Hopper', role: 'admin', avatarUrl: `${commonAvatar}?text=GH`, school: commonSchool, email: 'grace@example.com' },
];

export const mockStudents: Member[] = [
  { id: 'student-1', name: 'Charlie Brown', role: 'student', avatarUrl: `${commonAvatar}?text=CB`, school: commonSchool, email: 'charlie@example.com' },
  { id: 'student-2', name: 'Lucy van Pelt', role: 'student', avatarUrl: `${commonAvatar}?text=LP`, school: commonSchool, email: 'lucy@example.com' },
  { id: 'student-3', name: 'Linus van Pelt', role: 'student', avatarUrl: `${commonAvatar}?text=LV`, school: commonSchool, email: 'linus@example.com' },
];

export const mockMembers: Member[] = [...mockMentors, ...mockStudents, mockMentors[2]]; // Adding Grace as admin

export const mockPosts: Post[] = [
  {
    id: 'mock-post-1',
    author: mockMentors[0],
    content: 'Welcome to the new semester! Excited to explore the world of computer science with you all. #compsci #education This is mock data.',
    mediaUrl: 'https://placehold.co/600x400.png',
    mediaType: 'image',
    likes: 15,
    commentsCount: 3,
    createdAt: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 2)), // 2 hours ago
    aiHint: 'classroom technology',
  },
  {
    id: 'mock-post-2',
    author: mockMentors[1],
    content: 'Just posted a new quiz on algorithms. Test your knowledge! #quiz #algorithms This is mock data.',
    likes: 22,
    commentsCount: 5,
    createdAt: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 24)), // 1 day ago
  },
  {
    id: 'mock-post-3',
    author: mockStudents[0], 
    content: 'Had a great time at the science fair today! So many cool projects. #sciencefair #learning This is mock data.',
    mediaUrl: 'https://placehold.co/600x400.png',
    mediaType: 'image',
    likes: 8,
    commentsCount: 1,
    createdAt: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 5)), // 5 hours ago
    aiHint: 'students presentation',
  },
];

export const mockResources: Resource[] = [
  {
    id: 'resource-1',
    title: 'Introduction to Python Programming (Mock)',
    description: 'A comprehensive guide for beginners to learn Python from scratch. Covers basics to intermediate concepts. (Mock Data)',
    type: 'document',
    subject: 'Computer Science',
    grade: '10-12',
    addedBy: mockMentors[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Keep as string as per type
    coverImageUrl: 'https://placehold.co/300x200.png',
    aiHint: 'programming book',
  },
  {
    id: 'resource-2',
    title: 'The Beauty of Fractals - Video Lecture (Mock)',
    description: 'An engaging video lecture explaining the mathematical beauty and applications of fractals. (Mock Data)',
    type: 'video',
    url: '#', 
    subject: 'Mathematics',
    grade: '11-12',
    addedBy: mockMentors[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    coverImageUrl: 'https://placehold.co/300x200.png',
    aiHint: 'math lecture',
  },
];

// Mock data for Chat
const currentUserMockId = 'student-1'; // Assuming Charlie Brown is the current user for mock context

export const mockConversations: Conversation[] = [
  {
    id: 'mock-convo-1',
    participantIds: [currentUserMockId, 'mentor-1'],
    participantNames: {
      [currentUserMockId]: mockStudents[0].name,
      ['mentor-1']: mockMentors[0].name,
    },
    participantAvatars: {
      [currentUserMockId]: mockStudents[0].avatarUrl,
      ['mentor-1']: mockMentors[0].avatarUrl,
    },
    isGroup: false,
    lastMessageText: "Sure, I can help with that! (Mock)",
    lastMessageTimestamp: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 5)), // 5 minutes ago
    lastMessageSenderId: 'mentor-1',
  },
  {
    id: 'mock-convo-2',
    participantIds: [currentUserMockId, 'student-2', 'student-3'],
    participantNames: {
      [currentUserMockId]: mockStudents[0].name,
      ['student-2']: mockStudents[1].name,
      ['student-3']: mockStudents[2].name,
    },
    participantAvatars: {
      [currentUserMockId]: mockStudents[0].avatarUrl,
      ['student-2']: mockStudents[1].avatarUrl,
      ['student-3']: mockStudents[2].avatarUrl,
    },
    isGroup: true,
    groupName: 'Study Group (Mock)',
    groupAvatar: 'https://placehold.co/40x40.png?text=SG',
    lastMessageText: "Let's meet tomorrow. (Mock)",
    lastMessageTimestamp: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 60)), // 1 hour ago
    lastMessageSenderId: 'student-2',
  }
];

export const mockMessages: { [conversationId: string]: ChatMessage[] } = {
  'mock-convo-1': [
    {
      id: 'mock-msg-1-1',
      senderId: currentUserMockId,
      senderName: mockStudents[0].name,
      senderAvatar: mockStudents[0].avatarUrl,
      text: 'Hi Dr. Lovelace, I have a question about the assignment. (Mock)',
      timestamp: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 10)), // 10 minutes ago
    },
    {
      id: 'mock-msg-1-2',
      senderId: 'mentor-1',
      senderName: mockMentors[0].name,
      senderAvatar: mockMentors[0].avatarUrl,
      text: "Sure, I can help with that! (Mock)",
      timestamp: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 5)), // 5 minutes ago
    },
  ],
  'mock-convo-2': [
    {
      id: 'mock-msg-2-1',
      senderId: 'student-2',
      senderName: mockStudents[1].name,
      senderAvatar: mockStudents[1].avatarUrl,
      text: "Hey everyone, how's the project coming along? (Mock)",
      timestamp: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 2)), // 2 hours ago
    },
    {
      id: 'mock-msg-2-2',
      senderId: currentUserMockId,
      senderName: mockStudents[0].name,
      senderAvatar: mockStudents[0].avatarUrl,
      text: "Pretty good, almost done with my part. (Mock)",
      timestamp: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 55)), // 55 minutes ago
    },
    {
      id: 'mock-msg-2-3',
      senderId: 'student-2',
      senderName: mockStudents[1].name,
      senderAvatar: mockStudents[1].avatarUrl,
      text: "Let's meet tomorrow. (Mock)",
      timestamp: dateToTimestamp(new Date(Date.now() - 1000 * 60 * 60)), // 1 hour ago (Oops, made this earlier than previous for demo)
    },
  ]
};
// Ensure mockMembers includes an admin for testing purposes
if (!mockMembers.find(m => m.role === 'admin')) {
  mockMembers.push({ id: 'admin-user', name: 'Admin User', role: 'admin', avatarUrl: `${commonAvatar}?text=AU`, school: commonSchool, email: 'admin@example.com' });
}
