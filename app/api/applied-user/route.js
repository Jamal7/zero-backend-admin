import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import User from "@/app/lib/mongo/schema/userSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request) {
    await connectDb();
    try {
        const body = await request.json()
        const {userId, jobId} = body;
         const works = await Job.find({_id: jobId, userapplied:{$in: userId}})
        if(works.length > 0) {
            return new Response( works);
        } else {
            await User.updateOne(
                {_id:userId},
                {$push: { jobapllied: jobId}}
            )
            await Job.updateOne(
                {_id:jobId},
                {$push: { userapplied: userId}}
            )
            const updateuser = await Job.findById({_id: jobId})
            return new Response (updateuser)
        } 
    }
        catch (error) {
            return NextResponse.json({error: error})
        }
}