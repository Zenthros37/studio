import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, Link as LinkIcon, Puzzle, Download, Eye } from 'lucide-react'; // Puzzle for quiz
import { formatDistanceToNow } from 'date-fns';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceTypeIcon = ({ type }: { type: Resource['type'] }) => {
  switch (type) {
    case 'document': return <FileText className="h-5 w-5 text-primary" />;
    case 'video': return <Video className="h-5 w-5 text-red-500" />;
    case 'link': return <LinkIcon className="h-5 w-5 text-green-500" />;
    case 'quiz': return <Puzzle className="h-5 w-5 text-purple-500" />;
    default: return <FileText className="h-5 w-5 text-primary" />;
  }
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const timeAgo = formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {resource.coverImageUrl && (
        <div className="relative aspect-video w-full border-b">
          <Image
            src={resource.coverImageUrl}
            alt={resource.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={resource.aiHint || "resource cover"}
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex items-center justify-between mb-1">
           <ResourceTypeIcon type={resource.type} />
           <Badge variant="outline" className="capitalize text-xs">{resource.type}</Badge>
        </div>
        <CardTitle className="font-headline text-lg leading-tight">{resource.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Added by {resource.addedBy.name} &middot; {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
        <div className="mt-3 space-x-2">
          <Badge variant="secondary">{resource.subject}</Badge>
          <Badge variant="secondary">Grade {resource.grade}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button variant="outline" size="sm" className="w-full mr-2">
          <Eye className="mr-2 h-4 w-4" /> View
        </Button>
        {(resource.type === 'document' || resource.url) && (
          <Button variant="default" size="sm" className="w-full" asChild>
            <a href={resource.url || resource.filePath || '#'} target="_blank" rel="noopener noreferrer">
              {resource.type === 'document' ? <Download className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
              {resource.type === 'document' ? 'Download' : 'Open Link'}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
