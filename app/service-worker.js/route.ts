import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const swCode = `self.options = {
    "domain": "5gvci.com",
    "zoneId": 11890817
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')
`;

export async function GET() {
  return new NextResponse(swCode, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST() {
  return new NextResponse(swCode, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
