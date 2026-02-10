import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
    await connectDb();
    try {
        const { id } = await params;

        if (!id || id === "undefined") {
            return NextResponse.json({ jobs: [] });
        }

        const jobs = await Job.find({
            user: new mongoose.Types.ObjectId(id)
        });

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error("Error fetching jobs by user ID:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
