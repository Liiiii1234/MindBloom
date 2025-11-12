import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  message: string;
  model: string;
  conversationHistory?: { role: string; content: string }[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, model, conversationHistory = [] }: RequestPayload = await req.json();

    // Default fallback response if no API is configured
    let aiResponse: string;

    if (model === 'claude') {
      const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

      if (!anthropicApiKey) {
        aiResponse = generateDefaultResponse(message);
      } else {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: 'You are MindBloom, a compassionate AI wellness companion. Provide empathetic, supportive responses focused on mental health and emotional wellbeing. Be encouraging and helpful without providing medical diagnoses.',
            messages: [
              ...conversationHistory.map((msg) => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
              })),
              { role: 'user', content: message },
            ],
          }),
        });

        if (!response.ok) {
          console.error('Anthropic API error:', response.statusText);
          aiResponse = generateDefaultResponse(message);
        } else {
          const data = await response.json();
          aiResponse = data.content[0]?.text || generateDefaultResponse(message);
        }
      }
    } else if (model === 'openai') {
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

      if (!openaiApiKey) {
        aiResponse = generateDefaultResponse(message);
      } else {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are MindBloom, a compassionate AI wellness companion. Provide empathetic, supportive responses focused on mental health and emotional wellbeing. Be encouraging and helpful without providing medical diagnoses.',
              },
              ...conversationHistory.map((msg) => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
              })),
              { role: 'user', content: message },
            ],
            max_tokens: 1024,
          }),
        });

        if (!response.ok) {
          console.error('OpenAI API error:', response.statusText);
          aiResponse = generateDefaultResponse(message);
        } else {
          const data = await response.json();
          aiResponse = data.choices[0]?.message?.content || generateDefaultResponse(message);
        }
      }
    } else {
      aiResponse = generateDefaultResponse(message);
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        model: model,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        response: generateDefaultResponse(''),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function generateDefaultResponse(message: string): string {
  const lowercaseMessage = message.toLowerCase();

  if (lowercaseMessage.includes('anxious') || lowercaseMessage.includes('anxiety')) {
    return 'I hear that you\'re feeling anxious. That\'s a completely valid emotion. Let\'s take a moment together - can you tell me what\'s weighing on your mind right now? Sometimes naming our worries helps us see them more clearly.';
  }

  if (lowercaseMessage.includes('sad') || lowercaseMessage.includes('down') || lowercaseMessage.includes('depressed')) {
    return 'Thank you for sharing that you\'re feeling down. It takes courage to acknowledge these feelings. Remember that it\'s okay not to be okay sometimes. What\'s one small thing that has brought you even a tiny bit of comfort today?';
  }

  if (lowercaseMessage.includes('stressed') || lowercaseMessage.includes('overwhelmed')) {
    return 'It sounds like you\'re carrying a lot right now. When we feel overwhelmed, it can help to break things down into smaller pieces. What feels most urgent to you at this moment? Let\'s explore it together, one step at a time.';
  }

  if (lowercaseMessage.includes('happy') || lowercaseMessage.includes('good') || lowercaseMessage.includes('great')) {
    return 'I\'m so glad to hear you\'re feeling positive! It\'s wonderful to celebrate these moments. What\'s contributing to this good feeling? Recognizing what brings us joy helps us create more of it in our lives.';
  }

  if (lowercaseMessage.includes('tired') || lowercaseMessage.includes('exhausted')) {
    return 'Fatigue can weigh heavily on us, both physically and emotionally. Have you been able to rest adequately lately? Remember that taking time to recharge isn\'t selfish - it\'s essential for your wellbeing.';
  }

  if (lowercaseMessage.includes('angry') || lowercaseMessage.includes('frustrated')) {
    return 'Anger and frustration are natural responses when things feel unfair or difficult. These feelings are telling you something important. What situation is triggering these emotions for you? Let\'s explore what\'s beneath the surface.';
  }

  if (lowercaseMessage.includes('lonely') || lowercaseMessage.includes('alone')) {
    return 'Loneliness can feel very heavy. I want you to know that you\'re not alone in feeling this way, and I\'m here with you right now. Have you been able to connect with anyone recently, even in small ways? Sometimes even brief connections can help.';
  }

  const responses = [
    'I\'m listening. Tell me more about what you\'re experiencing right now.',
    'That sounds like it\'s really affecting you. How long have you been feeling this way?',
    'Thank you for sharing that with me. What do you think you need most in this moment?',
    'I hear you. Your feelings are valid, and it\'s important that you\'re acknowledging them. What would help you feel even slightly better right now?',
    'It takes strength to express how you\'re feeling. What\'s one thing you\'ve learned about yourself recently?',
    'I appreciate you opening up. How are you taking care of yourself today?',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
