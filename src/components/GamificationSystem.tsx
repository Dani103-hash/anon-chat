
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target, Award, Calendar } from 'lucide-react';

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

interface GamificationSystemProps {
  stats: GamificationStats;
  username: string;
}

const GamificationSystem = ({ stats, username }: GamificationSystemProps) => {
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

  const getNextLevelProgress = () => {
    const currentLevelPoints = (stats.level - 1) * 100;
    const nextLevelPoints = stats.level * 100;
    const progress = ((stats.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getUpcomingAchievements = () => {
    const upcoming = [];
    
    if (stats.messagesReceived < 10) {
      upcoming.push({ name: "Getting Popular", description: `Receive ${10 - stats.messagesReceived} more messages`, progress: (stats.messagesReceived / 10) * 100 });
    } else if (stats.messagesReceived < 50) {
      upcoming.push({ name: "Very Popular", description: `Receive ${50 - stats.messagesReceived} more messages`, progress: (stats.messagesReceived / 50) * 100 });
    } else if (stats.messagesReceived < 100) {
      upcoming.push({ name: "Super Popular", description: `Receive ${100 - stats.messagesReceived} more messages`, progress: (stats.messagesReceived / 100) * 100 });
    }
    
    if (stats.messagesAnswered < 25) {
      upcoming.push({ name: "Great Responder", description: `Answer ${25 - stats.messagesAnswered} more messages`, progress: (stats.messagesAnswered / 25) * 100 });
    }
    
    if (stats.currentStreak < 7) {
      upcoming.push({ name: "Week Warrior", description: `${7 - stats.currentStreak} more days to go`, progress: (stats.currentStreak / 7) * 100 });
    } else if (stats.currentStreak < 30) {
      upcoming.push({ name: "Monthly Master", description: `${30 - stats.currentStreak} more days to go`, progress: (stats.currentStreak / 30) * 100 });
    }
    
    return upcoming.slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Level and Progress */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Level {stats.level} • @{username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{stats.totalPoints} points</span>
              <span>Next: {stats.level * 100} points</span>
            </div>
            <Progress 
              value={getNextLevelProgress()} 
              className="h-3 bg-white/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{stats.messagesReceived}</div>
            <div className="text-sm text-gray-600">Messages</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.messagesAnswered}</div>
            <div className="text-sm text-gray-600">Answered</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.longestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements ({stats.achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.achievements.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No achievements yet. Start receiving messages to unlock them! 🎯
            </p>
          ) : (
            <div className="grid gap-3">
              {stats.achievements.map((achievementId) => {
                const achievement = getAchievementDetails(achievementId);
                return (
                  <div key={achievementId} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{achievement.name}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Unlocked
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Achievements */}
      {getUpcomingAchievements().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Next Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getUpcomingAchievements().map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{goal.name}</span>
                    <span className="text-sm text-gray-500">{Math.round(goal.progress)}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GamificationSystem;
