import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("audio") as File;
        if (!file) return NextResponse.json({ error: "No audio file provided" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const audioPart = {
            inlineData: { data: buffer.toString("base64"), mimeType: file.type },
        };

        const result = await model.generateContent([
            "Provide an exact transcription of the spoken words in this audio. Output ONLY the transcribed text.",
            audioPart
        ]);

        const transcriptRecord = await prisma.transcript.create({
            data: { text: result.response.text() },
        });

        return NextResponse.json({ success: true, transcript: transcriptRecord });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }
}