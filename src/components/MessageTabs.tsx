
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  message_text: string;
  created_at: string;
  is_answered: boolean;
  is_reported: boolean;
}

interface MessageTabsProps {
  messages: Message[];
  onMarkAnswered: (id: string) => void;
  onDelete: (id: string) => void;
  onReport: (id: string) => void;
}

const MessageTabs = ({ messages, onMarkAnswered, onDelete, onReport }: MessageTabsProps) => {
  const [activeTab, setActiveTab] = useState('unanswered');

  const unansweredMessages = messages.filter(msg => !msg.is_answered);
  const answeredMessages = messages.filter(msg => msg.is_answered);

  const MessageCard = ({ message }: { message: Message }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={message.is_answered ? "default" : "secondary"}>
              {message.is_answered ? "Answered" : "New"}
            </Badge>
            {message.is_reported && (
              <Badge variant="destructive">Reported</Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {new Date(message.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <p className="text-gray-800 mb-4 leading-relaxed">
          {message.message_text}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {!message.is_answered && (
            <Button
              onClick={() => onMarkAnswered(message.id)}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Check className="w-4 h-4 mr-1" />
              Mark as Answered
            </Button>
          )}
          
          {!message.is_reported && (
            <Button
              onClick={() => onReport(message.id)}
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Report
            </Button>
          )}
          
          <Button
            onClick={() => onDelete(message.id)}
            variant="outline"
            size="sm"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="unanswered" className="relative">
          Unanswered
          {unansweredMessages.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {unansweredMessages.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="answered">
          Answered ({answeredMessages.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="unanswered" className="mt-4">
        {unansweredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No unanswered messages</p>
            </CardContent>
          </Card>
        ) : (
          <div>
            {unansweredMessages.map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="answered" className="mt-4">
        {answeredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No answered messages</p>
            </CardContent>
          </Card>
        ) : (
          <div>
            {answeredMessages.map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MessageTabs;
