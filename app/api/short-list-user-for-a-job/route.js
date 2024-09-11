import { NextRequest, NextResponse } from "next/server";
import Job from "@/app/lib/mongo/schema/jobSchema"
import User from "@/app/lib/mongo/schema/userSchema"
import { connectDb } from "@/app/lib/mongo/conectDB";
import mongoose from "mongoose";

export async function POST(request) {
    await connectDb();
    try {
        const body = await request.json();
const data = await User.aggregate([
    {
$match: {_id: new mongoose.Types.ObjectId(body.UserId)}
    },
    {
        $lookup: {
            from: "jobs",
            localField: "jobIds",
            foreignField: "_id",
            pipeline: [
                {
                    $lookup: {
                        from: "users",
                        localField: "usershortlist",
                        foreignField: "_id",
                        as: "short_list",
                    },
                },
            ],
           as: "upload_jobs",
        }
    },
    {
        $project: {
            userName: 1, "upload_jobs.jobTitle": 1, "upload_jobs.short_list.userName": 1
        }
    }
])

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({error: error.message})
    }
}

export const dynamic = 'force-dynamic';