import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import Job from '../../lib/mongo/schema/jobSchema';
import User from '../../lib/mongo/schema/userSchema';

export async function GET() {
    await connectDb();

    try {

        const jobs = await Job.find({ status: 'active' }).populate({
            path: 'user',
            model: User,
            select: 'userName imageUrl',
        });

        const jobsWithUserName = jobs.map(job => ({
            ...job.toObject(),
            userName: job.user ? job.user.userName : 'Unknown',
            employerImage: job.user ? job.user.imageUrl : null,
        }));

        return NextResponse.json(jobsWithUserName, { status: 200 });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
