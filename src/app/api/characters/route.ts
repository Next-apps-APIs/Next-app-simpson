import { NextResponse } from 'next/server';

// Function to process image URLs from the API
const processImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Fix common URL issues
  if (url.startsWith('//')) {
    return `https:${url}`;
  } else if (!url.startsWith('http')) {
    return `https://api.sampleapis.com/simpsons/${url.replace(/^\//, '')}`;
  }
  
  return url;
};

export async function GET() {
  try {
    // Fetch characters from the Simpsons API
    const response = await fetch('https://api.sampleapis.com/simpsons/characters');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response format');
    }
    
    // Process and format the character data
    const characters = data.map((char: any) => ({
      id: char.id?.toString() || char._id || char.name?.replace(/\s+/g, '-').toLowerCase(),
      name: char.name || 'Unknown Character',
      image: processImageUrl(char.image || char.avatar || ''),
      quote: char.quote || char.catchPhrase || 'No quote available',
      job: char.job || char.occupation?.[0] || 'Unknown',
      // Include all other properties from the API
      ...char
    }));

    return NextResponse.json(characters, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS method for CORS preflight
// This is required for CORS to work in some browsers
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
