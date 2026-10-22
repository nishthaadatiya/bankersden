import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  try {
    const { mediaId } = params;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!mediaId) {
      return NextResponse.json({ error: 'Missing media ID' }, { status: 400 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'WhatsApp token not configured' }, { status: 500 });
    }

    // Step 1: Query Meta to retrieve download URL and mime type
    const metaInfoRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!metaInfoRes.ok) {
      const errData = await metaInfoRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to retrieve media metadata from Meta', details: errData },
        { status: metaInfoRes.status }
      );
    }

    const mediaInfo = await metaInfoRes.json();
    const downloadUrl = mediaInfo.url;
    const mimeType = mediaInfo.mime_type || 'application/octet-stream';

    if (!downloadUrl) {
      return NextResponse.json({ error: 'No download URL returned by Meta' }, { status: 404 });
    }

    // Step 2: Download binary data from Meta lookaside URL
    const binaryRes = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'curl/7.64.1',
      },
    });

    if (!binaryRes.ok) {
      return NextResponse.json(
        { error: 'Failed to download binary media from Meta CDN' },
        { status: binaryRes.status }
      );
    }

    const arrayBuffer = await binaryRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error proxying WhatsApp media:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
