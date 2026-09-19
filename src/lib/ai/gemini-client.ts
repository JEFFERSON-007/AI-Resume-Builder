import { GoogleGenerativeAI } from "@google/generative-ai";

const STORAGE_KEY = "ai_resume_builder_user_api_key";
const promptCache = new Map<string, string>();

export function getUserApiKey(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || "";
}

export function setUserApiKey(key: string): void {
    if (typeof window === "undefined") return;
    if (!key.trim()) {
        localStorage.removeItem(STORAGE_KEY);
    } else {
        localStorage.setItem(STORAGE_KEY, key.trim());
    }
}

export function hasUserApiKey(): boolean {
    return Boolean(getUserApiKey());
}

export interface AiRequestOptions {
    prompt: string;
    type?: "text" | "json";
    temperature?: number;
}

export interface AiResponse {
    success: boolean;
    result?: string;
    data?: any;
    error?: string;
    isRateLimit?: boolean;
    isDemoFallback?: boolean;
}

const MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
];

export async function executeAiPrompt({
    prompt,
    type = "text",
    temperature = 0.4,
}: AiRequestOptions): Promise<AiResponse> {
    const cacheKey = `${type}:${prompt.trim()}`;
    if (promptCache.has(cacheKey)) {
        const cached = promptCache.get(cacheKey)!;
        return {
            success: true,
            result: cached,
            data: type === "json" ? safeParseJson(cached) : undefined,
        };
    }

    const userKey = getUserApiKey();

    // 1. Direct browser API call if user has configured their Gemini key (Bring-Your-Own-Key)
    if (userKey) {
        try {
            const genAI = new GoogleGenerativeAI(userKey);
            let responseText = "";

            for (const modelName of MODELS) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            temperature,
                            maxOutputTokens: 2048,
                        },
                    });

                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    responseText = response.text();
                    if (responseText) break;
                } catch (err: any) {
                    console.warn(`[AI-BYOK] Model ${modelName} failed:`, err.message);
                    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key not valid")) {
                        return {
                            success: false,
                            error: "Your Gemini API key appears to be invalid. Please check your key in Settings.",
                        };
                    }
                }
            }

            if (!responseText) {
                return {
                    success: false,
                    error: "Unable to generate content with the provided API key. Check quota or try again in a moment.",
                };
            }

            promptCache.set(cacheKey, responseText);
            return {
                success: true,
                result: responseText,
                data: type === "json" ? safeParseJson(responseText) : undefined,
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message || "Failed to contact Gemini API directly.",
            };
        }
    }

    // 2. Server proxy attempt (Next.js server-side route)
    try {
        const res = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, type }),
        });

        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data.result) {
                promptCache.set(cacheKey, data.result);
                return {
                    success: true,
                    result: data.result,
                    data: type === "json" ? safeParseJson(data.result) : undefined,
                };
            }
            if (data.error) {
                return {
                    success: false,
                    error: data.error,
                    isRateLimit: res.status === 429,
                };
            }
        }
    } catch (err) {
        // Network or server error
    }

    // 3. Graceful offline-first fallback if neither server proxy nor user key is active
    return {
        success: false,
        error: "No Gemini API key is configured. You can use your own free Gemini API key in Settings (stored only in your browser), or continue using the full resume builder offline!",
        isDemoFallback: true,
    };
}

export function safeParseJson(text: string): any {
    try {
        // Find outer-most curly braces or square brackets
        const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        const cleaned = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(cleaned);
    } catch (err) {
        return null;
    }
}
