import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    await connectDb();

    try {
        const { identityToken, authorizationCode } = await request.json();

        if (!identityToken) {
            return NextResponse.json({ error: 'Identity Token is required.' }, { status: 400 });
        }

        // Decode the identity token to get the user's email and sub (unique Apple ID)
        // Note: In production, you should verify the token signature with Apple's public keys.
        // Here we are decoding it for the email claim.
        const decodedToken = jwt.decode(identityToken);

        if (!decodedToken || !decodedToken.email) {
            return NextResponse.json({ error: 'Invalid Identity Token' }, { status: 401 });
        }

        const email = decodedToken.email;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            // User not found - Frontend handles this by redirecting to socialAdditionDetails
            return NextResponse.json({
                message: 'User not found',
                userExists: false,
                email
            }, { status: 200 }); // Status 200 because it's a valid check, just no user found
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and user information
        return NextResponse.json({
            message: 'Login successful',
            token,
            userExists: true,
            user: {
                email: user.email,
                employer: user.employer,
                userName: user.userName,
                _id: user._id
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Apple Login Error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
