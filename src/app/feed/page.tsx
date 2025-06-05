
"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import PostCard from '@/components/shared/PostCard';
import type { Post as PostType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { ImageIcon, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { mockPosts } from '@/lib/mock-data'; // Import mock posts

export default function FeedPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // Determine if user can create posts
  const canCreatePost = user?.role === 'mentor' || user?.role === 'admin';

  useEffect(() => {
    if (!user) return; 

    setIsLoadingFeed(true);
    const postsCollectionRef = collection(db, 'posts');
    const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts: PostType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPosts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt as Timestamp, 
        } as PostType);
      });
      setPosts(fetchedPosts);
      setIsLoadingFeed(false);
    }, (error) => {
      console.error("Error fetching posts: ", error);
      setIsLoadingFeed(false);
      // Optionally set posts to mockPosts here on error too
      // setPosts(mockPosts as PostType[]); 
    });

    return () => unsubscribe(); 
  }, [user]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user || !canCreatePost) return;
    setIsPosting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        author: { 
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
        content: newPostContent,
        likes: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewPostContent('');
    } catch (error) {
      console.error("Error creating post: ", error);
    }
    setIsPosting(false);
  };
  
  if (!user && !isLoadingFeed) { // If user is somehow null after initial load, ProtectedPage should handle it.
     return <ProtectedPage><div>Redirecting...</div></ProtectedPage>;
  }


  const displayPosts = !isLoadingFeed && posts.length === 0 ? mockPosts : posts;

  return (
    <ProtectedPage>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-headline text-3xl font-semibold text-foreground">Activity Feed</h1>
        
        {canCreatePost && (
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 mt-1">
                   <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} data-ai-hint="user avatar small" />
                   <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Textarea 
                  placeholder={`What's on your mind, ${user?.name}?`}
                  className="flex-1 min-h-[80px] resize-none border-border focus-visible:ring-primary"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  disabled={isPosting}
                />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <Button variant="outline" size="sm" disabled={isPosting}>
                  <ImageIcon className="mr-2 h-4 w-4" /> Add Image/Video
                </Button>
                <Button size="sm" onClick={handleCreatePost} disabled={isPosting || !newPostContent.trim()}>
                  {isPosting ? 'Posting...' : <><Send className="mr-2 h-4 w-4" /> Post</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoadingFeed && (
          <>
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </>
        )}

        {!isLoadingFeed && displayPosts.length === 0 && (
           <p className="text-center text-muted-foreground py-10">No posts yet. Be the first to share something!</p>
        )}
        
        {!isLoadingFeed && displayPosts.length > 0 && displayPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

      </div>
    </ProtectedPage>
  );
}
