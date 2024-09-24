import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import Contact from '../../lib/mongo/schema/contactSechema';

export async function POST(request) {
  await connectDb();

  // Set CORS headers
  const res = NextResponse.next({
    headers: {
      'Access-Control-Allow-Origin': '*',  // Allow any origin
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });

  // Handle preflight request (OPTIONS)
  if (request.method === 'OPTIONS') {
    return res; // Respond with 200 for preflight
  }

  try {
    const { firstName, lastName, email, phone } = await request.json();
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    const newContact = new Contact({ firstName, lastName, email, phone });
    const savedContact = await newContact.save();

    return NextResponse.json({ message: 'Contact saved successfully', contact: savedContact }, { status: 201 });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}