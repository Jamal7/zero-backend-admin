import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
    await connectDb();
    try {
        const userId = request.nextUrl.searchParams.get("userId");
        if (!userId || userId === "undefined") {
            return NextResponse.json({ jobDetails: [] });
        }

        // Find all jobs posted by this employer that have shortlisted users
        // and populate the user details for each shortlisted user
        const jobs = await Job.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    usershortlist: { $exists: true, $not: { $size: 0 } }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "usershortlist",
                    foreignField: "_id",
                    as: "shortlistedUsers"
                }
            },
            {
                $project: {
                    jobTitle: 1,
                    price: 1,
                    location: 1,
                    description: 1,
                    status: 1,
                    imageUrl: 1,
                    "shortlistedUsers._id": 1,
                    "shortlistedUsers.userName": 1,
                    "shortlistedUsers.imageUrl": 1,
                    "shortlistedUsers.description": 1,
                    "shortlistedUsers.email": 1
                }
            }
        ]);

        // Flatten the data: one entry per user per job
        const flattenedData = [];
        for (const job of jobs) {
            for (const user of job.shortlistedUsers || []) {
                flattenedData.push({
                    jobId: job._id,
                    jobTitle: job.jobTitle,
                    jobPrice: job.price,
                    jobLocation: job.location,
                    jobDescription: job.description,
                    jobStatus: job.status,
                    jobImageUrl: job.imageUrl,
                    userId: user._id,
                    userName: user.userName || "Unknown User",
                    userImageUrl: user.imageUrl || null,
                    userDescription: user.description || "",
                    userEmail: user.email || ""
                });
            }
        }

        return NextResponse.json({ jobDetails: flattenedData });
    } catch (error) {
        console.error("Error fetching shortlisted jobs:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';

