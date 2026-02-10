import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
    await connectDb();
    try {
        // Handling dynamic route if /api/job-by-id/[id]
        // But index.tsx uses /api/job-by-id/${userId}
        // Next.js App Router might need the folder to be [id]/route.js
        // Given the URL structure in index.tsx, we need to handle it.

        // For now, let's assume it might be a query param or a path param.
        // If it's used as /api/job-by-id/123, then [id]/route.js is better.
        // If it's /api/job-by-id?userId=123, then searchParams is better.

        // index.tsx: `${apiBaseUrl}/api/job-by-id/${user.userId || user._id}`
        // This is a path parameter. We need a folder named [id].

        return NextResponse.json({ error: "Use path /api/job-by-id/[id]" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
