
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, ArrowDown } from "lucide-react";
import MessageForm from "@/components/MessageForm";

interface Message {
  id: string;
  text: string;
  timestamp: number;
  isAnswered: boolean;
  reply?: string;
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load public messages (only those with replies)
  useEffect(() => {
    if (username) {
      const savedMessages = localStorage.getItem(`anonChat_messages_${username}`);
      if (savedMessages) {
        const allMessages = JSON.parse(savedMessages);
        const publicMessages = allMessages.filter((msg: Message) => msg.reply);
        setMessages(publicMessages);
      }
    }
  }, [username]);

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-pink-500">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">Invalid Profile</h1>
          <p>This profile URL is not valid.</p>
        </div>
      </div>
    );
  }

  if (showMessageForm) {
    return (
      <MessageForm
        targetUser={username}
        onBack={() => setShowMessageForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-white/20 backdrop-blur rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              @{username}
            </h1>
            <p className="text-white/90 mb-6 drop-shadow">
              Send me an anonymous message!
            </p>
            
            <Button 
              onClick={() => setShowMessageForm(true)}
              className="bg-white text-purple-700 hover:bg-white/90 text-lg px-8 py-3 font-semibold shadow-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Anonymous Message
            </Button>
          </div>

          {/* Stats */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {messages.length}
                </div>
                <div className="text-gray-600">
                  Public Q&As
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Public Messages & Replies */}
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No public Q&As yet</h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to send @{username} an anonymous message!
                  </p>
                  <Button 
                    onClick={() => setShowMessageForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send First Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                    Public Q&As
                  </h2>
                  <p className="text-white/80 drop-shadow">
                    See what others have asked @{username}
                  </p>
                </div>
                
                {messages
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((message) => (
                    <Card key={message.id} className="bg-white/95 backdrop-blur border-0 shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Anonymous Question
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {/* Anonymous Question */}
                        <div className="mb-4">
                          <p className="text-gray-800 text-lg leading-relaxed">
                            "{message.text}"
                          </p>
                        </div>
                        
                        {/* Reply */}
                        {message.reply && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {username[0].toUpperCase()}
                                </span>
                              </div>
                              <p className="text-purple-800 font-medium">@{username} replied:</p>
                            </div>
                            <p className="text-purple-700 text-lg">{message.reply}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-lg max-w-md mx-auto">
              <CardContent className="p-8">
                <ArrowDown className="w-8 h-8 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ask @{username} anything!</h3>
                <p className="text-gray-600 mb-4">Your message will be completely anonymous</p>
                <Button 
                  onClick={() => setShowMessageForm(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Anonymous Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              Powered by AnonChat • 100% Anonymous
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
