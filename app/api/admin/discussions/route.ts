import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/database-server';

export async function GET(request: NextRequest) {
  try {
    const discussions = db.discussions.all();
    const pending = db.discussions.pending();
    return NextResponse.json({ discussions, pending });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();
    
    if (action === 'approve') {
      db.discussions.approve(body.id);
      return NextResponse.json({ success: true });
    } else if (action === 'delete') {
      db.discussions.delete(body.id);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update discussion' },
      { status: 500 }
    );
  }
}