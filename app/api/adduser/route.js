import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await connectDb();

  try {
    const { email, phoneNumber, employer, password, confirmPassword } = await request.json();
    console.log('Received data:', { email, phoneNumber, employer, password, confirmPassword });


    // Log the input data
    console.log('Received data:', { email, phoneNumber, employer, password, confirmPassword });

    // Check if all fields are provided
    if (!email || !phoneNumber || !employer || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({ email, phoneNumber, employer, password: hashedPassword });
    
    // Log the user before saving
    console.log('Saving new user:', newUser);

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User created successfully, token generated:', token);

    return NextResponse.json({ message: 'User created successfully', token }, { status: 201 });
  } catch (error) {
    // Log any errors
    console.error('Error during user creation:', error);

    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
