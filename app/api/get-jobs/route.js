import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import Job from '../../lib/mongo/schema/jobSchema';
import User from '../../lib/mongo/schema/userSchema';

export async function GET() {
    await connectDb();

    try {
       
        const jobs = await Job.find().populate({
            path: 'user',
            model: User, 
            select: 'userName', 
        });

        const jobsWithUserName = jobs.map(job => ({
            ...job.toObject(),
            userName: job.user ? job.user.userName : 'Unknown',
        }));

        return NextResponse.json(jobsWithUserName, { status: 200 });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
