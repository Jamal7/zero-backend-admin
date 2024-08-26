import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';

export async function POST(request) {
  await connectDb();

  try {
    const { userId, status } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ error: 'User ID and status are required.' }, { status: 400 });
    }

    const validStatuses = ['active', 'inactive', 'hired'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    user.status = status;
    await user.save();

    return NextResponse.json({ message: 'Status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
