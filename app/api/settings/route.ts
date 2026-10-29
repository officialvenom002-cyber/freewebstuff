import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 86400;

export async function GET() {
  return NextResponse.json(
    { donationPageEnabled: true },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'Cloudflare-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}
