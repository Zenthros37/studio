
"use client";
import ProtectedPage from '@/components/layout/ProtectedPage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Search, Users, PlusCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, updateDoc, Timestamp, setDoc, getDoc } from 'firebase/firestore';
import type { Conversation as ConversationType, ChatMessage as ChatMessageType } from '@/lib/types';
import { format } from 'date-fns';
import { mockConversations, mockMessages as mockMessagesCollection } from '@/lib/mock-data';

// Placeholder for creating a new conversation - actual implementation would be more complex
async function getOrCreateConversation(currentUserUid: string, otherUserUid: string, otherUserName: string, otherUserAvatar: string, currentUserName: string, currentUserAvatar: string): Promise<string> {
  const sortedParticipantIds = [currentUserUid, otherUserUid].sort();
  const conversationId = sortedParticipantIds.join('_');
  const conversationRef = doc(db, 'conversations', conversationId);
  
  const docSnap = await getDoc(conversationRef);
  if (!docSnap.exists()) {
    await setDoc(conversationRef, {
      participantIds: sortedParticipantIds,
      participantNames: {
        [currentUserUid]: currentUserName,
        [otherUserUid]: otherUserName,
      },
      participantAvatars: {
        [currentUserUid]: currentUserAvatar,
        [otherUserUid]: otherUserAvatar,
      },
      isGroup: false,
      lastMessageTimestamp: serverTimestamp(),
    });
  }
  return conversationId;
}


export default function ChatPage() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Initial state can be true if a conversation might be pre-selected
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    setIsLoadingConversations(true);
    const q = query(collection(db, 'conversations'), where('participantIds', 'array-contains', user.id));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos: ConversationType[] = [];
      querySnapshot.forEach((doc) => {
        convos.push({ id: doc.id, ...doc.data() } as ConversationType);
      });
      
      convos.sort((a, b) => {
        const timeA = (a.lastMessageTimestamp as Timestamp)?.toDate()?.getTime() || 0;
        const timeB = (b.lastMessageTimestamp as Timestamp)?.toDate()?.getTime() || 0;
        return timeB - timeA;
      });

      if (convos.length === 0) {
        setConversations(mockConversations.filter(mc => mc.participantIds.includes(user.id || 'student-1'))); 
      } else {
        setConversations(convos);
      }
      setIsLoadingConversations(false);
    }, (error) => {
      console.error("Error fetching conversations: ", error);
      setConversations(mockConversations.filter(mc => mc.participantIds.includes(user.id || 'student-1')));
      setIsLoadingConversations(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!selectedConversation || !user) {
      setMessages([]);
      setIsLoadingMessages(false); // Ensure loading is false if no selection
      return;
    }

    setIsLoadingMessages(true); // Set loading true at the start of fetching/setting messages

    if (selectedConversation.id.startsWith('mock-convo-')) {
      const currentMockMessages = mockMessagesCollection[selectedConversation.id];
      setMessages(currentMockMessages || []);
      setIsLoadingMessages(false);
      return; 
    }

    // Real conversation message fetching
    const messagesQuery = query(
      collection(db, 'conversations', selectedConversation.id, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const msgs: ChatMessageType[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessageType);
      });
      setMessages(msgs); // Always update messages with fetched data, even if empty
      setIsLoadingMessages(false);
    }, (error) => {
      console.error("Error fetching messages: ", error);
      // For real conversations, an error means no messages or an error message.
      setMessages([]); 
      setIsLoadingMessages(false);
    });
    return () => unsubscribe();
  }, [selectedConversation, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user || isSendingMessage) return;
    
    if (selectedConversation.id.startsWith('mock-convo-')) {
        alert("Cannot send messages in a mock conversation.");
        setNewMessage('');
        return;
    }

    setIsSendingMessage(true);
    const messageData = {
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      text: newMessage,
      timestamp: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, 'conversations', selectedConversation.id, 'messages'), messageData);
      const conversationRef = doc(db, 'conversations', selectedConversation.id);
      await updateDoc(conversationRef, {
        lastMessageText: newMessage,
        lastMessageTimestamp: serverTimestamp(),
        lastMessageSenderId: user.id,
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
    setIsSendingMessage(false);
  };
  
  const getConversationDisplayInfo = (convo: ConversationType) => {
    if (!user) return { name: "Conversation", avatar: "", isGroup: convo.isGroup };
    
    if (convo.id.startsWith('mock-convo-')) {
        if (convo.isGroup) {
            return { name: convo.groupName || "Mock Group", avatar: convo.groupAvatar || 'https://placehold.co/40x40.png?text=MG', isGroup: true };
        }
        const otherMockParticipantId = convo.participantIds.find(id => id !== (user.id || 'student-1'));
        if (otherMockParticipantId) {
            return {
                name: convo.participantNames?.[otherMockParticipantId] || "Mock User",
                avatar: convo.participantAvatars?.[otherMockParticipantId] || `https://placehold.co/40x40.png?text=MU`,
                isGroup: false
            };
        }
    }

    if (convo.isGroup) {
      return { name: convo.groupName || "Group Chat", avatar: convo.groupAvatar || 'https://placehold.co/40x40.png?text=G', isGroup: true };
    }
    const otherParticipantId = convo.participantIds.find(id => id !== user.id);
    if (otherParticipantId) {
      return { 
        name: convo.participantNames?.[otherParticipantId] || "User", 
        avatar: convo.participantAvatars?.[otherParticipantId] || `https://placehold.co/40x40.png?text=${(convo.participantNames?.[otherParticipantId] || "U").charAt(0)}`,
        isGroup: false
      };
    }
    return { name: "Conversation", avatar: 'https://placehold.co/40x40.png?text=C', isGroup: false };
  };


  if (!user && !isLoadingConversations) return <ProtectedPage><div>Loading user...</div></ProtectedPage>;

  const displayConversations = conversations;

  return (
    <ProtectedPage>
      <div className="flex h-[calc(100vh-theme(spacing.28))] border rounded-lg shadow-lg overflow-hidden">
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
            {isLoadingConversations ? (
              <div className="p-4 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
            ) : displayConversations.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">No conversations found. Start a new chat!</p>
            ) : (
              displayConversations.map(convo => {
                const displayInfo = getConversationDisplayInfo(convo);
                const lastMsgTime = (convo.lastMessageTimestamp as Timestamp)?.toDate();
                return (
                  <div
                    key={convo.id}
                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 ${selectedConversation?.id === convo.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedConversation(convo)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={displayInfo.avatar} alt={displayInfo.name} data-ai-hint={displayInfo.isGroup ? "group chat" : "user avatar"}/>
                      <AvatarFallback>{displayInfo.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-sm">{displayInfo.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{convo.lastMessageText || "No messages yet"}</p>
                    </div>
                    {lastMsgTime && <p className="text-xs text-muted-foreground">{format(lastMsgTime, "p")}</p>}
                    {displayInfo.isGroup && <Users className="h-4 w-4 text-muted-foreground ml-auto" />}
                  </div>
                );
              })
            )}
          </ScrollArea>
        </div>

        <div className="w-2/3 flex flex-col bg-background">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 bg-card">
                <Avatar className="h-10 w-10">
                   <AvatarImage src={getConversationDisplayInfo(selectedConversation).avatar} alt={getConversationDisplayInfo(selectedConversation).name} data-ai-hint={getConversationDisplayInfo(selectedConversation).isGroup ? "group chat" : "user avatar"}/>
                   <AvatarFallback>{getConversationDisplayInfo(selectedConversation).name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{getConversationDisplayInfo(selectedConversation).name}</h3>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-2"/>
                        <p>No messages yet. Say hello!</p>
                        {selectedConversation.id.startsWith("mock-convo-") && <p className="text-xs">(This is a mock chat. Messages are predefined.)</p>}
                    </div>
                ) : (
                  messages.map(msg => {
                    const isOwn = msg.senderId === (user?.id || 'student-1'); 
                    const msgTimestamp = (msg.timestamp as Timestamp)?.toDate();
                    return (
                      <div key={msg.id} className={`flex gap-2 ${isOwn ? 'justify-end' : ''}`}>
                        {!isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.senderAvatar} alt={msg.senderName} data-ai-hint="chat avatar" />
                            <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {!isOwn && <p className="text-xs font-semibold mb-1">{msg.senderName}</p>}
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {msgTimestamp ? format(msgTimestamp, 'p') : 'Sending...'}
                          </p>
                        </div>
                         {isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.senderAvatar || user?.avatarUrl} alt={msg.senderName || user?.name || 'User'} data-ai-hint="chat avatar"/>
                            <AvatarFallback>{(user?.name || "U").charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <div className="p-4 border-t bg-card">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSendingMessage || isLoadingMessages || (selectedConversation?.id.startsWith('mock-convo-') && true) /* Explicitly disable for mock convos */}
                  />
                  <Button type="submit" size="icon" disabled={isSendingMessage || !newMessage.trim() || (selectedConversation?.id.startsWith('mock-convo-') && true) /* Explicitly disable for mock convos */ }>
                    {isSendingMessage ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4" />
              <p className="text-lg">Select a conversation to start chatting</p>
              <p className="text-sm mt-1">Or create a new one from the members page.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  )
}
    
    