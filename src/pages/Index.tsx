
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, Send, Copy, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserSession } from "@/hooks/useUserSession";
import { Link } from "react-router-dom";
import MessageSlideshow from "@/components/MessageSlideshow";
import UserDashboard from "@/components/UserDashboard";
import MessageForm from "@/components/MessageForm";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import EngagementTips from "@/components/EngagementTips";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'message'>('home');
  const [username, setUsername] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const { user, loading, createUser } = useUserSession();
  const { toast } = useToast();

  useEffect(() => {
    if (user && currentView === 'home') {
      setCurrentView('dashboard');
    }
  }, [user, currentView]);

  const handleCreateUser = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }

    const newUser = await createUser(username);
    if (newUser) {
      setCurrentView('dashboard');
    }
  };

  const shareProfile = () => {
    if (user) {
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
    }
  };

  const copyToClipboard = () => {
    if (user) {
      const shareUrl = `${window.location.origin}/${user.username}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Your profile link has been copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
      </div>
    );
  }

  if (currentView === 'dashboard' && user) {
    return <UserDashboard user={user} onBack={() => setCurrentView('home')} />;
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
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              AnonChat
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-6 drop-shadow">
              Send and receive anonymous messages
            </p>
            
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-6">
              13+ only • Anonymous messaging platform
            </Badge>
          </div>

          <div className="mb-12">
            <MessageSlideshow />
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            
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
                
                {user ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 font-medium">
                        Welcome back, {user.username}!
                        {user.isAnonymous && (
                          <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                            Anonymous
                          </Badge>
                        )}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <p className="text-green-600 text-sm">
                          anonchat.app/{user.username}
                        </p>
                        <Button
                          onClick={copyToClipboard}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {user.isAnonymous && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm mb-2">
                          💡 Secure your account with email or Google to keep your messages forever!
                        </p>
                        <Link to="/auth">
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                            <LogIn className="w-4 h-4 mr-2" />
                            Upgrade Account
                          </Button>
                        </Link>
                      </div>
                    )}
                    
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
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
                    />
                    <Button 
                      onClick={handleCreateUser}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
                    >
                      Create My Inbox
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>
                    
                    <Link to="/auth">
                      <Button 
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:bg-gray-50"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign Up / Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

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

          {/* Engagement Tips */}
          <div className="max-w-4xl mx-auto mb-12">
            <EngagementTips />
          </div>

          {/* Features Grid */}
          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-white">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <h3 className="font-semibold mb-2">100% Anonymous</h3>
                <p className="text-sm opacity-80">No registration needed to send messages</p>
              </div>
              <div className="text-white">
                <Send className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <h3 className="font-semibold mb-2">Instant Delivery</h3>
                <p className="text-sm opacity-80">Messages are delivered instantly</p>
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
      
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
