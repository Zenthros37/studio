"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, PlusCircle, Edit3, PlayCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const mockQuizzes = [
  { id: 'q1', title: 'Introduction to Algebra', subject: 'Mathematics', attempts: 15, questions: 10, createdBy: 'Mr. Alan Turing' },
  { id: 'q2', title: 'Chemical Reactions Basics', subject: 'Chemistry', attempts: 23, questions: 15, createdBy: 'Dr. Ada Lovelace' },
  { id: 'q3', title: 'World War II History', subject: 'History', attempts: 8, questions: 20, createdBy: 'Dr. Ada Lovelace' },
];

export default function QuizzesPage() {
  const { user } = useUser();
  const canCreateQuiz = user?.role === 'mentor' || user?.role === 'admin';

  return (
    <ProtectedPage>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="font-headline text-3xl font-semibold text-foreground">Quizzes</h1>
          {canCreateQuiz && (
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Quiz
            </Button>
          )}
        </div>
        
        {mockQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuizzes.map(quiz => (
              <Card key={quiz.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <ClipboardList className="h-8 w-8 text-primary" />
                    {canCreateQuiz && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="font-headline pt-2">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.subject} - {quiz.questions} questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Attempts: {quiz.attempts}</p>
                  <p className="text-xs text-muted-foreground mt-1">Created by: {quiz.createdBy}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {user?.role === 'student' ? 'Attempt Quiz' : 'Preview Quiz'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No quizzes available</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {canCreateQuiz ? "Create the first quiz to engage students!" : "Check back later for new quizzes."}
            </p>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}