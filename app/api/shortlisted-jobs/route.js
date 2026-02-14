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
                $unwind: "$usershortlist"
            },
            {
                $addFields: {
                    userShortlistId: { $toObjectId: "$usershortlist" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userShortlistId",
                    foreignField: "_id",
                    as: "shortlistedUsers"
                }
            },
            {
                $unwind: {
                    path: "$shortlistedUsers",
                    preserveNullAndEmptyArrays: true
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
                    "shortlistedUsers.email": 1,
                    userShortlistId: 1 // Keep this to debug if user lookup failed
                }
            }
        ]);

        // console.log("Jobs with shortlisted users:", JSON.stringify(jobs, null, 2));

        // Flatten the data: one entry per user per job
        const flattenedData = [];
        for (const job of jobs) {
            // If shortlistedUsers exists, use it. If not, fallback to the ID we preserved
            const user = job.shortlistedUsers || {};

            // If we have a user record OR we have a shortlist ID but no user record (deleted user?)
            // We want to show something rather than nothing to debug
            if (user._id || job.userShortlistId) {
                flattenedData.push({
                    jobId: job._id,
                    jobTitle: job.jobTitle,
                    jobPrice: job.price,
                    jobLocation: job.location,
                    jobDescription: job.description,
                    jobStatus: job.status,
                    jobImageUrl: job.imageUrl,
                    userId: user._id || job.userShortlistId, // Fallback to the raw ID
                    userName: user.userName || "Unknown/Deleted User",
                    userImageUrl: user.imageUrl || null,
                    userDescription: user.description || "User details not found",
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

