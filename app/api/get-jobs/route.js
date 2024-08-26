// File: /app/api/get-jobs/route.js
import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust path as necessary
import Job from '../../lib/mongo/schema/jobSchema';

export async function GET() {
    await connectDb();

    try {
        const jobs = await Job.find().populate('user'); // Populate user data if needed
        return NextResponse.json(jobs, { status: 200 });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
