
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Star, Heart, MessageSquare, Crown } from 'lucide-react';

interface UserStats {
  messagesReceived: number;
  streak: number;
  reactions: number;
  messagesSent: number;
  joinDate: string;
}

interface GamificationSystemProps {
  stats: UserStats;
  username: string;
}

const achievements = [
  {
    id: 'popular',
    name: 'Popular',
    description: 'Received 10+ messages',
    icon: Star,
    requirement: 10,
    type: 'messages',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    description: 'Sent 50+ anonymous messages',
    icon: MessageSquare,
    requirement: 50,
    type: 'sent',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Received 100+ reactions',
    icon: Heart,
    requirement: 100,
    type: 'reactions',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: '7-day activity streak',
    icon: Flame,
    requirement: 7,
    type: 'streak',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Received 100+ messages',
    icon: Crown,
    requirement: 100,
    type: 'messages',
    color: 'bg-blue-100 text-blue-800'
  }
];

const GamificationSystem = ({ stats, username }: GamificationSystemProps) => {
  const getProgress = (achievement: typeof achievements[0]) => {
    let current = 0;
    switch (achievement.type) {
      case 'messages':
        current = stats.messagesReceived;
        break;
      case 'sent':
        current = stats.messagesSent;
        break;
      case 'reactions':
        current = stats.reactions;
        break;
      case 'streak':
        current = stats.streak;
        break;
    }
    return Math.min((current / achievement.requirement) * 100, 100);
  };

  const isUnlocked = (achievement: typeof achievements[0]) => {
    return getProgress(achievement) >= 100;
  };

  const getLevel = () => {
    const totalScore = stats.messagesReceived + stats.reactions + (stats.streak * 2) + (stats.messagesSent * 0.5);
    return Math.floor(totalScore / 25) + 1;
  };

  const getNextLevelProgress = () => {
    const totalScore = stats.messagesReceived + stats.reactions + (stats.streak * 2) + (stats.messagesSent * 0.5);
    const currentLevelStart = (getLevel() - 1) * 25;
    const nextLevelStart = getLevel() * 25;
    return ((totalScore - currentLevelStart) / (nextLevelStart - currentLevelStart)) * 100;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            Level {getLevel()} - @{username}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {getLevel() + 1}</span>
              <span>{Math.round(getNextLevelProgress())}%</span>
            </div>
            <Progress value={getNextLevelProgress()} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.messagesReceived}</div>
              <div className="text-xs text-gray-600">Messages</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5" />
                {stats.streak}
              </div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{stats.reactions}</div>
              <div className="text-xs text-gray-600">Reactions</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.messagesSent}</div>
              <div className="text-xs text-gray-600">Sent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {achievements.map(achievement => {
              const Icon = achievement.icon;
              const unlocked = isUnlocked(achievement);
              const progress = getProgress(achievement);
              
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    unlocked 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-full ${unlocked ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                    <Icon className={`w-4 h-4 ${unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                        {achievement.name}
                      </span>
                      {unlocked && (
                        <Badge className={achievement.color}>
                          Unlocked!
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                    
                    {!unlocked && (
                      <div className="space-y-1">
                        <Progress value={progress} className="h-1" />
                        <p className="text-xs text-gray-500">
                          {Math.round(progress)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationSystem;
