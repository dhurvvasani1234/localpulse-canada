// app/api/newsletter/route.ts - Add email sending
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if already subscribed
    const existing = db.newsletter.all().find(s => s.email === body.email);
    if (existing) {
      return NextResponse.json({
        message: 'You are already subscribed to our newsletter',
        subscriber: existing
      });
    }
    
    // Create new subscriber
    const newSubscriber = {
      id: Date.now(),
      email: body.email,
      city: body.city,
      language: body.language || 'en',
      subscribed_at: new Date().toISOString()
    };
    
    // Save to database (simplified version)
    const subscribers = db.newsletter.all();
    subscribers.push(newSubscriber);
    
    // Send welcome email (optional - you can comment this out if no Resend API key)
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          data: {
            email: body.email,
            city: body.city,
            language: body.language || 'en'
          }
        })
      });
    } catch (emailError) {
      console.log('Email sending optional - continuing without it');
    }
    
    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
      subscriber: newSubscriber
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}