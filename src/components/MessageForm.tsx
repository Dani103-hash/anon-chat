
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowDown } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { Filter } from 'bad-words';

interface MessageFormProps {
  targetUser: string;
  onBack: () => void;
}

const filter = new Filter();

const quickPrompts = [
  { text: "Ask me anything", emoji: "❓", category: "question" },
  { text: "Confess something", emoji: "💭", category: "confession" },
  { text: "Give me a compliment", emoji: "💝", category: "compliment" },
  { text: "Roast me", emoji: "🔥", category: "roast" },
  { text: "Tell me a secret", emoji: "🤫", category: "secret" },
  { text: "Rate my [something]", emoji: "⭐", category: "rate" },
  { text: "Would you rather...", emoji: "🤔", category: "wouldyou" },
  { text: "Truth or dare", emoji: "💯", category: "truthdare" }
];

const MessageForm = ({ targetUser, onBack }: MessageFormProps) => {
  const [message, setMessage] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendMessage } = useMessages();

  const handlePromptSelect = (promptText: string) => {
    if (selectedPrompt === promptText) {
      setSelectedPrompt(null);
      setMessage('');
    } else {
      setSelectedPrompt(promptText);
      setMessage(promptText + ': ');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    if (filter.isProfane(message)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await sendMessage(targetUser, message);
      
      if (success) {
        setMessage('');
        setSelectedPrompt(null);
        
        // Show success and redirect after 2 seconds
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          
          <div className="text-center mb-8">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="absolute top-4 left-4 text-white hover:bg-white/20"
            >
              ← Back
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Send Anonymous Message
            </h1>
            <p className="text-white/90 mb-4 drop-shadow">
              to @{targetUser}
            </p>
            
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Your identity will remain completely anonymous
            </Badge>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-xl font-bold text-white text-center mb-6 drop-shadow">
              Choose a prompt or write your own message
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt.text}
                  onClick={() => handlePromptSelect(prompt.text)}
                  variant={selectedPrompt === prompt.text ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 text-center transition-all duration-200 ${
                    selectedPrompt === prompt.text
                      ? 'bg-white text-purple-700 border-white scale-105'
                      : 'bg-white/90 text-gray-700 border-white/50 hover:bg-white hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{prompt.emoji}</span>
                  <span className="text-sm font-medium leading-tight">{prompt.text}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-center text-gray-800 flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Write Your Message
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <Textarea
                    placeholder={selectedPrompt 
                      ? `Continue your message after "${selectedPrompt}:"...` 
                      : "Write your anonymous message here..."
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] text-lg border-2 border-purple-200 focus:border-purple-500 resize-none"
                    maxLength={500}
                  />
                  
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>Keep it respectful and anonymous</span>
                    <span className={message.length > 450 ? 'text-red-500' : ''}>{message.length}/500</span>
                  </div>

                  {filter.isProfane(message) && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ Your message contains inappropriate content
                    </p>
                  )}
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ArrowDown className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Community Guidelines</p>
                      <p>Messages are filtered for inappropriate content. Be kind, respectful, and keep it fun!</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={isSubmitting || !message.trim() || filter.isProfane(message)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3 font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Anonymous Message
                    <//>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/80 text-sm">
              Your message will be delivered instantly and anonymously
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
