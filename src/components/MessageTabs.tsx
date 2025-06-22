
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2, Flag, Clock, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  message_text: string;
  created_at: string;
  is_answered: boolean;
  is_reported: boolean;
}

interface MessageTabsProps {
  messages: Message[];
  onMarkAnswered: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onReport: (messageId: string) => void;
}

const MessageTabs = ({ messages, onMarkAnswered, onDelete, onReport }: MessageTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const unansweredMessages = messages.filter(msg => !msg.is_answered);
  const answeredMessages = messages.filter(msg => msg.is_answered);

  const MessageCard = ({ message }: { message: Message }) => (
    <Card key={message.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {message.is_answered ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Answered
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                Unanswered
              </Badge>
            )}
            {message.is_reported && (
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                <Flag className="w-3 h-3 mr-1" />
                Reported
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-gray-800 mb-4 leading-relaxed">
          {message.message_text}
        </p>
        
        <div className="flex gap-2 flex-wrap">
          {!message.is_answered && (
            <Button
              onClick={() => onMarkAnswered(message.id)}
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark as Answered
            </Button>
          )}
          
          {!message.is_reported && (
            <Button
              onClick={() => onReport(message.id)}
              size="sm"
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Flag className="w-3 h-3 mr-1" />
              Report
            </Button>
          )}
          
          <Button
            onClick={() => onDelete(message.id)}
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all" className="relative">
          All Messages
          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
            {messages.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="unanswered" className="relative">
          Unanswered
          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-yellow-100 text-yellow-800">
            {unansweredMessages.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="answered" className="relative">
          Answered
          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-green-100 text-green-800">
            {answeredMessages.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages yet. Share your link to start receiving messages!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="unanswered" className="mt-6">
        {unansweredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            All caught up! No unanswered messages.
          </div>
        ) : (
          <div className="space-y-4">
            {unansweredMessages.map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="answered" className="mt-6">
        {answeredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No answered messages yet.
          </div>
        ) : (
          <div className="space-y-4">
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
