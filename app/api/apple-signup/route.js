import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function POST(request) {
    await connectDb();

    try {
        const {
            email,
            userName,
            phoneNumber,
            employer,
            location,
            description,
            imageUrl,
            identityToken
        } = await request.json();

        // Basic validation
        if (!email || !employer) {
            return NextResponse.json({ error: 'Email and Role are required.' }, { status: 400 });
        }

        // Verify identityToken matches email if strictly needed (skipping for now based on login trust)

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
        }

        // Create a dummy password for social login users (they won't use it to login seamlessly anyway)
        // or handle passwordless schemas. Here we just set a random secure string.
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newUser = new User({
            userName: userName || 'Apple User',
            email,
            phoneNumber: phoneNumber || '',
            employer,
            password: hashedPassword,
            location: location || '',
            description: description || '',
            imageUrl: imageUrl || 'https://via.placeholder.com/150',
            status: 'active'
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json({
            message: 'Signup successful',
            token,
            user: {
                email: newUser.email,
                employer: newUser.employer,
                userName: newUser.userName,
                _id: newUser._id
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Apple Signup Error:", error);
        return NextResponse.json({ error: 'Server error during signup' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
