// app/api/admin/events/route.ts
"use server";

import { NextResponse } from 'next/server';
import db from '../../lib/database';
import { uploadEventImage } from '../../lib/upload-utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title_en = formData.get('title_en') as string;
    const title_fr = formData.get('title_fr') as string;
    const description_en = formData.get('description_en') as string;
    const description_fr = formData.get('description_fr') as string;
    const city = formData.get('city') as string;
    const category = formData.get('category') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const is_featured = formData.get('is_featured') === 'on';
    const imageFile = formData.get('image') as File;
    
    let image_url = '';
    
    // Handle image upload if file exists
    if (imageFile && imageFile.size > 0) {
      image_url = await uploadEventImage(imageFile);
    }
    
    // Create event in database
    const result = db.events.create({
      title_en,
      title_fr,
      description_en,
      description_fr,
      city,
      category,
      date,
      time,
      location,
      image_url,
      is_featured: is_featured ? 1 : 0
    });
    
    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid 
    });
    
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}