import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/db/store";

export async function GET() {
  const categories = getCategoriesWithCounts();
  return NextResponse.json({ categories });
}
