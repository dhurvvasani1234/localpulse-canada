import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const discussions = db.discussions.all();
    const pending = db.discussions.pending();
    
    return NextResponse.json({ 
      discussions, 
      pending,
      count: discussions.length,
      pendingCount: pending.length
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
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
    
    if (!action || !body.id) {
      return NextResponse.json(
        { error: 'Action and ID are required' },
        { status: 400 }
      );
    }
    
    if (action === 'approve') {
      const success = db.discussions.approve(body.id);
      return NextResponse.json({ 
        success,
        message: success ? 'Comment approved' : 'Comment not found'
      });
    } else if (action === 'delete') {
      const success = db.discussions.delete(body.id);
      return NextResponse.json({ 
        success,
        message: success ? 'Comment deleted' : 'Comment not found'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to update discussion' },
      { status: 500 }
    );
  }
}