
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, LogOut, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "@/hooks/useMessages";
import { useUserSession } from "@/hooks/useUserSession";
import MessageTabs from "@/components/MessageTabs";

interface User {
  id: string;
  username: string;
  uuid: string;
  email?: string;
}

interface UserDashboardProps {
  user: User;
  onBack: () => void;
}

const UserDashboard = ({ user, onBack }: UserDashboardProps) => {
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const { messages, loading, markAsAnswered, deleteMessage, reportMessage } = useMessages(user.id);
  const { logout } = useUserSession();
  const { toast } = useToast();

  useEffect(() => {
    // Show notification prompt after 2 seconds
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        setShowNotificationPrompt(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const shareProfile = () => {
    const shareUrl = `${window.location.origin}/${user.username}`;
    if (navigator.share) {
      navigator.share({
        title: `Send me anonymous messages!`,
        text: `Ask me anything anonymously on AnonChat`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share this link to receive anonymous messages",
      });
    }
  };

  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Your profile link has been copied to clipboard",
    });
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled!",
          description: "You'll be notified when you receive new messages",
        });
      }
      setShowNotificationPrompt(false);
    }
  };

  const handleLogout = () => {
    logout();
    onBack();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const unansweredCount = messages.filter(msg => !msg.is_answered).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          
          <div className="text-center mb-8">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="absolute top-4 left-4 text-white hover:bg-white/20"
            >
              ← Back
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Welcome, {user.username}
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-white/90 drop-shadow">
                anonchat.app/{user.username}
              </p>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            
            <Button 
              onClick={shareProfile}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </div>

          {showNotificationPrompt && (
            <div className="max-w-md mx-auto mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Enable Notifications</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Get notified when you receive new anonymous messages!
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={requestNotificationPermission} size="sm">
                      Enable
                    </Button>
                    <Button 
                      onClick={() => setShowNotificationPrompt(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

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
                <div className="text-2xl font-bold text-blue-600">{messages.filter(m => m.is_reported).length}</div>
                <div className="text-sm text-gray-600">Reported</div>
              </CardContent>
            </Card>
          </div>

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
              <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-6">
                  <MessageTabs
                    messages={messages}
                    onMarkAnswered={markAsAnswered}
                    onDelete={deleteMessage}
                    onReport={reportMessage}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
