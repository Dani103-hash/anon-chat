
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, LogOut, Bell, BellOff, Trophy, MessageCircle, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { useUserSession } from "@/hooks/useUserSession";
import { useMessages } from "@/hooks/useMessages";
import { useGamification } from "@/hooks/useGamification";
import { useNavigate } from "react-router-dom";
import MessageTabs from "./MessageTabs";
import MessageCategories from "./MessageCategories";
import GamificationSystem from "./GamificationSystem";
import FeedbackModal from "./FeedbackModal";

const UserDashboard = () => {
  const { user, logout } = useUserSession();
  const { messages, loading, markAsAnswered, deleteMessage, reportMessage } = useMessages(user?.id);
  const { stats, incrementMessageReceived, updateStreak } = useGamification(user?.id);
  const [notifications, setNotifications] = useState(true);
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [activeTab, setActiveTab] = useState("messages");
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      updateStreak();
      checkNotificationPermission();
    }
  }, [user]);

  useEffect(() => {
    setFilteredMessages(messages);
    if (messages.length > stats.messagesReceived) {
      incrementMessageReceived();
    }
  }, [messages]);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
    }
  };

  const toggleNotifications = async () => {
    if ('Notification' in window) {
      if (notifications) {
        setNotifications(false);
      } else {
        const permission = await Notification.requestPermission();
        setNotifications(permission === 'granted');
      }
    }
  };

  const handleCategoryFilter = (category: string | null) => {
    setFilteredMessages(messages);
  };

  const handleReact = (messageId: string, reaction: string) => {
    console.log(`Reacting to message ${messageId} with ${reaction}`);
  };

  const handleLogout = () => {
    logout();
    // Don't automatically navigate away - let the useUserSession hook handle the redirect
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-white/95 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="animate-slide-in-right">
            <CardTitle className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome back, @{user.username}! 👋
            </CardTitle>
            <p className="text-gray-600 mt-1 animate-fade-in">
              Your anonymous message inbox • Level {Math.floor(stats.messagesReceived / 10) + 1}
            </p>
            {user.isAnonymous && (
              <div className="flex items-center gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="text-xs text-yellow-700">
                  Anonymous session - Remember your username to access later
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 animate-slide-in-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-110"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedback(true)}
              className="gap-2 hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-110"
            >
              <MessageCircle className="w-4 h-4 animate-pulse" />
              Feedback
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleNotifications}
              className="gap-2 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-300 hover:scale-110"
            >
              {notifications ? <Bell className="w-4 h-4 animate-bounce" /> : <BellOff className="w-4 h-4" />}
              {notifications ? 'On' : 'Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-110"
            >
              <LogOut className="w-4 h-4" />
              {user.isAnonymous ? 'Clear Session' : 'Logout'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 mb-6 animate-slide-in-right">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600 animate-pulse" />
              <span className="text-lg font-semibold text-gray-800">
                {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
              </span>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 animate-bounce">
              {messages.filter(m => !m.is_answered).length} New
            </Badge>
            {user.isAnonymous && (
              <Badge variant="outline" className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border-yellow-200 animate-pulse">
                Anonymous Account
              </Badge>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <TabsTrigger 
                value="messages" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="categories"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger 
                value="achievements"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
              >
                <Trophy className="w-4 h-4 mr-1 animate-bounce" />
                Achievements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="mt-6 animate-fade-in">
              <MessageTabs
                messages={filteredMessages}
                onMarkAnswered={markAsAnswered}
                onDelete={deleteMessage}
                onReport={reportMessage}
              />
            </TabsContent>
            
            <TabsContent value="categories" className="mt-6 animate-fade-in">
              <MessageCategories
                messages={messages}
                onCategoryFilter={handleCategoryFilter}
                onReact={handleReact}
              />
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6 animate-fade-in">
              <GamificationSystem
                stats={stats}
                username={user.username}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </div>
  );
};

export default UserDashboard;
