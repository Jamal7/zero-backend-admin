import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import User from "@/app/lib/mongo/schema/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request) {
    await connectDb();
    try {
        const body = await request.json()
        const {userId, jobId} = body;
        await User.updateOne(
            {_id:userId},
            {$push: { jobshortlist: jobId}}
        )
        await Job.updateOne(
            {_id:jobId},
            {$push: { usershortlist: userId}}
        )
        const updateuser = await Job.findById({_id: jobId})
        return new Response (updateuser)
    } catch (error) {
        return NextResponse.json({error: error})
    }
}