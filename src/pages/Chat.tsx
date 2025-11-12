import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { storage, ChatMessage } from '@/lib/storage';
import { Send, Trash2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Helper function to safely format timestamps
const formatMessageTime = (timestamp: string | undefined): string => {
  if (!timestamp) return 'just now';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'just now';
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'just now';
  }
};

// Local response generator (fallback when API is unavailable)
const generateBloomResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  const responses = {
    sad: [
      "I hear you. It sounds like today has been quite intense — would you like to tell me more?",
      "It's okay to feel this way. Your emotions are valid, and I'm here to listen without judgment.",
      "Thank you for sharing that with me. Sometimes just expressing how we feel can bring a bit of relief.",
    ],
    anxious: [
      "Anxiety can feel overwhelming. Let's take this one step at a time. What's weighing on your mind right now?",
      "It's completely normal to feel anxious. Would it help to talk through what's making you feel this way?",
      "I'm here with you. Remember, every feeling passes, even the difficult ones.",
    ],
    happy: [
      "That's wonderful to hear! What's bringing you joy today?",
      "I'm so glad you're feeling good. These moments are precious — savor them!",
      "Your positive energy is beautiful. Keep nurturing what makes you feel this way.",
    ],
    tired: [
      "It sounds like you've been carrying a lot. Rest is not a luxury, it's a necessity.",
      "Your body and mind are asking for care. What would help you feel more rested?",
      "Being tired is your system's way of telling you it needs attention. Listen to it.",
    ],
    default: [
      "I appreciate you sharing that with me. Every step you take to understand your feelings is a form of courage.",
      "Thank you for opening up. How does it feel to express these thoughts?",
      "I'm listening. Would you like to explore this feeling a bit more?",
      "That must be a lot to carry. You're doing your best, and that's what matters.",
      "Your awareness of your emotions shows real strength. Keep being honest with yourself.",
    ],
  };

  if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
    return responses.sad[Math.floor(Math.random() * responses.sad.length)];
  }
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
    return responses.anxious[Math.floor(Math.random() * responses.anxious.length)];
  }
  if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
    return responses.happy[Math.floor(Math.random() * responses.happy.length)];
  }
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('drained')) {
    return responses.tired[Math.floor(Math.random() * responses.tired.length)];
  }

  return responses.default[Math.floor(Math.random() * responses.default.length)];
};

// DeepSeek API call function
const callDeepseek = async (conversation: ChatMessage[]): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined;
    if (!apiKey) {
      throw new Error('DeepSeek API key not found. Please set VITE_DEEPSEEK_API_KEY in your .env file');
    }

    // Prepare messages with English instructions
    const messagesPayload = [
      {
        role: 'system',
        content: `You are an empathetic emotional wellness companion named Bloom. Please follow these guidelines:
1. Provide supportive, compassionate responses to help users with their emotional wellbeing
2. Always be understanding, validating, and offer gentle guidance
3. Never give medical advice or diagnose conditions
4. Use natural, conversational English, like talking to a friend
5. Absolutely do not use any Markdown formatting (no **bold**, *italic*, # headers, - lists, etc.)
6. Use simple plain text format, expressing lists and emphasis in natural ways
7. Keep responses warm and human-like, as if a real person is speaking
8. If you need to list several suggestions, use natural language instead of numbered or bulleted lists
9. Write in clear, flowing English without any special formatting characters`
      },
      ...conversation
        .slice(-10) // Keep last 10 messages for context
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
    ];

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messagesPayload,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Extract the response content from DeepSeek's response
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response content received from DeepSeek API');
    }

    return content;
  } catch (err) {
    console.error('DeepSeek API call failed:', err);
    throw err;
  }
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  // 改进的自动滚动效果
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  const loadMessages = () => {
    const storedMessages = storage.getChatMessages();
    setMessages(storedMessages);

    if (storedMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hello! I'm here to listen and support you. This is a safe space where you can share your thoughts and feelings. How are you doing today?",
        timestamp: new Date().toISOString(),
      };
      storage.saveChatMessage(welcomeMessage);
      setMessages([welcomeMessage]);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = storage.saveChatMessage({
      role: 'user',
      content: inputValue.trim(),
    });

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let assistantText: string;

      // Check if DeepSeek API key is available
      const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined;
      
      if (deepseekApiKey) {
        // Use DeepSeek API
        assistantText = await callDeepseek([...messages, userMessage]);
      } else {
        // Fallback to local responses
        console.warn('DeepSeek API key not found. Using local response generator.');
        await new Promise((r) => setTimeout(r, 700 + Math.random() * 800));
        assistantText = generateBloomResponse(inputValue);
      }

      const assistantMessage = storage.saveChatMessage({
        role: 'assistant',
        content: assistantText,
      });
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      
      // Fallback to local response if API fails
      const fallbackResponse = generateBloomResponse(inputValue);
      const assistantMessage = storage.saveChatMessage({
        role: 'assistant',
        content: fallbackResponse,
      });
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    storage.clearChatHistory();
    loadMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emotional Support Chat</h1>
          <p className="text-muted-foreground mt-1">A compassionate AI companion for your thoughts</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your conversation history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearHistory}>Clear History</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 增加了对话框高度 - 从 h-[calc(100vh-16rem)] 改为 h-[calc(100vh-10rem)] */}
      <Card className="h-[calc(100vh-8rem)]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>MindBloom Companion</span>
              </CardTitle>
              <CardDescription>
                Your conversations are private and stored locally on your device
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {/* 调整了内容区域高度 - 从 h-[calc(100%-5rem)] 改为 h-[calc(100%-4rem)] */}
        <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                      }`}
                    >
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {/* 自动滚动锚点 */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Share what's on your mind..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!inputValue.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 mb-2 px-1">
              Press Enter to send • Powered by DeepSeek
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}