import { NextResponse } from "next/server";

export async function GET(request) {
    // Return a JSON response with a status code of 200
    return NextResponse.json({ message: 'Server is working' }, { status: 200 });
}
