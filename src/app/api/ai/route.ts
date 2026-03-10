import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, type } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const modelsToTry = [
            "gemini-1.5-flash",           // Extremely fast, best for summaries/bullets
            "gemini-1.5-pro",             // More capable, slightly slower fallback
        ];

        let result;
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[AI] Attempting ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                // Add a basic timeout using Promise.race if needed, but Gemini Flash is usually < 2s
                result = await model.generateContent(prompt);

                if (result) {
                    console.log(`[AI] Success with ${modelName}`);
                    break;
                }
            } catch (err: any) {
                console.warn(`[AI] ${modelName} failed:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            console.error("All Gemini models failed:", lastError);
            throw lastError || new Error("All AI models are currently unavailable.");
        }

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });
    } catch (error: any) {
        console.error("AI Route Error:", error);

        // Handle Rate Limits (429) gracefully
        if (error.message?.includes("429") || error.status === 429) {
            return NextResponse.json({
                error: "The AI is currently taking a short breather (Rate limit reached). Please wait about 60 seconds and try again! ☕"
            }, { status: 429 });
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
