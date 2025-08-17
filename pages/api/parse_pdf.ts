import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { parsePdf } from "./lib/pdf-utils";

// Disable Next.js body parsing (since formidable handles it)
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10 MB

        const [fields, files] = await form.parse(req).catch((err) => {
            throw new Error(`Failed to parse form: ${err}`);
        });

        const file = (files.file?.[0] ?? files.file) as File;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Validate extension/type
        const fileName = file.originalFilename || "uploaded.pdf";
        if (!fileName.toLowerCase().endsWith(".pdf")) {
            return res.status(400).json({ error: "Uploaded file must be a PDF." });
        }

        const filePath = file.filepath; // formidable v2/v3 difference
        const buffer = fs.readFileSync(filePath);

        // Parse PDF to text
        const text = await parsePdf(buffer);
        if (!text || !text.trim()) {
            return res
                .status(422)
                .json({ error: "Failed to extract text from PDF." });
        }

        return res.status(200).json({
            file_name: fileName,
            mime_type: file.mimetype || "application/pdf",
            size: file.size,
            textContent: text,
        });
    } catch (err: unknown) {
        console.error("Error processing PDF upload:", err);
        return res.status(500).json({
            error: "Internal server error.",
            detail: err instanceof Error ? err.message : String(err),
        });
    }
}
