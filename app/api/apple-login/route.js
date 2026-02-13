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
        console.log("Apple Login - Decoded Token:", JSON.stringify(decodedToken));

        if (!decodedToken || !decodedToken.email) {
            console.log("Apple Login - No email in token");
            return NextResponse.json({ error: 'Invalid Identity Token - No Email found' }, { status: 401 });
        }

        const appleId = decodedToken.sub;
        const email = decodedToken.email;
        console.log("Apple Login - Extracted Email:", email);
        console.log("Apple Login - Extracted Apple ID:", appleId);

        // 1. Try to find user by Apple ID (Primary method)
        let user = await User.findOne({ appleId });

        if (!user) {
            console.log("Apple Login - User not found by Apple ID. Checking by email...");
            // 2. Fallback: Try to find by email (Legacy users)
            if (email) {
                user = await User.findOne({ email });

                if (user) {
                    // 3. If found by email, update the user with Apple ID for future logins
                    console.log("Apple Login - User found by email. Updating with Apple ID.");
                    user.appleId = appleId;
                    await user.save();
                }
            }
        }

        if (!user) {
            // User not found - Frontend handles this by redirecting to socialAdditionDetails
            return NextResponse.json({
                message: 'User not found',
                userExists: false,
                email,
                appleId
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
