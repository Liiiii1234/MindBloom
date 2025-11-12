export interface MoodEntry {
  id: string;
  date: string;
  moodScore: number;
  stressLevel: number;
  thoughts: string;
  heartRate?: number;
  sleepHours?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserProgress {
  totalCheckIns: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  avatarLevel: number;
  lastCheckIn?: string;
}

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'mindbloom_mood_entries',
  CHAT_MESSAGES: 'mindbloom_chat_messages',
  USER_PROGRESS: 'mindbloom_user_progress',
};

export const storage = {
  getMoodEntries(): MoodEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
    return data ? JSON.parse(data) : [];
  },

  saveMoodEntry(entry: Omit<MoodEntry, 'id'>): MoodEntry {
    const entries = this.getMoodEntries();
    const newEntry: MoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries));
    return newEntry;
  },

  getChatMessages(): ChatMessage[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (!data) return [];
    try {
      const messages = JSON.parse(data) as ChatMessage[];
      // Filter out invalid messages (missing timestamp or invalid timestamp)
      return messages.filter(msg => msg.timestamp && !isNaN(new Date(msg.timestamp).getTime()));
    } catch (error) {
      console.error('Error parsing chat messages:', error);
      return [];
    }
  },

  saveChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const messages = this.getChatMessages();
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    return newMessage;
  },

  clearChatHistory() {
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  },

  getUserProgress(): UserProgress {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : {
      totalCheckIns: 0,
      currentStreak: 0,
      longestStreak: 0,
      badges: [],
      avatarLevel: 1,
    };
  },

  updateUserProgress(progress: UserProgress) {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  },
};
