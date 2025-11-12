export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const generateAIResponse = async (
  userMessage: string,
  model: string = 'claude',
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const apiUrl = `${supabaseUrl}/functions/v1/ai-chat`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        model,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      console.error('Edge function error:', response.statusText);
      return generateFallbackResponse(userMessage);
    }

    const data = await response.json();
    return data.response || generateFallbackResponse(userMessage);
  } catch (error) {
    console.error('Error calling AI service:', error);
    return generateFallbackResponse(userMessage);
  }
};

function generateFallbackResponse(userMessage: string): string {
  const lowercaseMessage = userMessage.toLowerCase();

  if (lowercaseMessage.includes('anxious') || lowercaseMessage.includes('anxiety')) {
    return "I hear that you're feeling anxious. That's a completely valid emotion. Let's take a moment together - can you tell me what's weighing on your mind right now? Sometimes naming our worries helps us see them more clearly.";
  }

  if (lowercaseMessage.includes('sad') || lowercaseMessage.includes('down') || lowercaseMessage.includes('depressed')) {
    return "Thank you for sharing that you're feeling down. It takes courage to acknowledge these feelings. Remember that it's okay not to be okay sometimes. What's one small thing that has brought you even a tiny bit of comfort today?";
  }

  if (lowercaseMessage.includes('stressed') || lowercaseMessage.includes('overwhelmed')) {
    return "It sounds like you're carrying a lot right now. When we feel overwhelmed, it can help to break things down into smaller pieces. What feels most urgent to you at this moment? Let's explore it together, one step at a time.";
  }

  if (lowercaseMessage.includes('happy') || lowercaseMessage.includes('good') || lowercaseMessage.includes('great')) {
    return "I'm so glad to hear you're feeling positive! It's wonderful to celebrate these moments. What's contributing to this good feeling? Recognizing what brings us joy helps us create more of it in our lives.";
  }

  if (lowercaseMessage.includes('tired') || lowercaseMessage.includes('exhausted')) {
    return "Fatigue can weigh heavily on us, both physically and emotionally. Have you been able to rest adequately lately? Remember that taking time to recharge isn't selfish - it's essential for your wellbeing.";
  }

  if (lowercaseMessage.includes('angry') || lowercaseMessage.includes('frustrated')) {
    return "Anger and frustration are natural responses when things feel unfair or difficult. These feelings are telling you something important. What situation is triggering these emotions for you? Let's explore what's beneath the surface.";
  }

  if (lowercaseMessage.includes('lonely') || lowercaseMessage.includes('alone')) {
    return "Loneliness can feel very heavy. I want you to know that you're not alone in feeling this way, and I'm here with you right now. Have you been able to connect with anyone recently, even in small ways? Sometimes even brief connections can help.";
  }

  const responses = [
    "I'm listening. Tell me more about what you're experiencing right now.",
    "That sounds like it's really affecting you. How long have you been feeling this way?",
    "Thank you for sharing that with me. What do you think you need most in this moment?",
    "I hear you. Your feelings are valid, and it's important that you're acknowledging them. What would help you feel even slightly better right now?",
    "It takes strength to express how you're feeling. What's one thing you've learned about yourself recently?",
    "I appreciate you opening up. How are you taking care of yourself today?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
