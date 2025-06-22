
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, MessageSquare, Share2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  timestamp: number;
  isAnswered: boolean;
  reply?: string;
}

interface UserDashboardProps {
  username: string;
  onBack: () => void;
}

const UserDashboard = ({ username, onBack }: UserDashboardProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`anonChat_messages_${username}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [username]);

  // Save messages to localStorage
  const saveMessages = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    localStorage.setItem(`anonChat_messages_${username}`, JSON.stringify(updatedMessages));
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `Send me anonymous messages!`,
        text: `Ask me anything anonymously on AnonChat`,
        url: `${window.location.origin}/${username}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      toast({
        title: "Link copied!",
        description: "Share this link to receive anonymous messages",
      });
    }
  };

  const markAsAnswered = (messageId: string) => {
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, isAnswered: true } : msg
    );
    saveMessages(updatedMessages);
    
    toast({
      title: "Message marked as answered",
      description: "This message will show as answered",
    });
  };

  const addReply = (messageId: string) => {
    const reply = replyText[messageId]?.trim();
    if (!reply) {
      toast({
        title: "Reply cannot be empty",
        description: "Please write a reply before submitting",
        variant: "destructive",
      });
      return;
    }

    const updatedMessages = messages.map(msg =>
      msg.id === messageId 
        ? { ...msg, reply, isAnswered: true }
        : msg
    );
    saveMessages(updatedMessages);
    
    setReplyText(prev => ({ ...prev, [messageId]: '' }));
    setExpandedMessage(null);
    
    toast({
      title: "Reply added!",
      description: "Your reply is now visible on your public profile",
    });
  };

  const deleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    saveMessages(updatedMessages);
    
    toast({
      title: "Message deleted",
      description: "The message has been removed from your inbox",
    });
  };

  const requestNotificationPermission = async () => {
    // Check if Notification API is available
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled!",
          description: "You'll be notified when you receive new messages",
        });
      }
    } else {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      });
    }
  };

  const unansweredCount = messages.filter(msg => !msg.isAnswered).length;

  // Check if notifications are supported and get permission status
  const notificationPermission = typeof window !== 'undefined' && 'Notification' in window 
    ? Notification.permission 
    : 'unsupported';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="absolute top-4 left-4 text-white hover:bg-white/20"
            >
              ← Back
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Welcome, {username}
            </h1>
            <p className="text-white/90 mb-4 drop-shadow">
              anonchat.app/{username}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={shareProfile}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
              
              {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
                <Button 
                  onClick={requestNotificationPermission}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Notifications
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/90 backdrop-blur border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{messages.length}</div>
                <div className="text-sm text-gray-600">Total Messages</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{unansweredCount}</div>
                <div className="text-sm text-gray-600">Unanswered</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{messages.length - unansweredCount}</div>
                <div className="text-sm text-gray-600">Answered</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{messages.filter(m => m.reply).length}</div>
                <div className="text-sm text-gray-600">With Replies</div>
              </CardContent>
            </Card>
          </div>

          {/* Messages */}
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No messages yet</h3>
                  <p className="text-gray-600 mb-6">
                    Share your link to start receiving anonymous messages!
                  </p>
                  <Button onClick={shareProfile} className="bg-purple-600 hover:bg-purple-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Your Link
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {messages
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((message) => (
                    <Card key={message.id} className="bg-white/95 backdrop-blur border-0 shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={message.isAnswered ? "default" : "secondary"}>
                              {message.isAnswered ? "Answered" : "New"}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <Button
                            onClick={() => deleteMessage(message.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-800 mb-4 text-lg leading-relaxed">
                          {message.text}
                        </p>
                        
                        {message.reply && (
                          <div className="bg-purple-50 rounded-lg p-4 mb-4 border-l-4 border-purple-400">
                            <p className="text-purple-800 font-medium mb-1">Your reply:</p>
                            <p className="text-purple-700">{message.reply}</p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {!message.isAnswered && (
                            <Button
                              onClick={() => markAsAnswered(message.id)}
                              variant="outline"
                              size="sm"
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              Mark as Answered
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => setExpandedMessage(
                              expandedMessage === message.id ? null : message.id
                            )}
                            variant="outline"
                            size="sm"
                            className="border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            {expandedMessage === message.id ? (
                              <>
                                <ArrowUp className="w-4 h-4 mr-1" />
                                Cancel Reply
                              </>
                            ) : (
                              <>
                                <ArrowDown className="w-4 h-4 mr-1" />
                                Add Public Reply
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {expandedMessage === message.id && (
                          <div className="mt-4 space-y-3">
                            <Textarea
                              placeholder="Write a public reply that will be visible on your profile..."
                              value={replyText[message.id] || ''}
                              onChange={(e) => setReplyText(prev => ({
                                ...prev,
                                [message.id]: e.target.value
                              }))}
                              className="border-2 border-purple-200 focus:border-purple-500"
                              rows={3}
                            />
                            <Button
                              onClick={() => addReply(message.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Post Reply
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
