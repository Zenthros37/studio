"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import ResourceCard from '@/components/shared/ResourceCard';
import { mockResources }_from '@/lib/mock-data'; // Corrected import
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const subjects = ['All Subjects', 'Computer Science', 'Mathematics', 'Chemistry', 'Physics', 'Literature'];
const grades = ['All Grades', '9', '10', '11', '12', '9-12'];

export default function LibraryPage() {
  const { user } = useUser();
  const canAddResource = user?.role === 'mentor' || user?.role === 'admin';

  return (
    <ProtectedPage>
      <div>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="font-headline text-3xl font-semibold text-foreground">Resource Library</h1>
          {canAddResource && (
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Resource
            </Button>
          )}
        </div>

        <div className="mb-6 p-4 bg-card rounded-lg shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="search-library">Search Resources</Label>
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="search-library" placeholder="Search by title or description..." className="pl-8" />
            </div>
          </div>
          <div>
            <Label htmlFor="filter-subject">Subject</Label>
            <Select defaultValue="All Subjects">
              <SelectTrigger id="filter-subject" className="mt-1">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-grade">Grade</Label>
            <Select defaultValue="All Grades">
              <SelectTrigger id="filter-grade" className="mt-1">
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {/* <Button variant="outline" className="md:col-start-4">
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
          </Button> */}
        </div>

        {mockResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <LibraryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No resources found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}

// Dummy Label component for the context of this file
const Label = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
    {children}
  </label>
);

// Dummy LibraryIcon for context
const LibraryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);


// Correction for mockResources import
const mockResources = [];
if (typeof require !== 'undefined' && require.cache) { // check if in node-like environment
    Promise.resolve().then(() => {
        const data = require('@/lib/mock-data');
        if(data && data.mockResources) {
            (mockResources as any[]).push(...data.mockResources);
        }
    });
}

