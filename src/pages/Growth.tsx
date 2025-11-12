import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage, UserProgress } from '@/lib/storage';
import { Sparkles, Award, Flame, Trophy, Target, Heart } from 'lucide-react';
import { format } from 'date-fns';

const AVATAR_STAGES = [
  { level: 1, emoji: '🌱', name: 'Seedling', description: 'Just beginning your journey' },
  { level: 2, emoji: '🌿', name: 'Sprout', description: 'Growing steadily' },
  { level: 3, emoji: '🪴', name: 'Young Plant', description: 'Building strong roots' },
  { level: 4, emoji: '🌳', name: 'Tree', description: 'Flourishing and strong' },
  { level: 5, emoji: '🌸', name: 'Blooming', description: 'Full of vitality' },
];

const BADGES = [
  { id: 'week-warrior', icon: Award, name: 'Week Warrior', description: 'Completed 7 check-ins', color: 'text-amber-500' },
  { id: 'streak-master', icon: Flame, name: 'Streak Master', description: '7-day streak achieved', color: 'text-orange-500' },
  { id: 'reflection-pro', icon: Sparkles, name: 'Reflection Pro', description: 'Deep self-reflection', color: 'text-blue-500' },
  { id: 'wellness-champion', icon: Trophy, name: 'Wellness Champion', description: 'Exceptional consistency', color: 'text-green-500' },
];

export default function Growth() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState(AVATAR_STAGES[0]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const userProgress = storage.getUserProgress();
    setProgress(userProgress);

    const avatarIndex = Math.min(userProgress.avatarLevel - 1, AVATAR_STAGES.length - 1);
    setCurrentAvatar(AVATAR_STAGES[avatarIndex]);
  };

  const getMotivationalMessage = () => {
    if (!progress) return '';

    if (progress.currentStreak >= 7) {
      return "You're on fire! Your consistency is inspiring.";
    }
    if (progress.currentStreak >= 3) {
      return "Great momentum! Keep nurturing your wellbeing.";
    }
    if (progress.totalCheckIns >= 10) {
      return "Look how far you've come! Every step matters.";
    }
    if (progress.totalCheckIns > 0) {
      return "You've started your journey - that's the hardest part!";
    }
    return "Begin your wellness journey today!";
  };

  if (!progress) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Growth Journey</h1>
        <p className="text-muted-foreground mt-1">Watch yourself bloom with every step</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Companion</CardTitle>
            <CardDescription>{getMotivationalMessage()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-9xl mb-4 animate-bounce-slow">
                {currentAvatar.emoji}
              </div>
              <h3 className="text-2xl font-bold mb-2">{currentAvatar.name}</h3>
              <p className="text-muted-foreground mb-6">{currentAvatar.description}</p>

              <div className="w-full max-w-md space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Level {progress.avatarLevel}</span>
                  <span className="text-muted-foreground">
                    {progress.totalCheckIns % 7}/7 to next level
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                    style={{ width: `${((progress.totalCheckIns % 7) / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Progress Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <div>
                  <p className="text-sm text-muted-foreground">Total Check-ins</p>
                  <p className="text-3xl font-bold">{progress.totalCheckIns}</p>
                </div>
                <Heart className="w-8 h-8 text-blue-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold">{progress.currentStreak} days</p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-3xl font-bold">{progress.longestStreak} days</p>
                </div>
                <Trophy className="w-8 h-8 text-green-500" />
              </div>
            </div>

            {progress.lastCheckIn && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Last check-in: {format(new Date(progress.lastCheckIn), 'MMMM d, yyyy')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Badges & Achievements</span>
            </CardTitle>
            <CardDescription>
              Celebrate your milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {BADGES.map((badge) => {
                const earned = progress.badges.includes(badge.id);
                const Icon = badge.icon;

                return (
                  <div
                    key={badge.id}
                    className={`flex items-center space-x-4 p-3 rounded-lg border transition-all ${
                      earned
                        ? 'bg-muted border-primary'
                        : 'opacity-50 border-muted'
                    }`}
                  >
                    <div className={`${earned ? badge.color : 'text-muted-foreground'}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{badge.name}</p>
                        {earned && (
                          <Badge variant="secondary" className="text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {progress.badges.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Complete check-ins to earn your first badge!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Milestones</CardTitle>
          <CardDescription>Your journey through MindBloom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {AVATAR_STAGES.map((stage) => {
              const isUnlocked = progress.avatarLevel >= stage.level;
              const isCurrent = progress.avatarLevel === stage.level;

              return (
                <div
                  key={stage.level}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary/5'
                      : isUnlocked
                      ? 'border-muted bg-muted/30'
                      : 'border-muted opacity-40'
                  }`}
                >
                  <div className="text-4xl">{stage.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">Level {stage.level}: {stage.name}</p>
                      {isCurrent && (
                        <Badge>Current</Badge>
                      )}
                      {isUnlocked && !isCurrent && (
                        <Badge variant="secondary">Unlocked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                    {!isUnlocked && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Unlocks at {(stage.level - 1) * 7} check-ins
                      </p>
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
}
