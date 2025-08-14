// src/app/api/upload-pdf/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getDb } from './lib/mongodb';

// Force Node runtime so Buffer/PDF.js work (not Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file_name = formData.get('file_name')
        const mime_type = formData.get('mime_type')
        const size = formData.get('size')
        const textContent = formData.get('textContent')
        console.log('Received file:', file_name);
        //console.log('Received text content:', textContent);

        // Insert into MongoDB
        const db = await getDb();
        const result = await db.collection('documents').insertOne({
            fileName: file_name,
            mimeType: mime_type || 'application/pdf',
            size: size,
            textContent: textContent,
            uploadedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            documentId: result.insertedId,
            message: `Document "${file_name}" stored in MongoDB.`,
        });

    } catch (err: unknown) {
        console.error('Error processing PDF upload:', err);
        return NextResponse.json(
            { error: 'Internal server error.', detail: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        );
    }
}

