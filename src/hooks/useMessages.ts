
import { useMessageManager } from './useMessageManager';
import { useMessageSender } from './useMessageSender';

export const useMessages = (userId?: string) => {
  const { messages, loading, markAsAnswered, deleteMessage, reportMessage, refetchMessages } = useMessageManager(userId);
  const { sendMessage } = useMessageSender();

  return {
    messages,
    loading,
    markAsAnswered,
    deleteMessage,
    reportMessage,
    sendMessage,
    refetchMessages
  };
};
