"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import PostCard from '@/components/shared/PostCard';
import { mockPosts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { ImageIcon, Send } from 'lucide-react';

export default function FeedPage() {
  const { user } = useUser();

  // Determine if user can create posts
  const canCreatePost = user?.role === 'mentor' || user?.role === 'admin';

  return (
    <ProtectedPage>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-headline text-3xl font-semibold text-foreground">Activity Feed</h1>
        
        {canCreatePost && (
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 mt-1">
                   <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar small" />
                   <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Textarea 
                  placeholder={`What's on your mind, ${user.name}?`}
                  className="flex-1 min-h-[80px] resize-none border-border focus-visible:ring-primary"
                />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <Button variant="outline" size="sm">
                  <ImageIcon className="mr-2 h-4 w-4" /> Add Image/Video
                </Button>
                <Button size="sm">
                  <Send className="mr-2 h-4 w-4" /> Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {mockPosts.length === 0 && (
           <p className="text-center text-muted-foreground py-10">No posts yet. Be the first to share something!</p>
        )}
      </div>
    </ProtectedPage>
  );
}