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

        // Decode the identity token to get the user's email and sub (unique Apple ID)
        const decodedToken = jwt.decode(identityToken);
        const appleId = decodedToken.sub;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { appleId: appleId }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                // Same email — re-link the (possibly stale) appleId and log them in
                existingUser.appleId = appleId;
                await existingUser.save();
                const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return NextResponse.json({
                    message: 'Account linked and login successful',
                    token,
                    user: {
                        email: existingUser.email,
                        employer: existingUser.employer,
                        userName: existingUser.userName,
                        _id: existingUser._id
                    }
                }, { status: 200 });
            }
            // Found by appleId but email doesn't match — reject
            return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
        }

        // Create a dummy password for social login users (they won't use it to login seamlessly anyway)
        // or handle passwordless schemas. Here we just set a random secure string.
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newUser = new User({
            userName: userName || 'Apple User',
            email,
            appleId, // Save the Apple ID
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
