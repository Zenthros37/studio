import Image from 'next/image';
import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Timestamp } from 'firebase/firestore';


interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useUser();
  // Convert Firestore Timestamp to Date for formatting
  const createdAtDate = (post.createdAt as Timestamp)?.toDate ? (post.createdAt as Timestamp).toDate() : new Date();
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });

  const canEditOrDelete = user?.id === post.author.id || user?.role === 'admin';

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="author avatar"/>
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold font-headline">{post.author.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{post.author.role} &middot; {timeAgo}</p>
          </div>
        </div>
        {canEditOrDelete && (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
        {post.mediaUrl && post.mediaType === 'image' && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={post.mediaUrl}
              alt="Post media"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={post.aiHint || "social media image"}
            />
          </div>
        )}
        {/* Placeholder for video or other media types */}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Heart className="mr-2 h-4 w-4" /> {post.likes} Likes
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <MessageCircle className="mr-2 h-4 w-4" /> {post.commentsCount} Comments
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
}
