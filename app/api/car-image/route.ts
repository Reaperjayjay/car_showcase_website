import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');
  const model = searchParams.get('model');
  const year = searchParams.get('year');
  const view = searchParams.get('view');

  //  Target the signing endpoint, not the image endpoint directly
  const signUrl = new URL('https://carimagesapi.com/api/v1/signed-url');

  if (make) signUrl.searchParams.append('make', make);
  if (model) signUrl.searchParams.append('model', model);
  if (year) signUrl.searchParams.append('year', year);
  if (view) signUrl.searchParams.append('view', view);

  //  Pass both the KEY and the SECRET to bypass domain checks
  signUrl.searchParams.append('api_key', process.env.CAR_IMAGES_KEY || '');
  signUrl.searchParams.append('api_secret', process.env.CAR_IMAGES_SECRET || '');

  try {
    //  Get the pre-signed URL JSON from the API
    const signResponse = await fetch(signUrl.toString());

    if (!signResponse.ok) {
      const errorText = await signResponse.text();
      console.error(`Signing Failed (${signResponse.status}):`, errorText);
      return new NextResponse(`Signing Error: ${signResponse.status}`, { status: signResponse.status });
    }

    const signData = await signResponse.json();

    if (!signData.url) {
      return new NextResponse('No signed URL returned', { status: 500 });
    }

    // Fetch the actual image using the new, fully authenticated URL
    const imageResponse = await fetch(signData.url);

    if (!imageResponse.ok) {
      return new NextResponse(`Image Fetch Error: ${imageResponse.status}`, { status: imageResponse.status });
    }

    // Stream the binary pixels back to the Next.js frontend
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Server Crash:', error);
    return new NextResponse('Server Error', { status: 500 });
  }
}