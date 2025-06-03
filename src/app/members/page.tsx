"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import MemberCard from '@/components/shared/MemberCard';
import { mockMembers }_from '@/lib/mock-data'; // Corrected import
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function MembersPage() {
  // TODO: Add state for search and filter, and filter mockMembers accordingly
  return (
    <ProtectedPage>
      <div>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="font-headline text-3xl font-semibold text-foreground">School Members</h1>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members..." className="pl-8 w-full md:w-[250px]" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {mockMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">No members found.</p>
        )}
      </div>
    </ProtectedPage>
  );
}

// Correction for mockMembers import
const mockMembers = []; 
if (typeof require !== 'undefined' && require.cache) { // check if in node-like environment
    Promise.resolve().then(() => {
        const data = require('@/lib/mock-data');
        if(data && data.mockMembers) {
            (