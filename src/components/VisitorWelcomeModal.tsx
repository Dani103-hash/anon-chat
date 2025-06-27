
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Users, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VisitorWelcomeModalProps {
  recipientUsername: string;
  onClose: () => void;
  onCreateAccount: () => void;
}

const VisitorWelcomeModal = ({ recipientUsername, onClose, onCreateAccount }: VisitorWelcomeModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCreateAccount = () => {
    setIsVisible(false);
    setTimeout(onCreateAccount, 300);
  };

  return (
    <div className={`fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className={`w-full max-w-md bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-2xl transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        <CardHeader className="text-center relative pb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose}
            className="absolute right-2 top-2 hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to AnonChat! ✨
          </CardTitle>
          <p className="text-gray-600 text-sm">
            You're about to send an anonymous message to <span className="font-semibold text-purple-600">@{recipientUsername}</span>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-purple-600 animate-bounce" />
              <h3 className="font-semibold text-gray-800">Why not create your own inbox?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Join thousands of users receiving anonymous messages from friends, followers, and secret admirers!
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                100% Anonymous & Secure
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                Share your link anywhere
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                Real-time notifications
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleCreateAccount}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Create My Free Inbox
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
            >
              Continue to Send Message
            </Button>
            
            <div className="text-center">
              <Link 
                to="/auth" 
                className="text-xs text-purple-600 hover:text-purple-800 transition-colors duration-300 underline"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorWelcomeModal;
