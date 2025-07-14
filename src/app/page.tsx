'use client'; //landing Page
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RoomContext } from '@livekit/components-react';
import { Room } from 'livekit-client';

const Whiteboard = dynamic(() => import('@/components/Whiteboard'), {
  ssr: false, // disables server-side rendering
});


export default function Home() {
   
   const [room] = useState(() => new Room({}));
  
  // You can manage room connection lifecycle here
  useEffect(() => {
    room.connect('your-server-url', 'your-token');
    return () => {
      room.disconnect();
    };
  }, [room]);

  return (
    <RoomContext.Provider value={room}>

    <main style={{ textAlign: 'center', paddingTop: '20px' }}>
      <h1>React-Konva Whiteboard</h1>
      <Whiteboard />
    </main>
    </RoomContext.Provider>
    
  );
}
