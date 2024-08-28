// // File: /app/api/get-jobs/route.js
// import { NextResponse } from 'next/server';
// import { connectDb } from '../../lib/mongo/conectDB'; // Adjust path as necessary
// import Job from '../../lib/mongo/schema/jobSchema';
// import User from '../../lib/mongo/schema/userSchema'; // Import User schema

// export async function GET() {
//     await connectDb(); // Ensure DB is connected

//     try {
//         const jobs = await Job.find().populate('user'); // Populate user data
//         return NextResponse.json(jobs, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching jobs:', error);
//         return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
//     }
// }
// // 
// export const dynamic = 'force-dynamic';


// File: /app/api/get-jobs/route.js
import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust path as necessary
import Job from '../../lib/mongo/schema/jobSchema';
import User from '../../lib/mongo/schema/userSchema';

export async function GET() {
    await connectDb(); // Ensure DB is connected

    try {
        // Fetch jobs and populate the userId field with the userName from the User collection
        const jobs = await Job.find().populate({
            path: 'user', // Assuming your Job schema has a userId field
            select: 'userName', // Only select the userName field from the User model
        });

        // Map the jobs to include userName in the top-level structure
        const jobsWithUserName = jobs.map(job => ({
            ...job.toObject(), // Convert the mongoose document to a plain object
            userName: job.userId ? job.userId.userName : 'Unknown', // Handle cases where userId might be null
        }));

        return NextResponse.json(jobsWithUserName, { status: 200 });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
