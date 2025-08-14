// src/app/api/upload-pdf/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { parsePdf } from './lib/pdf-utils';

// Force Node runtime so Buffer/PDF.js work (not Edge)
export const runtime = 'nodejs';
// If your route may be hit frequently and reads request body, keep it dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }

        // Basic validation
        const contentType = file.type || '';
        if (!/pdf/i.test(contentType) && !file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ error: 'Uploaded file must be a PDF.' }, { status: 400 });
        }

        // (Optional) size guard: ~10 MB
        const MAX_BYTES = 10 * 1024 * 1024;
        if (typeof file.size === 'number' && file.size > MAX_BYTES) {
            return NextResponse.json({ error: 'PDF too large. Max 10 MB.' }, { status: 413 });
        }

        // Read into a Node Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1) Parse PDF -> text (server-side, no worker)
        const text = await parsePdf(buffer);
        if (!text || !text.trim()) {
            return NextResponse.json({ error: 'Failed to extract text from PDF.' }, { status: 422 });
        }

        return NextResponse.json({
            file_name: file.name,
            mime_type: file.type || 'application/pdf',
            size: file.size,
            textContent: text,
        });

    } catch (err: unknown) {
        console.error('Error processing PDF upload:', err);
        return NextResponse.json(
            { error: 'Internal server error.', detail: err instanceof Error ? err.message : String(err) },
            { status: 500 },
        );
    }
}
