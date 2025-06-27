
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Laugh, ThumbsUp, Star } from 'lucide-react';

interface Message {
  id: string;
  message_text: string;
  created_at: string;
  is_answered: boolean;
  is_reported: boolean;
}

interface MessageCategoriesProps {
  messages: Message[];
  onCategoryFilter: (category: string | null) => void;
  onReact: (messageId: string, reaction: string) => void;
}

const MessageCategories = ({ messages, onCategoryFilter, onReact }: MessageCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});

  const categorizeMessage = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('love') || lowerText.includes('like') || lowerText.includes('crush') || lowerText.includes('heart')) {
      return 'romantic';
    }
    if (lowerText.includes('funny') || lowerText.includes('haha') || lowerText.includes('lol') || lowerText.includes('joke')) {
      return 'funny';
    }
    if (lowerText.includes('question') || lowerText.includes('?') || lowerText.includes('how') || lowerText.includes('what') || lowerText.includes('why')) {
      return 'question';
    }
    if (lowerText.includes('compliment') || lowerText.includes('amazing') || lowerText.includes('awesome') || lowerText.includes('great')) {
      return 'compliment';
    }
    if (lowerText.includes('advice') || lowerText.includes('help') || lowerText.includes('suggest')) {
      return 'advice';
    }
    
    return 'general';
  };

  const getCategories = () => {
    const categories = {
      romantic: { name: 'Romantic', icon: '💕', color: 'bg-pink-100 text-pink-800' },
      funny: { name: 'Funny', icon: '😂', color: 'bg-yellow-100 text-yellow-800' },
      question: { name: 'Questions', icon: '❓', color: 'bg-blue-100 text-blue-800' },
      compliment: { name: 'Compliments', icon: '⭐', color: 'bg-green-100 text-green-800' },
      advice: { name: 'Advice', icon: '💡', color: 'bg-purple-100 text-purple-800' },
      general: { name: 'General', icon: '💬', color: 'bg-gray-100 text-gray-800' }
    };

    const counts = messages.reduce((acc, message) => {
      const category = categorizeMessage(message.message_text);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([key, data]) => ({
      key,
      ...data,
      count: counts[key] || 0
    })).filter(cat => cat.count > 0);
  };

  const handleCategoryClick = (categoryKey: string) => {
    const newCategory = selectedCategory === categoryKey ? null : categoryKey;
    setSelectedCategory(newCategory);
    onCategoryFilter(newCategory);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    const messageReactions = reactions[messageId] || [];
    const updatedReactions = messageReactions.includes(reaction)
      ? messageReactions.filter(r => r !== reaction)
      : [...messageReactions, reaction];
    
    setReactions(prev => ({
      ...prev,
      [messageId]: updatedReactions
    }));
    
    onReact(messageId, reaction);
  };

  const reactionButtons = [
    { emoji: '❤️', name: 'love' },
    { emoji: '😂', name: 'funny' },
    { emoji: '👍', name: 'like' },
    { emoji: '🔥', name: 'fire' },
    { emoji: '⭐', name: 'star' }
  ];

  const categories = getCategories();
  const filteredMessages = selectedCategory 
    ? messages.filter(msg => categorizeMessage(msg.message_text) === selectedCategory)
    : messages;

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Message Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category.key 
                    ? 'bg-purple-600 text-white' 
                    : category.color
                }`}
                onClick={() => handleCategoryClick(category.key)}
              >
                {category.icon} {category.name} ({category.count})
              </Badge>
            ))}
            {selectedCategory && (
              <Badge
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleCategoryClick('')}
              >
                Clear Filter
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="py-8 text-center text-gray-500">
              No messages in this category yet.
            </CardContent>
          </Card>
        ) : (
          filteredMessages.slice(0, 10).map((message) => (
            <Card key={message.id} className="bg-white/95 backdrop-blur">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={getCategories().find(c => c.key === categorizeMessage(message.message_text))?.color || 'bg-gray-100 text-gray-800'}>
                    {getCategories().find(c => c.key === categorizeMessage(message.message_text))?.icon || '💬'} 
                    {getCategories().find(c => c.key === categorizeMessage(message.message_text))?.name || 'General'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-800 mb-3">{message.message_text}</p>
                
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-xs text-gray-500 mr-2">React:</span>
                  {reactionButtons.map((btn) => (
                    <Button
                      key={btn.name}
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 ${
                        reactions[message.id]?.includes(btn.name) 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleReaction(message.id, btn.name)}
                    >
                      {btn.emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {filteredMessages.length > 10 && (
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="py-4 text-center text-gray-500">
              Showing 10 of {filteredMessages.length} messages
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MessageCategories;
