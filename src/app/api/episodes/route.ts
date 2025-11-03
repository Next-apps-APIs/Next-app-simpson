import { NextResponse } from 'next/server';
import { API_BASE_URL, API_PATHS } from '@/utils/constants';

export async function GET() {
  try {
    // Try SampleAPIs first
    let res = await fetch('https://api.sampleapis.com/simpsons/episodes', { cache: 'no-store' });
    if (!res.ok) {
      // Fallback to constants-based API if present
      const fallbackUrl = `${API_BASE_URL}${API_PATHS.EPISODES}`;
      res = await fetch(fallbackUrl, { cache: 'no-store' });
    }
    if (!res.ok) {
      throw new Error(`Episodes API failed with status ${res.status}`);
    }

    const data = await res.json();
    const episodes = Array.isArray(data) ? data : [];

    return NextResponse.json(episodes, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
