import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import Contact from '../../lib/mongo/schema/contactSechema';

export async function POST(request) {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',  // Allow any origin
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight request (OPTIONS)
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders, status: 200 });
  }

  await connectDb();

  try {
    const { firstName, lastName, email, phone } = await request.json();
    
    // Validation check
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    // Save the contact data to MongoDB
    const newContact = new Contact({ firstName, lastName, email, phone });
    const savedContact = await newContact.save();

    // Respond with success
    return NextResponse.json({ message: 'Contact saved successfully', contact: savedContact }, { 
      status: 201, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}
