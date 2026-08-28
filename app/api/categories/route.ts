import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/db/store";

export const runtime = "edge";

export async function GET() {
  const categories = getCategoriesWithCounts();
  return NextResponse.json({ categories });
}
