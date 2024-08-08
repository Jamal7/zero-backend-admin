import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';

export async function POST(request) {
  await connectDb();
  
  try {
    const { userName, email, contact, password, skills } = await request.json();

    if (!userName || !email || !contact || !password || !skills) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const newUser = new User({ userName, email, contact, password, skills });
    await newUser.save();

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
