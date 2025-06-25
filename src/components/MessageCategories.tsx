
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Flame, Laugh, Zap, Brain, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  message_text: string;
  created_at: string;
  category?: string;
  reactions?: Record<string, number>;
}

interface MessageCategoriesProps {
  messages: Message[];
  onCategoryFilter: (category: string | null) => void;
  onReact: (messageId: string, reaction: string) => void;
}

const categories = [
  { id: 'compliments', name: 'Compliments', icon: Heart, color: 'bg-pink-100 text-pink-800' },
  { id: 'questions', name: 'Questions', icon: MessageCircle, color: 'bg-blue-100 text-blue-800' },
  { id: 'confessions', name: 'Confessions', icon: Zap, color: 'bg-purple-100 text-purple-800' },
  { id: 'fun', name: 'Fun', icon: Laugh, color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advice', name: 'Advice', icon: Brain, color: 'bg-green-100 text-green-800' },
];

const reactions = [
  { id: 'heart', emoji: '❤️', name: 'Heart' },
  { id: 'fire', emoji: '🔥', name: 'Fire' },
  { id: 'laugh', emoji: '😂', name: 'Laugh' },
  { id: 'surprise', emoji: '😱', name: 'Surprised' },
  { id: 'thinking', emoji: '🤔', name: 'Thinking' },
];

const MessageCategories = ({ messages, onCategoryFilter, onReact }: MessageCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onCategoryFilter(categoryId);
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    messages.forEach(msg => {
      if (msg.category) {
        stats[msg.category] = (stats[msg.category] || 0) + 1;
      }
    });
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Message Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(null)}
            >
              All Messages ({messages.length})
            </Button>
            {categories.map(category => {
              const Icon = category.icon;
              const count = stats[category.id] || 0;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategorySelect(category.id)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-3 h-3" />
                  {category.name} ({count})
                </Button>
              );
            })}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              const count = stats[category.id] || 0;
              return (
                <div
                  key={category.id}
                  className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <Icon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium text-gray-800">{category.name}</p>
                  <Badge variant="secondary" className={`text-xs mt-1 ${category.color}`}>
                    {count}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Reactions</CardTitle>
          <p className="text-sm text-gray-600">React to messages to show appreciation</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {reactions.map(reaction => (
              <Badge
                key={reaction.id}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {reaction.emoji} {reaction.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCategories;
