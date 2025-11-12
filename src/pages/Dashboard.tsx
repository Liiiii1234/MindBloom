import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { storage, MoodEntry } from '@/lib/storage';
import { Heart, Brain, Moon, Activity } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';

export default function Dashboard() {
  const [moodScore, setMoodScore] = useState([5]);
  const [stressLevel, setStressLevel] = useState([5]);
  const [thoughts, setThoughts] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const entries = storage.getMoodEntries();
    const sorted = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentEntries(sorted.slice(0, 7));

    const today = format(new Date(), 'yyyy-MM-dd');
    const todaysEntry = entries.find(e => e.date === today);
    setTodayEntry(todaysEntry || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry = {
      date: format(new Date(), 'yyyy-MM-dd'),
      moodScore: moodScore[0],
      stressLevel: stressLevel[0],
      thoughts,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
    };

    storage.saveMoodEntry(entry);

    const progress = storage.getUserProgress();
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastCheckIn = progress.lastCheckIn;

    let newStreak = progress.currentStreak;
    if (lastCheckIn) {
      const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        newStreak += 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newProgress = {
      ...progress,
      totalCheckIns: progress.totalCheckIns + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastCheckIn: today,
      avatarLevel: Math.floor(progress.totalCheckIns / 7) + 1,
    };

    if (newProgress.totalCheckIns === 7 && !progress.badges.includes('week-warrior')) {
      newProgress.badges.push('week-warrior');
    }
    if (newProgress.currentStreak === 7 && !progress.badges.includes('streak-master')) {
      newProgress.badges.push('streak-master');
    }

    storage.updateUserProgress(newProgress);

    setThoughts('');
    setHeartRate('');
    setSleepHours('');
    loadEntries();
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 9) return '😄';
    if (score >= 7) return '🙂';
    if (score >= 5) return '😐';
    if (score >= 3) return '😟';
    return '😢';
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-blue-100 text-blue-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-rose-100 text-rose-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Check-In</h1>
          <p className="text-muted-foreground mt-1">How are you feeling today?</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Your Wellbeing</CardTitle>
            <CardDescription>Take a moment to reflect on your day</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Mood Score: {moodScore[0]} {getMoodEmoji(moodScore[0])}</Label>
                <Slider
                  value={moodScore}
                  onValueChange={setMoodScore}
                  min={1}
                  max={10}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stress Level: {stressLevel[0]}</Label>
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  min={1}
                  max={10}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Calm</span>
                  <span>Stressed</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thoughts">What's on your mind?</Label>
                <Textarea
                  id="thoughts"
                  placeholder="Share your thoughts, feelings, or reflections..."
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="75"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleepHours">Sleep Hours (optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-blue-500" />
                    <Input
                      id="sleepHours"
                      type="number"
                      step="0.5"
                      placeholder="7.5"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!!todayEntry}>
                {todayEntry ? 'Already Logged Today' : 'Save Check-In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your wellness at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayEntry ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Brain className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mood</p>
                      <p className="text-2xl font-bold">{todayEntry.moodScore}/10</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Activity className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Stress</p>
                      <p className="text-2xl font-bold">{todayEntry.stressLevel}/10</p>
                    </div>
                  </div>

                  {todayEntry.heartRate && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <Heart className="w-8 h-8 text-rose-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="text-2xl font-bold">{todayEntry.heartRate}</p>
                      </div>
                    </div>
                  )}

                  {todayEntry.sleepHours && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <Moon className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Sleep</p>
                        <p className="text-2xl font-bold">{todayEntry.sleepHours}h</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Complete your check-in to see today's stats</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7-Day Emotion Curve</CardTitle>
              <CardDescription>Your mood journey over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {recentEntries.length > 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
                    const entry = recentEntries.find(e => e.date === date);

                    return (
                      <div key={date} className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground w-20">
                          {format(parseISO(date), 'EEE, MMM d')}
                        </span>
                        {entry ? (
                          <>
                            <div className="flex-1 h-8 rounded-full overflow-hidden bg-muted">
                              <div
                                className={`h-full flex items-center px-3 ${getMoodColor(entry.moodScore)}`}
                                style={{ width: `${entry.moodScore * 10}%` }}
                              >
                                <span className="text-xs font-medium">{entry.moodScore}</span>
                              </div>
                            </div>
                            <span className="text-2xl">{getMoodEmoji(entry.moodScore)}</span>
                          </>
                        ) : (
                          <div className="flex-1 h-8 rounded-full bg-muted flex items-center px-3">
                            <span className="text-xs text-muted-foreground">No entry</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Start logging your mood to see your emotion curve</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
