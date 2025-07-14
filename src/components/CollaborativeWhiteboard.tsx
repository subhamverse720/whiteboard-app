'use client';

import { Stage, Layer, Line, Text, Rect } from 'react-konva';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Room, DataPacket_Kind, RemoteParticipant } from 'livekit-client';
import { useRoom, useParticipants } from '@livekit/components-react';
import AIAgent from './AIAgent';

interface DrawingLine {
  id: string;
  points: number[];
  color: string;
  strokeWidth: number;
  userId: string;
  timestamp: number;
}

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  userId: string;
  timestamp: number;
}

interface Cursor {
  userId: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export default function CollaborativeWhiteboard() {
  const room = useRoom();
  const participants = useParticipants();
  
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [cursors, setCursors] = useState<Map<string, Cursor>>(new Map());
  const [tool, setTool] = useState<'pen' | 'text' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(true);
  
  const stageRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize canvas to fit window
  useEffect(() => {
    const updateSize = () => {
      setDimensions({ 
        width: window.innerWidth - (showAI ? 320 : 0), 
        height: window.innerHeight - 100 
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [showAI]);

  // Handle real-time data from other participants
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant: RemoteParticipant) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        
        switch (data.type) {
          case 'drawing':
            setLines(prev => {
              const existing = prev.find(line => line.id === data.id);
              if (existing) {
                return prev.map(line => line.id === data.id ? data : line);
              }
              return [...prev, data];
            });
            break;
            
          case 'text':
            setTextElements(prev => {
              const existing = prev.find(text => text.id === data.id);
              if (existing) {
                return prev.map(text => text.id === data.id ? data : text);
              }
              return [...prev, data];
            });
            break;
            
          case 'cursor':
            setCursors(prev => {
              const newCursors = new Map(prev);
              newCursors.set(participant.identity, {
                userId: participant.identity,
                x: data.x,
                y: data.y,
                color: data.color || '#ff0000',
                name: participant.name || participant.identity
              });
              return newCursors;
            });
            break;
            
          case 'clear':
            setLines([]);
            setTextElements([]);
            break;

          case 'ai_response':
            setAiResponses(prev => [...prev.slice(-4), data.content]);
            break;
        }
      } catch (error) {
        console.error('Error processing received data:', error);
      }
    };

    room.on('dataReceived', handleDataReceived);
    
    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room]);

  const broadcastData = useCallback(async (data: any) => {
    if (!room) return;
    
    try {
      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(data)),
        DataPacket_Kind.RELIABLE
      );
    } catch (error) {
      console.error('Error broadcasting data:', error);
    }
  }, [room]);

  const handleMouseDown = (e: any) => {
    if (tool !== 'pen') return;
    
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    const newLine: DrawingLine = {
      id: `${Date.now()}-${Math.random()}`,
      points: [pos.x, pos.y],
      color,
      strokeWidth,
      userId: room?.localParticipant.identity || 'anonymous',
      timestamp: Date.now()
    };

    setLines(prev => [...prev, newLine]);
    broadcastData({ type: 'drawing', ...newLine });
  };

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    // Broadcast cursor position
    broadcastData({
      type: 'cursor',
      x: point.x,
      y: point.y,
      color
    });

    if (!isDrawing || tool !== 'pen') return;

    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    const updatedLine = {
      ...lastLine,
      points: [...lastLine.points, point.x, point.y],
    };

    setLines(prev => [...prev.slice(0, -1), updatedLine]);
    broadcastData({ type: 'drawing', ...updatedLine });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleStageClick = (e: any) => {
    if (tool !== 'text') return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    const text = prompt('Enter text:');
    if (!text) return;

    const newText: TextElement = {
      id: `text-${Date.now()}-${Math.random()}`,
      x: pos.x,
      y: pos.y,
      text,
      fontSize: 16,
      color,
      userId: room?.localParticipant.identity || 'anonymous',
      timestamp: Date.now()
    };

    setTextElements(prev => [...prev, newText]);
    broadcastData({ type: 'text', ...newText });
  };

  const handleClear = () => {
    setLines([]);
    setTextElements([]);
    broadcastData({ type: 'clear' });
  };

  const handleAIResponse = (response: string) => {
    setAiResponses(prev => [...prev.slice(-4), response]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`px-3 py-2 rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              ✏️ Pen
            </button>
            <button
              onClick={() => setTool('text')}
              className={`px-3 py-2 rounded ${tool === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              📝 Text
            </button>
          </div>
          
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-8 rounded cursor-pointer"
          />
          
          <input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-20"
          />
          
          <button
            onClick={handleClear}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
          
          <button
            onClick={() => setShowAI(!showAI)}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            {showAI ? 'Hide AI' : 'Show AI'}
          </button>
        </div>

        {/* Participants List */}
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3">
          <h4 className="font-semibold mb-2">Participants ({participants.length})</h4>
          {participants.map((participant) => (
            <div key={participant.identity} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">{participant.name || participant.identity}</span>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onClick={handleStageClick}
          className="bg-white"
        >
          <Layer>
            {/* Drawing Lines */}
            {lines.map((line) => (
              <Line
                key={line.id}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                lineCap="round"
                lineJoin="round"
              />
            ))}
            
            {/* Text Elements */}
            {textElements.map((textEl) => (
              <Text
                key={textEl.id}
                x={textEl.x}
                y={textEl.y}
                text={textEl.text}
                fontSize={textEl.fontSize}
                fill={textEl.color}
              />
            ))}
            
            {/* Other participants' cursors */}
            {Array.from(cursors.values()).map((cursor) => (
              <React.Fragment key={cursor.userId}>
                <Rect
                  x={cursor.x - 5}
                  y={cursor.y - 5}
                  width={10}
                  height={10}
                  fill={cursor.color}
                />
                <Text
                  x={cursor.x + 10}
                  y={cursor.y - 20}
                  text={cursor.name}
                  fontSize={12}
                  fill={cursor.color}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>

      {/* AI Assistant Panel */}
      {showAI && (
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          {room && (
            <AIAgent room={room} onAIResponse={handleAIResponse} />
          )}
          
          {/* AI Responses */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-gray-800">AI Insights</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {aiResponses.map((response, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-gray-700">{response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}