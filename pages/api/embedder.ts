import { NextResponse } from "next/server";

interface IngestionPayload {
    metadata: {
        fileName: string;
        policyName: string;
        policyProvider: string;
    };
    chunks: Array<{
        text: string;
        embedding: number[];
    }>;
}

export async function POST(req: Request) {
    try {
        const payload: IngestionPayload = await req.json();

        // Validate the payload
        if (!payload.metadata || !payload.chunks || payload.chunks.length === 0) {
            return NextResponse.json(
                { error: "Invalid ingestion payload" },
                { status: 400 }
            );
        }

        // Here you would typically process the ingestion, e.g., store it in a database
        console.log("Ingestion payload received:", payload);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing ingestion:", error);
        return NextResponse.json(
            { error: "Failed to process ingestion" },
            { status: 500 }
        );
    }
}
