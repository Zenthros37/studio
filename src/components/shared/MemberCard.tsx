import type { Member } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, UserCheck, ShieldCheck } from 'lucide-react'; // UserCheck for student, ShieldCheck for mentor/admin
import { Badge } from '@/components/ui/badge';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const RoleIcon = member.role === 'student' ? UserCheck : ShieldCheck;
  const roleColor = member.role === 'mentor' ? 'bg-primary/20 text-primary' : member.role === 'admin' ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-secondary-foreground';

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
      <CardHeader className="p-6 bg-muted/30">
        <Avatar className="h-24 w-24 mx-auto border-4 border-background shadow-md">
          <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="member avatar large"/>
          <AvatarFallback className="text-3xl">{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <CardTitle className="text-xl font-headline mb-1">{member.name}</CardTitle>
        <Badge variant="outline" className={`capitalize text-xs font-medium ${roleColor} border-transparent`}>
           <RoleIcon className="mr-1 h-3 w-3" />
           {member.role}
        </Badge>
        <p className="text-xs text-muted-foreground mt-2">{member.email || 'No email provided'}</p>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 p-4 border-t">
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" /> Message
        </Button>
        <Button variant="default" size="sm">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}