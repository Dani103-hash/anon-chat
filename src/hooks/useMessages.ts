
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

  const sendMessage = async (targetUserId: string, messageText: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: targetUserId,
          message_text: messageText
        });

      if (error) throw error;

      toast({
        title: "Message sent! 🎉",
        description: "Your anonymous message has been delivered",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
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
