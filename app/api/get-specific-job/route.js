import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust path as necessary
import Job from '../../lib/mongo/schema/jobSchema';

export default async function GET(request) {
    await connectDb(); // Ensure DB is connected

    try {
        // Get the jobId from the query parameters
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (jobId) {
            // Fetch a specific job by jobId
            const job = await Job.findById(jobId);
            if (!job) {
                return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
            }
            return NextResponse.json(job, { status: 200 });
        } else {
            // Fetch all jobs if no jobId is provided
            const jobs = await Job.find();
            return NextResponse.json(jobs, { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
