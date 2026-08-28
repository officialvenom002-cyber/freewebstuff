import { NextRequest, NextResponse } from "next/server";
import { recordResourceClick } from "@/lib/db/store";


export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  recordResourceClick(params.slug);
  return NextResponse.json({ success: true });
}
