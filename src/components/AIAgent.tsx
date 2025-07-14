'use client';

import { useEffect, useState } from 'react';
import { Room, DataPacket_Kind } from 'livekit-client';

interface AIAgentProps {
  room: Room;
  onAIResponse: (response: string) => void;
}

interface DrawingData {
  type: 'drawing' | 'text' | 'shape';
  content: any;
  timestamp: number;
  userId: string;
}

export default function AIAgent({ room, onAIResponse }: AIAgentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState<DrawingData[]>([]);

  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array, participant: any) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        
        if (data.type === 'ai_request') {
          handleAIRequest(data);
        } else if (data.type === 'drawing_data') {
          setDrawingHistory(prev => [...prev, data]);
        }
      } catch (error) {
        console.error('Error processing data:', error);
      }
    };

    room.on('dataReceived', handleDataReceived);
    
    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room]);

  const handleAIRequest = async (request: any) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: request.content,
          drawingHistory,
          context: 'educational_whiteboard'
        })
      });

      const aiResponse = await response.json();
      
      // Send AI response back to all participants
      const responseData = {
        type: 'ai_response',
        content: aiResponse.message,
        suggestions: aiResponse.suggestions,
        timestamp: Date.now()
      };

      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(responseData)),
        DataPacket_Kind.RELIABLE
      );

      onAIResponse(aiResponse.message);
    } catch (error) {
      console.error('AI processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const requestAIHelp = async (query: string) => {
    const requestData = {
      type: 'ai_request',
      content: query,
      timestamp: Date.now()
    };

    await room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(requestData)),
      DataPacket_Kind.RELIABLE
    );
  };

  return (
    <div className="ai-agent-panel bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">AI Teaching Assistant</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={() => requestAIHelp('Explain what I just drew')}
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          Analyze Drawing
        </button>
        
        <button
          onClick={() => requestAIHelp('Suggest improvements to this diagram')}
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
        >
          Get Suggestions
        </button>
        
        <button
          onClick={() => requestAIHelp('Generate quiz questions based on this content')}
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
        >
          Create Quiz
        </button>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">AI is thinking...</span>
        </div>
      )}
    </div>
  );
}