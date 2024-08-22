import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function POST(request) {
  await connectDb();

  try {
    const { userName,email, phoneNumber, employer, password, confirmPassword } = await request.json();

    console.log('Received data:', { userName,email, phoneNumber, employer, password, confirmPassword });

    // Check if all fields are provided
    if (!userName || !email || !phoneNumber || !employer || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    // Validate phone number (e.g., must be 10-14 digits)
    const phoneRegex = /^[0-9]{10,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ error: 'Invalid phone number. Must be 10-14 digits.' }, { status: 400 });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({ userName, email, phoneNumber, employer, password: hashedPassword });
    
    console.log('Saving new user:', newUser);

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User created successfully, token generated:', token);

    return NextResponse.json({ message: 'User created successfully', token, user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error during user creation:', error);

    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic'
