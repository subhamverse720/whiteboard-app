'use client';

import dynamic from 'next/dynamic';

const Whiteboard = dynamic(() => import('@/components/Whiteboard'), {
  ssr: false, // disables server-side rendering
});

export default function Home() {
  return (
    <main style={{ textAlign: 'center', paddingTop: '20px' }}>
      <h1>React-Konva Whiteboard</h1>
      <Whiteboard />
    </main>
  );
}
