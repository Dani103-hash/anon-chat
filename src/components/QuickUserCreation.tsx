
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User } from 'lucide-react';
import { useUserSession } from '@/hooks/useUserSession';

const QuickUserCreation = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createUser } = useUserSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await createUser(username);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <User className="w-6 h-6 text-purple-600" />
            Create Your Inbox
          </CardTitle>
          <p className="text-gray-600">Choose a username to get started</p>
        </CardHeader>
        <CardContent>
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
                className="w-full"
                disabled={isLoading}
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1">
                Your link will be: anonchat.app/{username}
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create My Inbox'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickUserCreation;
