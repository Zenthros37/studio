import type { Post, Member, Resource } from './types';

const commonAvatar = "https://placehold.co/40x40.png";
const commonSchool = "CampusConnect Academy";

export const mockMentors: Member[] = [
  { id: 'mentor-1', name: 'Dr. Ada Lovelace', role: 'mentor', avatarUrl: `${commonAvatar}?text=AL`, school: commonSchool, email: 'ada@example.com' },
  { id: 'mentor-2', name: 'Mr. Alan Turing', role: 'mentor', avatarUrl: `${commonAvatar}?text=AT`, school: commonSchool, email: 'alan@example.com' },
];

export const mockStudents: Member[] = [
  { id: 'student-1', name: 'Charlie Brown', role: 'student', avatarUrl: `${commonAvatar}?text=CB`, school: commonSchool, email: 'charlie@example.com' },
  { id: 'student-2', name: 'Lucy van Pelt', role: 'student', avatarUrl: `${commonAvatar}?text=LP`, school: commonSchool, email: 'lucy@example.com' },
  { id: 'student-3', name: 'Linus van Pelt', role: 'student', avatarUrl: `${commonAvatar}?text=LV`, school: commonSchool, email: 'linus@example.com' },
];

export const mockMembers: Member[] = [...mockMentors, ...mockStudents];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    author: mockMentors[0],
    content: 'Welcome to the new semester! Excited to explore the world of computer science with you all. #compsci #education',
    mediaUrl: 'https://placehold.co/600x400.png',
    mediaType: 'image',
    likes: 15,
    commentsCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    aiHint: 'classroom technology',
  },
  {
    id: 'post-2',
    author: mockMentors[1],
    content: 'Just posted a new quiz on algorithms. Test your knowledge! #quiz #algorithms',
    likes: 22,
    commentsCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'post-3',
    author: mockStudents[0], // Students can also post if allowed by rules, for now just as example
    content: 'Had a great time at the science fair today! So many cool projects. #sciencefair #learning',
    mediaUrl: 'https://placehold.co/600x400.png',
    mediaType: 'image',
    likes: 8,
    commentsCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    aiHint: 'students presentation',
  },
];

export const mockResources: Resource[] = [
  {
    id: 'resource-1',
    title: 'Introduction to Python Programming',
    description: 'A comprehensive guide for beginners to learn Python from scratch. Covers basics to intermediate concepts.',
    type: 'document',
    subject: 'Computer Science',
    grade: '10-12',
    addedBy: mockMentors[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    coverImageUrl: 'https://placehold.co/300x200.png',
    aiHint: 'programming book',
  },
  {
    id: 'resource-2',
    title: 'The Beauty of Fractals - Video Lecture',
    description: 'An engaging video lecture explaining the mathematical beauty and applications of fractals.',
    type: 'video',
    url: '#', // Placeholder URL
    subject: 'Mathematics',
    grade: '11-12',
    addedBy: mockMentors[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    coverImageUrl: 'https://placehold.co/300x200.png',
    aiHint: 'math lecture',
  },
  {
    id: 'resource-3',
    title: 'Interactive Periodic Table',
    description: 'Explore the elements with this interactive periodic table. Click on elements to learn more.',
    type: 'link',
    url: '#', // Placeholder URL
    subject: 'Chemistry',
    grade: '9-12',
    addedBy: mockMentors[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    coverImageUrl: 'https://placehold.co/300x200