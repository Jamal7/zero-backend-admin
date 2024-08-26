import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust path as necessary
import Job from '../../lib/mongo/schema/jobSchema';
import User from '../../lib/mongo/schema/userSchema';

export async function POST(request) {
    await connectDb();

    try {
        const { jobTitle, price, description, status, imageUrl, videoUrl, location, userId } = await request.json();
    
        // Check if all required fields are provided
        if (!jobTitle || !price || !description || !location || !userId) {
          return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
        }
    
        // Validate that the user exists
        const user = await User.findById(userId);
        if (!user) {
          return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
    
        // Create a new job
        const newJob = new Job({
          jobTitle,
          price,
          description,
          status: status || 'pending',
          imageUrl: imageUrl || 'null',
          videoUrl: videoUrl || 'null',
          location,
          user: user._id,
        });
    
        // Save the job to the database
        const savedJob = await newJob.save();
    
        // Ensure jobIds array exists and add the new job ID
        if (!user.jobIds) {
          user.jobIds = [];
        }
        user.jobIds.push(savedJob._id);
        await user.save();
    
        return NextResponse.json({ message: 'Job created successfully', job: savedJob }, { status: 201 });
      } catch (error) {
        console.error('Error during job creation:', error);
    
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
      }
    }
    
    export const dynamic = 'force-dynamic';