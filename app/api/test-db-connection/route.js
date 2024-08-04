import { NextRequest, NextResponse } from 'next/server';
import { connectDb, disconnectDb } from '../../lib/mongo/conectDB';
import printStatement from '../../lib/apiCommonUtils/printStatement';

// GET request handler
export async function GET(req) {
  try {
    await connectDb();
    printStatement('DB Connected Successfully');
    await disconnectDb();
    return NextResponse.json({ message: 'DB Connected Successfully' });
  } catch (error) {
    printStatement('Error Connecting DB', error);
    return NextResponse.json({ message: 'Error Connecting DB', error: error.message }, { status: 500 });
  }
}