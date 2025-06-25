
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Sparkles } from "lucide-react";
import { useUserSession } from "@/hooks/useUserSession";

interface QuickUserCreationProps {
  onSuccess: () => void;
}

const QuickUserCreation = ({ onSuccess }: QuickUserCreationProps) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createUser } = useUserSession();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    const newUser = await createUser(username);
    setIsLoading(false);
    
    if (newUser) {
      onSuccess();
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Create Your Anonymous Inbox
        </CardTitle>
        <p className="text-gray-600">
          Choose a username and start receiving anonymous messages instantly
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="text-center text-lg border-2 border-purple-200 focus:border-purple-500"
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              3+ characters, letters, numbers, and underscores only
            </p>
          </div>
          
          <Button 
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2" />
            ) : (
              <UserPlus className="w-5 h-5 mr-2" />
            )}
            Create My Inbox
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            No email required • Start anonymously • Upgrade anytime
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickUserCreation;
