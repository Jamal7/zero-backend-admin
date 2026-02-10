import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";
import bcrypt from 'bcrypt';

export async function GET(request) {
    await connectDb();

    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required query parameters." },
                { status: 400 }
            );
        }

        console.log(`Checking credentials for: ${email}`);

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Check if user has a password set
        if (!user.password) {
            return NextResponse.json({
                success: false,
                message: "User exists but has no password set"
            }, { status: 400 });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            return NextResponse.json({
                success: true,
                message: "Credentials valid",
                user: {
                    id: user._id,
                    userName: user.userName,
                    email: user.email,
                    role: user.employer // assuming 'employer' field or similar holds role info based on previous context
                }
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid password"
            }, { status: 401 });
        }

    } catch (error) {
        console.error("Error checking credentials:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
