"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Search, Users, PlusCircle } from 'lucide-react';
import { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  type: 'user' | 'group';
}

const mockConversations: Conversation[] = [
  { id: 'c1', name: 'Dr. Ada Lovelace', avatar: 'https://placehold.co/40x40.png?text=AL', lastMessage: 'Yes, the assignment is due Friday.', type: 'user'},
  { id: 'c2', name: 'Mathematics Study Group', avatar: 'https://placehold.co/40x40.png?text=MG', lastMessage: 'Anyone solved question 5 yet?', type: 'group'},
  { id: 'c3', name: 'Mr. Alan Turing', avatar: 'https://placehold.co/40x40.png?text=AT', lastMessage: 'Great work on the project!', type: 'user' },
];

const mockMessages: ChatMessage[] = [
  { id: 'm1', sender: 'Dr. Ada Lovelace', avatar: 'https://placehold.co/40x40.png?text=AL', text: 'Hello! How can I help you today?', timestamp: '10:30 AM', isOwn: false },
  { id: 'm2', sender: 'You', avatar: 'https://placehold.co/40x40.png?text=S', text: 'I have a question about the recent lecture.', timestamp: '10:31 AM', isOwn: true },
];


export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0] || null);
  const [newMessage, setNewMessage] = useState('');

  return (
    <ProtectedPage>
      <div className="flex h-[calc(100vh-theme(spacing.28))] border rounded-lg shadow-lg overflow-hidden"> {/* Adjust height based on header */}
        {/* Sidebar for conversations */}
        <div className="w-1/3 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-headline text-xl">Messages</h2>
              <Button variant="ghost" size="icon"><PlusCircle className="h-5 w-5"/></Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search chats..." className="pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {mockConversations.map(convo => (
              <div
                key={convo.id}
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 ${selectedConversation?.id === convo.id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedConversation(convo)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={convo.avatar} alt={convo.name} data-ai-hint={convo.type === 'group' ? "group chat" : "user avatar"}/>
                  <AvatarFallback>{convo.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="font-semibold text-sm">{convo.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
                 {convo.type === 'group' && <Users className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Main chat area */}
        <div className="w-2/3 flex flex-col bg-background">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 bg-card">
                <Avatar className="h-10 w-10">
                   <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} data-ai-hint={selectedConversation.type === 'group' ? "group chat" : "user avatar"}/>
                   <AvatarFallback>{selectedConversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">Online</p> {/* Mock status */}
                </div>
              </div>
              <ScrollArea className="flex-1 p-4 space-y-4">
                {mockMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.isOwn ? 'justify-end' : ''}`}>
                    {!msg.isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} alt={msg.sender} data-ai-hint="chat avatar" />
                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {!msg.isOwn && <p className="text-xs font-semibold mb-1">{msg.sender}</p>}
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
                    </div>
                     {msg.isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} alt={msg.sender} data-ai-hint="chat avatar"/>
                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </ScrollArea>
              <div className="p-4 border-t bg-card">
                <form className="flex items-center gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4" />
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  )
}