
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User, Sparkles, RotateCcw } from 'lucide-react';
import { useUserSession } from '@/hooks/useUserSession';

interface QuickUserCreationProps {
  onClose?: () => void;
}

const QuickUserCreation = ({ onClose }: QuickUserCreationProps) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createUser } = useUserSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      const result = await createUser(username);
      if (result) {
        // Success - user will be redirected automatically
        onClose?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white transform animate-scale-in shadow-2xl border-0">
        <CardHeader className="text-center relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose}
            className="absolute right-2 top-2 hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center justify-center gap-2 text-xl animate-pulse">
            <User className="w-6 h-6 text-purple-600" />
            Create Your Inbox
          </CardTitle>
          <p className="text-gray-600 animate-fade-in">Choose a username to get started</p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Returning user? Just enter your username to recover your account!
            </p>
          </div>
        </CardHeader>
        <CardContent className="animate-slide-in-right">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-purple-200"
                disabled={isLoading}
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1 animate-fade-in">
                Your link will be: anonchat.app/{username}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                disabled={!username.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create / Recover
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickUserCreation;
