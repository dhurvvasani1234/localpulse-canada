import { NextRequest, NextResponse } from 'next/server';
import  { db } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    
    let discussions;
    if (city) {
      discussions = db.discussions.byCity(city);
    } else {
      discussions = db.discussions.all();
    }
    
    return NextResponse.json({ discussions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.comment || !body.city) {
      return NextResponse.json(
        { error: 'Name, comment, and city are required' },
        { status: 400 }
      );
    }
    
    const result = db.discussions.create(body);
    
    return NextResponse.json({
      message: 'Comment submitted for moderation',
      id: result.lastInsertRowid
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}