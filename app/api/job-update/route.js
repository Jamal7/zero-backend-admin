import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import Job from '../../lib/mongo/schema/jobSchema';

export async function POST(request) {
    await connectDb();

    try {
        const { jobId, jobTitle, price, description, location, imageUrl } = await request.json();

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
        }

        const updatedData = {
            jobTitle,
            price,
            description,
            location,
            imageUrl: imageUrl || undefined,
        };

        // Remove undefined fields
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: updatedData },
            { new: true }
        );

        if (!updatedJob) {
            return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Job updated successfully', job: updatedJob }, { status: 200 });
    } catch (error) {
        console.error('Error during job update:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
