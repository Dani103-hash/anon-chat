
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, LogOut, Bell, BellOff, Trophy, MessageCircle } from "lucide-react";
import { useUserSession } from "@/hooks/useUserSession";
import { useMessages } from "@/hooks/useMessages";
import { useGamification } from "@/hooks/useGamification";
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

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Welcome back, @{user.username}! 👋
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Your anonymous message inbox • Level {Math.floor(stats.messagesReceived / 10) + 1}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedback(true)}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Feedback
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleNotifications}
              className="gap-2"
            >
              {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              {notifications ? 'On' : 'Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">
                {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
              </span>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {messages.filter(m => !m.is_answered).length} New
            </Badge>
            {user.isAnonymous && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                Anonymous Account
              </Badge>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="w-4 h-4 mr-1" />
                Achievements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="mt-6">
              <MessageTabs
                messages={filteredMessages}
                onMarkAnswered={markAsAnswered}
                onDelete={deleteMessage}
                onReport={reportMessage}
              />
            </TabsContent>
            
            <TabsContent value="categories" className="mt-6">
              <MessageCategories
                messages={messages}
                onCategoryFilter={handleCategoryFilter}
                onReact={handleReact}
              />
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
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
