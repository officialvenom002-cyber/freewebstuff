import { NextRequest, NextResponse } from "next/server";
import { createReport, getAllReports, updateReportStatus, getAllSubmissions, updateSubmissionStatus, createResource } from "@/lib/db/store";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceId, resourceName, reason, details, reporterEmail } = body;

    if (!resourceId || !resourceName || !reason || !details) {
      return NextResponse.json(
        { error: "Missing required fields for reporting." },
        { status: 400 }
      );
    }

    const report = createReport({
      resourceId,
      resourceName,
      reason,
      details,
      reporterEmail,
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
