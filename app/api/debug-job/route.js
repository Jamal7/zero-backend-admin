import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connectDb();
    const id = request.nextUrl.searchParams.get("id");
    const userId = request.nextUrl.searchParams.get("userid");

    if (userId) {
        const jobs = await Job.find({ user: userId });
        return NextResponse.json(jobs);
    }

    if (!id) return NextResponse.json({ error: "No ID or UserID" });

    const job = await Job.findById(id);
    return NextResponse.json(job);
}
export const dynamic = 'force-dynamic';
