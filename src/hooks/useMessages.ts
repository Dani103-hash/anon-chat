
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  message_text: string;
  created_at: string;
  is_answered: boolean;
  is_reported: boolean;
}

export const useMessages = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadMessages();
      
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('New message received:', payload);
            const newMessage = payload.new as Message;
            setMessages(prev => [newMessage, ...prev]);
            
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('New anonymous message!', {
                body: 'You have received a new anonymous message',
                icon: '/lovable-uploads/icon-192x192.png',
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  const loadMessages = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsAnswered = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_answered: true })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_answered: true } : msg
      ));

      toast({
        title: "Message marked as answered",
        description: "This message will show as answered",
      });
    } catch (error) {
      console.error('Error marking message as answered:', error);
      toast({
        title: "Error",
        description: "Failed to mark message as answered",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));

      toast({
        title: "Message deleted",
        description: "The message has been removed",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const reportMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_reported: true })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_reported: true } : msg
      ));

      toast({
        title: "Message reported",
        description: "Thank you for reporting this message",
      });
    } catch (error) {
      console.error('Error reporting message:', error);
      toast({
        title: "Error",
        description: "Failed to report message",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (targetUsername: string, messageText: string) => {
    try {
      console.log('Sending message to:', targetUsername, 'Message:', messageText);
      
      if (!messageText.trim()) {
        throw new Error("Message cannot be empty");
      }

      if (messageText.length > 500) {
        throw new Error("Message too long (max 500 characters)");
      }

      // Find the target user by username (case insensitive)
      const { data: targetUser, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .ilike('username', targetUsername.toLowerCase())
        .single();

      console.log('Target user found:', targetUser);

      if (userError || !targetUser) {
        console.error('User lookup error:', userError);
        throw new Error(`User "${targetUsername}" not found. Make sure the username is correct.`);
      }

      // Send the message
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          user_id: targetUser.id,
          message_text: messageText.trim()
        })
        .select()
        .single();

      console.log('Message sent:', messageData);

      if (error) {
        console.error('Message insert error:', error);
        throw error;
      }

      toast({
        title: "Message sent! 🎉",
        description: `Your anonymous message has been delivered to @${targetUser.username}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    messages,
    loading,
    markAsAnswered,
    deleteMessage,
    reportMessage,
    sendMessage,
    refetchMessages: loadMessages
  };
};
