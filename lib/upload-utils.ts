// lib/upload-utils.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'events');
const PUBLIC_URL_PREFIX = '/uploads/events';

// Ensure upload directory exists
export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// Handle file upload
export async function uploadEventImage(file: File): Promise<string> {
  ensureUploadDir();
  
  // Generate unique filename
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Save file
  fs.writeFileSync(filePath, buffer);
  
  // Return public URL
  return `${PUBLIC_URL_PREFIX}/${fileName}`;
}

// Delete uploaded image
export function deleteEventImage(imageUrl: string): void {
  if (imageUrl.startsWith(PUBLIC_URL_PREFIX)) {
    const fileName = imageUrl.split('/').pop();
    const filePath = path.join(UPLOAD_DIR, fileName || '');
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}