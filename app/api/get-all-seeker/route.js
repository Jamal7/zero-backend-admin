import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/mongo/schema/userSchema";
import { connectDb } from "@/app/lib/mongo/conectDB";


export async function  GET() {
await connectDb();
try {
    const allSeeker = await User.find({employer: "seeker"})
    return NextResponse.json({User: allSeeker}, {status: 200})
} catch (error) {
    return NextResponse.json({Error: error}).status(404)
}
}

export const dynamic = 'force-dynamic';
