// File: /app/api/request-password-reset/route.js
import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { sendEmail } from '../../lib/utils/nodemailer';

export async function POST(request) {
  await connectDb();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User with this email does not exist.' }, { status: 404 });
    }

    const resetCode = crypto.randomBytes(4).toString('hex'); // Generate a 4-byte hex code

    // Save the reset code to the user document
    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + 3600000; // Code expires in 1 hour
    await user.save();

    // Prepare the email content
    const subject = 'Password Reset Code';
    const text = `Your password reset code is: ${resetCode}. This code will expire in 1 hour.`;
    const html = `<p>Your password reset code is: <strong>${resetCode}</strong>. This code will expire in 1 hour.</p>`;

    // Send an email with the reset code using the sendEmail function
    await sendEmail({
      to: email,
      subject: subject,
      text: text,
      html: html
    });

    return NextResponse.json({ message: 'Password reset code sent to email.' }, { status: 200 });
  } catch (error) {
    console.error('Error during password reset request:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
