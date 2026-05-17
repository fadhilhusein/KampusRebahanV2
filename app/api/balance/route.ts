import { NextResponse } from "next/server";
import { warungApi } from "@/lib/api";

export async function GET() {
  try {
    const data = await warungApi.getBalance();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: String(err) },
      { status: 500 }
    );
  }
}
