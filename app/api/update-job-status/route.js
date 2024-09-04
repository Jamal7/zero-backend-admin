import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import Job from '@/app/lib/mongo/schema/jobSchema';

export async function POST(request) {
  await connectDb();
  
  try {
    const body = await request.json();
    const {jobId, status} = body;

    if (!jobId || !status) {
      return NextResponse.json({ error: 'JobId and status are required.' }, { status: 400 });
    }

    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    job.status = status;
    await job.save();

    return NextResponse.json({ message: 'Status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
