'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Room } from 'livekit-client';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useSession } from 'next-auth/react';
import CollaborativeWhiteboard from '@/components/CollaborativeWhiteboard';
import { LIVEKIT_WS_URL } from '@/lib/livekit';

export default function WhiteboardRoom() {
  const { roomId } = useParams();
  const { data: session } = useSession();
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user || !roomId) return;

    const getToken = async () => {
      try {
        const response = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName: roomId })
        });

        const data = await response.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (error) {
        console.error('Failed to get token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getToken();
  }, [session, roomId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to whiteboard...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to connect to whiteboard</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <LiveKitRoom
        video={false}
        audio={false}
        token={token}
        serverUrl={LIVEKIT_WS_URL}
        data-lk-theme="default"
        style={{ height: '100vh' }}
        onConnected={() => console.log('Connected to room:', roomId)}
        onDisconnected={() => console.log('Disconnected from room')}
      >
        <CollaborativeWhiteboard />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}