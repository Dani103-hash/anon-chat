
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, Bell, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MessageSlideshow from "@/components/MessageSlideshow";
import UserDashboard from "@/components/UserDashboard";
import MessageForm from "@/components/MessageForm";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'message'>('home');
  const [username, setUsername] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user has existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('anonChatUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // PWA Install prompt
  useEffect(() => {
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button after 3 seconds
      setTimeout(() => {
        if (deferredPrompt) {
          toast({
            title: "Install AnonChat",
            description: "Add to your home screen for the best experience!",
            duration: 5000,
          });
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [toast]);

  const createUser = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }
    
    // Simple username validation
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      toast({
        title: "Invalid username",
        description: "Username must be 3+ characters, letters, numbers, and underscores only",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('anonChatUser', username);
    setCurrentUser(username);
    setCurrentView('dashboard');
    
    toast({
      title: "Welcome to AnonChat!",
      description: `Your link: anonchat.app/${username}`,
    });
  };

  const shareProfile = () => {
    if (currentUser) {
      if (navigator.share) {
        navigator.share({
          title: `Send me anonymous messages!`,
          text: `Ask me anything anonymously on AnonChat`,
          url: `${window.location.origin}/${currentUser}`,
        });
      } else {
        navigator.clipboard.writeText(`${window.location.origin}/${currentUser}`);
        toast({
          title: "Link copied!",
          description: "Share this link to receive anonymous messages",
        });
      }
    }
  };

  if (currentView === 'dashboard' && currentUser) {
    return <UserDashboard username={currentUser} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'message' && targetUser) {
    return (
      <MessageForm 
        targetUser={targetUser} 
        onBack={() => {
          setCurrentView('home');
          setTargetUser('');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              AnonChat
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-6 drop-shadow">
              Send and receive anonymous messages
            </p>
            
            {/* Age Gate Badge */}
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-6">
              13+ only • Anonymous messaging platform
            </Badge>
          </div>

          {/* Sample Messages Slideshow */}
          <div className="mb-12">
            <MessageSlideshow />
          </div>

          {/* Main Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Create Profile Card */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Create Your Inbox
                  </h2>
                  <p className="text-gray-600">
                    Get your own anonymous message inbox
                  </p>
                </div>
                
                {currentUser ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 font-medium">
                        Welcome back, {currentUser}!
                      </p>
                      <p className="text-green-600 text-sm">
                        anonchat.app/{currentUser}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => setCurrentView('dashboard')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Inbox
                      </Button>
                      <Button 
                        onClick={shareProfile}
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      placeholder="Choose your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      className="text-center text-lg border-2 border-purple-200 focus:border-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && createUser()}
                    />
                    <Button 
                      onClick={createUser}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
                    >
                      Create My Inbox
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Send Message Card */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Send className="w-16 h-16 mx-auto mb-4 text-pink-600" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Send Anonymous Message
                  </h2>
                  <p className="text-gray-600">
                    Send a message to someone anonymously
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Enter their username"
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value.toLowerCase())}
                    className="text-center text-lg border-2 border-pink-200 focus:border-pink-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && targetUser.trim()) {
                        setCurrentView('message');
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      if (targetUser.trim()) {
                        setCurrentView('message');
                      } else {
                        toast({
                          title: "Username required",
                          description: "Please enter a username to send a message",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-3"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-white">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <h3 className="font-semibold mb-2">100% Anonymous</h3>
                <p className="text-sm opacity-80">No registration needed to send messages</p>
              </div>
              <div className="text-white">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <h3 className="font-semibold mb-2">Instant Notifications</h3>
                <p className="text-sm opacity-80">Get notified of new messages instantly</p>
              </div>
              <div className="text-white">
                <Share2 className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <h3 className="font-semibold mb-2">Easy Sharing</h3>
                <p className="text-sm opacity-80">Share your link anywhere to receive messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
