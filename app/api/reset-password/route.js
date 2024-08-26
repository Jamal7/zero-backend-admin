// File: /app/api/reset-password/route.js
import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import bcrypt from 'bcrypt';

export async function POST(request) {
  await connectDb();

  try {
    const { email, resetCode, newPassword } = await request.json();

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User with this email does not exist.' }, { status: 404 });
    }

    if (user.resetCode !== resetCode || user.resetCodeExpiry < Date.now()) {
      return NextResponse.json({ error: 'Invalid or expired reset code.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and remove the reset code
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error during password reset:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
