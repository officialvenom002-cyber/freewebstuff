import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect("https://t.me/+N7tYaUKT2q44NGU1", { status: 307 });
}
