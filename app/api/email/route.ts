import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import NewsletterWelcome from '../../../emails/NewsletterWelcome';
import EventNotification from '../../../emails/EventNotification';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
      );
    }

    let emailResponse;

    switch (type) {
      case 'welcome':
        emailResponse = await resend.emails.send({
          from: 'LocalPulse Canada <onboarding@resend.dev>',
          to: [data.email],
          subject: data.language === 'en' 
            ? 'Welcome to LocalPulse Canada!' 
            : 'Bienvenue à LocalPulse Canada!',
          react: NewsletterWelcome({
            userEmail: data.email,
            city: data.city,
            language: data.language || 'en'
          }),
        });
        break;

      case 'event-digest':
        emailResponse = await resend.emails.send({
          from: 'LocalPulse Canada <events@resend.dev>',
          to: data.emails,
          subject: data.language === 'en'
            ? `This Week's Events in ${data.city}`
            : `Événements de cette semaine à ${data.city}`,
          react: EventNotification({
            userName: data.userName,
            events: data.events,
            city: data.city,
            language: data.language || 'en'
          }),
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: emailResponse
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}