import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title_en: 'Toronto Waterfront Cleanup',
    title_fr: 'Nettoyage du front de mer de Toronto',
    description_en: 'Join us for a community cleanup at Toronto Waterfront.',
    description_fr: 'Rejoignez-nous pour un nettoyage communautaire.',
    city: 'toronto',
    category: 'community',
    date: '2024-03-15',
    time: '10:00 AM',
    location: 'Harbourfront Centre',
    is_featured: true
  },
  {
    id: 2,
    title_en: 'Montreal Jazz Festival',
    title_fr: 'Festival de Jazz de Montréal',
    description_en: 'Experience the world-renowned Montreal Jazz Festival.',
    description_fr: 'Découvrez le Festival de Jazz de Montréal.',
    city: 'montreal',
    category: 'arts',
    date: '2024-06-28',
    time: '6:00 PM',
    location: 'Quartier des Spectacles',
    is_featured: true
  }
  // Add more mock events as needed
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch from your database
    // For now, return mock data
    return NextResponse.json({ events: mockEvents });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would delete from database
    console.log(`Would delete event with ID: ${id}`);
    
    return NextResponse.json({ 
      success: true,
      message: `Event ${id} deleted successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real app, you would save to database
    console.log('Creating new event:', body);
    
    return NextResponse.json({ 
      success: true,
      message: 'Event created successfully',
      event: { id: Date.now(), ...body }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}