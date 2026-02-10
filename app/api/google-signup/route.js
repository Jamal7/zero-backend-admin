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
            idToken // Google token
        } = await request.json();

        // Basic validation
        if (!email || !employer) {
            return NextResponse.json({ error: 'Email and Role are required.' }, { status: 400 });
        }

        // Verify the token with Google to ensure the email is valid
        // We try the userinfo endpoint which accepts access_token
        let verifiedEmail = null;
        if (idToken) {
            const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            if (googleResponse.ok) {
                const googleData = await googleResponse.json();
                verifiedEmail = googleData.email;
            } else {
                // Fallback to tokeninfo if it's an ID token
                const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
                if (tokenInfoResponse.ok) {
                    const tokenInfo = await tokenInfoResponse.json();
                    verifiedEmail = tokenInfo.email;
                }
            }
        }

        // If idToken was provided, we MUST verify it matches the email
        if (idToken && (!verifiedEmail || verifiedEmail !== email)) {
            return NextResponse.json({ error: 'Invalid Google Token or Email mismatch.' }, { status: 401 });
        }


        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
        }

        // Create a dummy password for social login users
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newUser = new User({
            userName: userName || 'Google User',
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
        console.error("Google Signup Error:", error);
        return NextResponse.json({ error: 'Server error during signup' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
