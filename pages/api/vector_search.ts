// app/api/vector-search/route.js (or .ts if using TypeScript)
import { NextResponse } from 'next/server';
import { getDb } from './lib/mongodb';

export async function POST(req) {
    try {
        const body = await req.json();
        const { embedding } = body;

        if (!embedding || !Array.isArray(embedding)) {
            return NextResponse.json(
                { error: 'Missing or invalid embedding array' },
                { status: 400 }
            );
        }

        const db = await getDb();
        const topMatches = await db.collection('documents').aggregate([
            {
                $vectorSearch: {
                    index: 'vector_index', // MongoDB vector search index name
                    path: 'embedding',     // field in documents containing embeddings
                    queryVector: embedding,
                    numCandidates: 100,
                    limit: 5,
                },
            },
        ]).toArray();

        return NextResponse.json({ matches: topMatches });
    } catch (err) {
        console.error('Vector search error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
