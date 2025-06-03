"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Puzzle, Brain, Rocket } from 'lucide-react';
import Image from 'next/image';

const mockGames = [
  { id: 'game1', title: 'Math Whiz Challenge', description: 'Test your arithmetic skills against the clock!', icon: Brain, category: 'Mathematics', coverImage: 'https://placehold.co/300x200.png?text=Game1', aiHint: 'math game' },
  { id: 'game2', title: 'Word Puzzle Fun', description: 'Find hidden words in a grid of letters. Great for vocabulary!', icon: Puzzle, category: 'Language Arts', coverImage: 'https://placehold.co/300x200.png?text=Game2', aiHint: 'word puzzle' },
  { id: 'game3', title: 'Space Explorer Mission', description: 'Navigate your rocket through asteroid fields and learn about planets.', icon: Rocket, category: 'Science', coverImage: 'https://placehold.co/300x200.png?text=Game3', aiHint: 'space adventure' },
];

export default function GamesPage() {
  return (
    <ProtectedPage allowedRoles={['student', 'admin']}> {/* Admin can also see for moderation */}
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-semibold text-foreground">Educational Games</h1>
        
        {mockGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGames.map(game => (
              <Card key={game.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative aspect-video w-full">
                    <Image src={game.coverImage} alt={game.title} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={game.aiHint}/>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <game.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-xl">{game.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm line-clamp-3">{game.description}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">Category: {game.category}</p>
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <Button className="w-full">
                    <Gamepad2 className="mr-2 h-5 w-5" /> Play Game
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
           <div className="text-center py-10 bg-card rounded-lg shadow">
            <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No games available right now</h3>
            <p className="mt-1 text-sm text-muted-foreground">Check back soon for some fun learning experiences!</p>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}