import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    await connectDb();

    try {
        const { token, email: providedEmail } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
        }

        // Verify the token with Google to get the email securely
        // We try the userinfo endpoint which accepts access_token
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let verifiedEmail = null;

        if (googleResponse.ok) {
            const googleData = await googleResponse.json();
            verifiedEmail = googleData.email;
        } else {
            // Fallback: If the token is an ID token (JWT), we might need a different endpoint 
            // or just trust the email if we can't verify (NOT RECOMMENDED).
            // For now, let's assume the frontend sends a valid access token.
            // If it fails, we return unauthorized.

            // Actually, frontend might be sending idToken. Let's try tokeninfo?
            const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
            if (tokenInfoResponse.ok) {
                const tokenInfo = await tokenInfoResponse.json();
                verifiedEmail = tokenInfo.email;
            }
        }

        if (!verifiedEmail) {
            return NextResponse.json({ error: 'Invalid Google Token' }, { status: 401 });
        }

        // Find the user by verified email
        const user = await User.findOne({ email: verifiedEmail });

        if (!user) {
            // User not found - Frontend handles this by redirecting to signup/additional details
            // mimicking the Apple login response structure: { userExists: false }
            return NextResponse.json({
                message: 'User not found',
                userExists: false,
                email: verifiedEmail
            }, { status: 404 });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and user information
        return NextResponse.json({
            message: 'Login successful',
            token: jwtToken,
            userExists: true,
            user: {
                email: user.email,
                employer: user.employer,
                // Add other fields if needed by storeUserData
                userName: user.userName,
                _id: user._id
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Google Login Error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
