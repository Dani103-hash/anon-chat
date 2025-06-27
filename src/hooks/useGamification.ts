
import { useState, useEffect } from 'react';

interface GamificationStats {
  messagesReceived: number;
  messagesAnswered: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  totalPoints: number;
  achievements: string[];
  lastActiveDate: string;
}

const defaultStats: GamificationStats = {
  messagesReceived: 0,
  messagesAnswered: 0,
  currentStreak: 0,
  longestStreak: 0,
  level: 1,
  totalPoints: 0,
  achievements: [],
  lastActiveDate: new Date().toDateString()
};

export const useGamification = (userId?: string) => {
  const [stats, setStats] = useState<GamificationStats>(defaultStats);

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId]);

  const loadStats = () => {
    if (!userId) return;
    
    const savedStats = localStorage.getItem(`gamification_${userId}`);
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats({ ...defaultStats, ...parsed });
      } catch (error) {
        console.error('Error loading gamification stats:', error);
        setStats(defaultStats);
      }
    } else {
      setStats(defaultStats);
    }
  };

  const saveStats = (newStats: GamificationStats) => {
    if (!userId) return;
    
    try {
      localStorage.setItem(`gamification_${userId}`, JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error('Error saving gamification stats:', error);
    }
  };

  const incrementMessageReceived = () => {
    const newStats = {
      ...stats,
      messagesReceived: stats.messagesReceived + 1,
      totalPoints: stats.totalPoints + 10,
      level: Math.floor((stats.totalPoints + 10) / 100) + 1
    };

    // Check for new achievements
    const newAchievements = [...stats.achievements];
    
    if (newStats.messagesReceived === 1 && !newAchievements.includes('first_message')) {
      newAchievements.push('first_message');
    }
    if (newStats.messagesReceived === 10 && !newAchievements.includes('popular_10')) {
      newAchievements.push('popular_10');
    }
    if (newStats.messagesReceived === 50 && !newAchievements.includes('popular_50')) {
      newAchievements.push('popular_50');
    }
    if (newStats.messagesReceived === 100 && !newAchievements.includes('popular_100')) {
      newAchievements.push('popular_100');
    }

    newStats.achievements = newAchievements;
    saveStats(newStats);
  };

  const incrementMessageAnswered = () => {
    const newStats = {
      ...stats,
      messagesAnswered: stats.messagesAnswered + 1,
      totalPoints: stats.totalPoints + 5
    };

    // Check for response achievements
    const newAchievements = [...stats.achievements];
    
    if (newStats.messagesAnswered === 1 && !newAchievements.includes('first_response')) {
      newAchievements.push('first_response');
    }
    if (newStats.messagesAnswered === 25 && !newAchievements.includes('responsive_25')) {
      newAchievements.push('responsive_25');
    }

    newStats.achievements = newAchievements;
    newStats.level = Math.floor(newStats.totalPoints / 100) + 1;
    
    saveStats(newStats);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = new Date(stats.lastActiveDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = stats.currentStreak;

    if (lastActive === today) {
      // Already counted today
      return;
    } else if (lastActive === yesterday) {
      // Consecutive day
      newStreak += 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    const newStats = {
      ...stats,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, stats.longestStreak),
      lastActiveDate: today,
      totalPoints: stats.totalPoints + (newStreak > 1 ? 5 : 0)
    };

    // Check for streak achievements
    const newAchievements = [...stats.achievements];
    
    if (newStreak === 7 && !newAchievements.includes('week_streak')) {
      newAchievements.push('week_streak');
    }
    if (newStreak === 30 && !newAchievements.includes('month_streak')) {
      newAchievements.push('month_streak');
    }

    newStats.achievements = newAchievements;
    newStats.level = Math.floor(newStats.totalPoints / 100) + 1;
    
    saveStats(newStats);
  };

  const getAchievementDetails = (achievementId: string) => {
    const achievements = {
      first_message: { name: "First Message!", description: "Received your first anonymous message", icon: "🎉" },
      popular_10: { name: "Getting Popular", description: "Received 10 messages", icon: "📈" },
      popular_50: { name: "Very Popular", description: "Received 50 messages", icon: "🌟" },
      popular_100: { name: "Super Popular", description: "Received 100 messages", icon: "🔥" },
      first_response: { name: "First Response", description: "Marked your first message as answered", icon: "💬" },
      responsive_25: { name: "Great Responder", description: "Answered 25 messages", icon: "⚡" },
      week_streak: { name: "Week Warrior", description: "7 day activity streak", icon: "🗓️" },
      month_streak: { name: "Monthly Master", description: "30 day activity streak", icon: "🏆" }
    };
    
    return achievements[achievementId as keyof typeof achievements] || { name: achievementId, description: "", icon: "🏅" };
  };

  return {
    stats,
    incrementMessageReceived,
    incrementMessageAnswered,
    updateStreak,
    getAchievementDetails
  };
};
