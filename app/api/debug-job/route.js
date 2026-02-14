import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connectDb();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No ID" });

    const job = await Job.findById(id);
    return NextResponse.json(job);
}
export const dynamic = 'force-dynamic';
