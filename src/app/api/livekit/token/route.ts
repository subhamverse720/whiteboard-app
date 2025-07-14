import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/livekit';
import { getServerSession } from 'next-auth';
import { authoptions } from '../../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authoptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomName } = await request.json();
    
    if (!roomName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    const token = generateToken(roomName, session.user.email || session.user.id);
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}