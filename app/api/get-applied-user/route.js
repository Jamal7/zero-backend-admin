import { connectDb } from "@/app/lib/mongo/conectDB";
import User from "@/app/lib/mongo/schema/userSchema";
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDb();
    try {
        const users = await User.find({"employer" : {$ne: "employer"}});
        const data = JSON.stringify(users)
        return new Response(data);
    } catch (error) {
    return NextResponse.json({message: "error"});
    }
    
}