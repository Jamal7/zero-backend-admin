import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
    await connectDb();
    try {
        const { id } = await params;

        if (!id || id === "undefined") {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }

        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
