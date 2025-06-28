
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useMessageSender = () => {
  const { toast } = useToast();

  const sendMessage = async (targetUsername: string, messageText: string) => {
    try {
      console.log('Sending message to:', targetUsername, 'Message:', messageText);
      
      if (!messageText.trim()) {
        throw new Error("Message cannot be empty");
      }

      if (messageText.length > 500) {
        throw new Error("Message too long (max 500 characters)");
      }

      // Find the target user by username (exact match, case-sensitive)
      const { data: targetUser, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', targetUsername.toLowerCase()) // Store usernames in lowercase
        .single();

      console.log('Target user found:', targetUser);

      if (userError || !targetUser) {
        console.error('User lookup error:', userError);
        
        // Try case-insensitive search as fallback
        const { data: fallbackUser, error: fallbackError } = await supabase
          .from('users')
          .select('id, username')
          .ilike('username', targetUsername)
          .single();
          
        if (fallbackError || !fallbackUser) {
          throw new Error(`User "@${targetUsername}" not found. Make sure the username is correct and the user has created their inbox.`);
        }
        
        // Use the fallback user if found
        const { data: messageData, error } = await supabase
          .from('messages')
          .insert({
            user_id: fallbackUser.id,
            message_text: messageText.trim()
          })
          .select()
          .single();

        if (error) {
          console.error('Message insert error:', error);
          throw error;
        }

        toast({
          title: "Message sent! 🎉",
          description: `Your anonymous message has been delivered to @${fallbackUser.username}`,
        });

        return true;
      }

      // Send the message with the primary user
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
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { sendMessage };
};
