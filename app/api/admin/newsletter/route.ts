import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/database-server';

export async function GET(request: NextRequest) {
  try {
    const subscribers = db.newsletter.all();
    return NextResponse.json({ subscribers });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    db.newsletter.unsubscribe(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}