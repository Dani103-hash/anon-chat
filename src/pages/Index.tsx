import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Shield, Zap, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserSession } from "@/hooks/useUserSession";
import QuickUserCreation from "@/components/QuickUserCreation";
import MessageSlideshow from "@/components/MessageSlideshow";
import EngagementTips from "@/components/EngagementTips";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import UserDashboard from "@/components/UserDashboard";
import SocialShare from "@/components/SocialShare";

const Index = () => {
  const { user, loading } = useUserSession();
  const [showUserCreation, setShowUserCreation] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="min-h-screen bg-black/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <UserDashboard />
              </div>
              <div className="space-y-6">
                <SocialShare username={user.username} />
                <PWAInstallPrompt />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              AnonChat
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Receive anonymous messages from friends, followers, and secret admirers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => setShowUserCreation(true)}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full shadow-lg"
              >
                Create My Inbox
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full"
                >
                  <LogIn className="mr-2 w-5 h-5" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <MessageSlideshow />
              
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Why Choose AnonChat?
                </h2>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">100% Anonymous</h3>
                      <p className="text-gray-600 text-sm">Senders remain completely anonymous. No way to trace back.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Safe & Secure</h3>
                      <p className="text-gray-600 text-sm">Advanced filtering and reporting to keep your inbox clean.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Instant Delivery</h3>
                      <p className="text-gray-600 text-sm">Real-time notifications when you receive new messages.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <EngagementTips />
              <PWAInstallPrompt />
            </div>
          </div>
        </div>
      </div>

      {showUserCreation && (
        <QuickUserCreation onClose={() => setShowUserCreation(false)} />
      )}
    </div>
  );
};

export default Index;
