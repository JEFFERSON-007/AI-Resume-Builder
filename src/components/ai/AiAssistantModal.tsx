"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    X,
    BrainCircuit,
    TrendingUp,
    Search,
    MessageSquare,
    Loader2,
    Check,
    AlertCircle,
    KeyRound,
    Copy,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { executeAiPrompt, hasUserApiKey } from "@/lib/ai/gemini-client";
import { AI_PROMPTS } from "@/lib/ai-prompts";

export default function AiAssistantModal() {
    const isAiOpen = useResumeStore((state) => state.isAiOpen);
    const setAiOpen = useResumeStore((state) => state.setAiOpen);
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateSummary = useResumeStore((state) => state.updateSummary);
    const updateExperience = useResumeStore((state) => state.updateExperience);
    const setSettingsOpen = useResumeStore((state) => state.setSettingsOpen);
    const setJdModalOpen = useResumeStore((state) => state.setJdModalOpen);

    const [activeTab, setActiveTab] = useState<"summary" | "bullet" | "chat">("summary");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Summary state
    const [targetRole, setTargetRole] = useState(resumeData.personalInfo.jobTitle || "");
    const [experienceLevel, setExperienceLevel] = useState("mid-senior");
    const [generatedSummary, setGeneratedSummary] = useState("");

    // Bullet state
    const [selectedExpId, setSelectedExpId] = useState(resumeData.experience[0]?.id || "");
    const [originalBullet, setOriginalBullet] = useState("");
    const [bulletResults, setBulletResults] = useState<{
        variation1?: string;
        variation2?: string;
        recommendedActionVerb?: string;
    } | null>(null);

    // Chat state
    const [chatQuery, setChatQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([]);

    if (!isAiOpen) return null;

    const handleGenerateSummary = async () => {
        if (!targetRole.trim()) {
            setErrorMsg("Please provide a target role title.");
            return;
        }
        setIsLoading(true);
        setErrorMsg(null);

        const expContext = resumeData.experience
            .map((e) => `${e.position} at ${e.company}: ${e.description}`)
            .join(". ");

        const prompt = AI_PROMPTS.summary(targetRole, expContext, experienceLevel);
        const res = await executeAiPrompt({ prompt, type: "text" });

        if (res.success && res.result) {
            setGeneratedSummary(res.result.trim());
        } else {
            setErrorMsg(res.error || "Failed to generate summary.");
        }
        setIsLoading(false);
    };

    const handleImproveBullet = async () => {
        if (!originalBullet.trim()) {
            setErrorMsg("Please enter a bullet point to improve.");
            return;
        }
        setIsLoading(true);
        setErrorMsg(null);

        const prompt = AI_PROMPTS.improveBullet(originalBullet, resumeData.personalInfo.jobTitle);
        const res = await executeAiPrompt({ prompt, type: "json" });

        if (res.success && res.data) {
            setBulletResults(res.data);
        } else if (res.result) {
            setBulletResults({ variation1: res.result });
        } else {
            setErrorMsg(res.error || "Failed to improve bullet.");
        }
        setIsLoading(false);
    };

    const handleSendChat = async () => {
        if (!chatQuery.trim()) return;
        const query = chatQuery.trim();
        setChatQuery("");
        setChatHistory((prev) => [...prev, { role: "user", text: query }]);
        setIsLoading(true);
        setErrorMsg(null);

        const resumeOverview = `
Target Role: ${resumeData.personalInfo.jobTitle}
Skills: ${resumeData.skills.map((s) => s.name).join(", ")}
Experience count: ${resumeData.experience.length}
`;
        const prompt = AI_PROMPTS.careerChat(query, resumeOverview, resumeData.personalInfo.jobTitle);
        const res = await executeAiPrompt({ prompt, type: "text" });

        if (res.success && res.result) {
            setChatHistory((prev) => [...prev, { role: "assistant", text: res.result! }]);
        } else {
            setErrorMsg(res.error || "Failed to get AI response.");
        }
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">AI Career Assistant</h3>
                                <p className="text-xs text-slate-400">
                                    Truthful, non-hallucinatory resume enhancement powered by Gemini
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setAiOpen(false);
                                    setSettingsOpen(true);
                                }}
                                title="Configure API Key"
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
                            >
                                <KeyRound className="w-4 h-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </button>
                            <button
                                onClick={() => setAiOpen(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Feature Tabs */}
                    <div className="flex border-b border-slate-800 bg-slate-950/40 p-1 gap-1">
                        <button
                            onClick={() => {
                                setActiveTab("summary");
                                setErrorMsg(null);
                            }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === "summary"
                                ? "bg-slate-800 text-blue-400 shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <BrainCircuit className="w-3.5 h-3.5" />
                            Summary Generator
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("bullet");
                                setErrorMsg(null);
                            }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === "bullet"
                                ? "bg-slate-800 text-emerald-400 shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Bullet Point Improver
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("chat");
                                setErrorMsg(null);
                            }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === "chat"
                                ? "bg-slate-800 text-purple-400 shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Career Chat
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">{errorMsg}</p>
                                    {!hasUserApiKey() && (
                                        <button
                                            onClick={() => {
                                                setAiOpen(false);
                                                setSettingsOpen(true);
                                            }}
                                            className="underline text-[11px] text-blue-400 mt-1 block"
                                        >
                                            Provide your free Gemini API key in Settings →
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 1: SUMMARY */}
                        {activeTab === "summary" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                            Target Role
                                        </label>
                                        <input
                                            type="text"
                                            value={targetRole}
                                            onChange={(e) => setTargetRole(e.target.value)}
                                            placeholder="e.g. Senior Full Stack Engineer"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                            Experience Level
                                        </label>
                                        <select
                                            value={experienceLevel}
                                            onChange={(e) => setExperienceLevel(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="entry">Entry Level (0-2 years)</option>
                                            <option value="mid">Mid Level (3-5 years)</option>
                                            <option value="mid-senior">Senior (5-8 years)</option>
                                            <option value="lead-executive">Lead / Executive (8+ years)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerateSummary}
                                    disabled={isLoading || !targetRole.trim()}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating truthful summary...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Generate Professional Summary
                                        </>
                                    )}
                                </button>

                                {generatedSummary && (
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-300">Generated Summary</span>
                                            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                                                Truthful • ATS Friendly
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-200 leading-relaxed italic">
                                            "{generatedSummary}"
                                        </p>
                                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedSummary);
                                                    alert("Summary copied to clipboard!");
                                                }}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                                Copy
                                            </button>
                                            <button
                                                onClick={() => {
                                                    updateSummary(generatedSummary);
                                                    setAiOpen(false);
                                                }}
                                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                Apply to Resume
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: BULLET IMPROVER */}
                        {activeTab === "bullet" && (
                            <div className="space-y-4">
                                {resumeData.experience.length > 0 && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                            Select Experience to Pull From (Optional)
                                        </label>
                                        <select
                                            value={selectedExpId}
                                            onChange={(e) => {
                                                setSelectedExpId(e.target.value);
                                                const found = resumeData.experience.find((x) => x.id === e.target.value);
                                                if (found && found.description) {
                                                    setOriginalBullet(found.description);
                                                }
                                            }}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">-- Choose an experience entry --</option>
                                            {resumeData.experience.map((exp) => (
                                                <option key={exp.id} value={exp.id}>
                                                    {exp.position || "Untitled Position"} at {exp.company || "Company"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                        Original Bullet / Responsibility
                                    </label>
                                    <textarea
                                        value={originalBullet}
                                        onChange={(e) => setOriginalBullet(e.target.value)}
                                        placeholder="e.g. Worked on the website backend and made queries faster."
                                        rows={3}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        Transform into <strong>Action + Task + Technology + Result</strong>. No fabricated numbers.
                                    </p>
                                </div>

                                <button
                                    onClick={handleImproveBullet}
                                    disabled={isLoading || !originalBullet.trim()}
                                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Polishing bullet...
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="w-4 h-4" />
                                            Enhance Bullet Point
                                        </>
                                    )}
                                </button>

                                {bulletResults && (
                                    <div className="space-y-3 pt-2">
                                        {bulletResults.variation1 && (
                                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-slate-400">
                                                        Variation 1 (Direct & Concise)
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            if (selectedExpId) {
                                                                updateExperience(selectedExpId, {
                                                                    description: bulletResults.variation1,
                                                                });
                                                                setAiOpen(false);
                                                            } else {
                                                                navigator.clipboard.writeText(bulletResults.variation1!);
                                                                alert("Copied to clipboard!");
                                                            }
                                                        }}
                                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                                                    >
                                                        {selectedExpId ? "Apply to Experience" : "Copy"}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-200 leading-relaxed">
                                                    {bulletResults.variation1}
                                                </p>
                                            </div>
                                        )}

                                        {bulletResults.variation2 && (
                                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-slate-400">
                                                        Variation 2 (Architecture & Impact)
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            if (selectedExpId) {
                                                                updateExperience(selectedExpId, {
                                                                    description: bulletResults.variation2,
                                                                });
                                                                setAiOpen(false);
                                                            } else {
                                                                navigator.clipboard.writeText(bulletResults.variation2!);
                                                                alert("Copied to clipboard!");
                                                            }
                                                        }}
                                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                                                    >
                                                        {selectedExpId ? "Apply to Experience" : "Copy"}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-200 leading-relaxed">
                                                    {bulletResults.variation2}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: CAREER CHAT */}
                        {activeTab === "chat" && (
                            <div className="space-y-4">
                                <div className="min-h-[160px] max-h-[260px] overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                                    {chatHistory.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 space-y-2">
                                            <MessageSquare className="w-6 h-6 mx-auto opacity-40" />
                                            <p className="text-xs">Ask anything about your resume:</p>
                                            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                                                {[
                                                    "Improve my summary",
                                                    "What skills am I missing?",
                                                    "Make bullets more impactful",
                                                ].map((q, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setChatQuery(q)}
                                                        className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 hover:bg-slate-700 transition-colors"
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        chatHistory.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-xl text-xs leading-relaxed ${item.role === "user"
                                                    ? "bg-blue-600/20 text-blue-200 ml-6 border border-blue-500/20"
                                                    : "bg-slate-800/70 text-slate-200 mr-6 border border-slate-700/50 whitespace-pre-line"
                                                    }`}
                                            >
                                                <span className="text-[10px] font-bold block mb-1 uppercase tracking-wider opacity-60">
                                                    {item.role === "user" ? "You" : "AI Mentor"}
                                                </span>
                                                {item.text}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={chatQuery}
                                        onChange={(e) => setChatQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendChat();
                                            }
                                        }}
                                        placeholder="Ask a question about your resume or role..."
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={handleSendChat}
                                        disabled={isLoading || !chatQuery.trim()}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 px-6">
                        <span>Zero data retention • AI will never fabricate qualifications</span>
                        <button
                            onClick={() => {
                                setAiOpen(false);
                                setJdModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Open ATS Job Matcher →
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
