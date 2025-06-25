
import { useState, useEffect } from 'react';

interface UserStats {
  messagesReceived: number;
  streak: number;
  reactions: number;
  messagesSent: number;
  joinDate: string;
}

export const useGamification = (userId?: string) => {
  const [stats, setStats] = useState<UserStats>({
    messagesReceived: 0,
    streak: 0,
    reactions: 0,
    messagesSent: 0,
    joinDate: new Date().toISOString()
  });

  useEffect(() => {
    if (userId) {
      loadUserStats();
    }
  }, [userId]);

  const loadUserStats = () => {
    // Load from localStorage for now (in production, this would be from Supabase)
    const savedStats = localStorage.getItem(`userStats_${userId}`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  };

  const updateStats = (updates: Partial<UserStats>) => {
    const newStats = { ...stats, ...updates };
    setStats(newStats);
    if (userId) {
      localStorage.setItem(`userStats_${userId}`, JSON.stringify(newStats));
    }
  };

  const incrementMessageReceived = () => {
    updateStats({ messagesReceived: stats.messagesReceived + 1 });
  };

  const incrementReaction = () => {
    updateStats({ reactions: stats.reactions + 1 });
  };

  const incrementMessageSent = () => {
    updateStats({ messagesSent: stats.messagesSent + 1 });
  };

  const updateStreak = () => {
    const lastActive = localStorage.getItem(`lastActive_${userId}`);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (lastActive === yesterday) {
      updateStats({ streak: stats.streak + 1 });
    } else if (lastActive !== today) {
      updateStats({ streak: 1 });
    }
    
    localStorage.setItem(`lastActive_${userId}`, today);
  };

  return {
    stats,
    incrementMessageReceived,
    incrementReaction,
    incrementMessageSent,
    updateStreak
  };
};
