import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { request: userRequest, drawingHistory, context } = await request.json();

    // Prepare context for the AI based on drawing history
    const drawingContext = drawingHistory
      .slice(-10) // Last 10 drawing actions
      .map((item: any) => `${item.type}: ${JSON.stringify(item.content).substring(0, 100)}`)
      .join('\n');

    const systemPrompt = `You are an AI teaching assistant for a collaborative whiteboard used by researchers, students, and teachers. 

Context: Educational whiteboard session
Recent drawing activity:
${drawingContext}

Your role is to:
1. Analyze drawings and provide educational insights
2. Suggest improvements for clarity and understanding
3. Generate relevant questions and explanations
4. Help with mathematical concepts, diagrams, and visual learning
5. Provide constructive feedback suitable for academic environments

Respond in a helpful, encouraging tone appropriate for educational settings.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userRequest }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    // Generate educational suggestions based on the request
    const suggestions = generateEducationalSuggestions(userRequest, drawingHistory);

    return NextResponse.json({
      message: aiMessage,
      suggestions,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}

function generateEducationalSuggestions(request: string, drawingHistory: any[]) {
  const suggestions = [];

  // Analyze request type and provide relevant suggestions
  if (request.toLowerCase().includes('explain')) {
    suggestions.push({
      type: 'explanation',
      title: 'Add Labels',
      description: 'Consider adding text labels to clarify key components'
    });
  }

  if (request.toLowerCase().includes('improve')) {
    suggestions.push({
      type: 'improvement',
      title: 'Use Colors',
      description: 'Different colors can help distinguish between concepts'
    });
  }

  if (request.toLowerCase().includes('quiz')) {
    suggestions.push({
      type: 'assessment',
      title: 'Interactive Elements',
      description: 'Add interactive elements to test understanding'
    });
  }

  // Default educational suggestions
  suggestions.push({
    type: 'collaboration',
    title: 'Peer Review',
    description: 'Ask classmates to review and provide feedback'
  });

  return suggestions;
}