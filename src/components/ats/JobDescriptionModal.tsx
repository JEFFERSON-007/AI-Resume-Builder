"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, AlertCircle, Search, Target, BookOpen, Loader2 } from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { evaluateJobDescriptionMatch } from "@/lib/ats/ats-analyzer";
import { executeAiPrompt } from "@/lib/ai/gemini-client";
import { AI_PROMPTS } from "@/lib/ai-prompts";

export default function JobDescriptionModal() {
    const isJdModalOpen = useResumeStore((state) => state.isJdModalOpen);
    const setJdModalOpen = useResumeStore((state) => state.setJdModalOpen);
    const resumeData = useResumeStore((state) => state.resumeData);
    const targetJobDescription = useResumeStore((state) => state.targetJobDescription);
    const setTargetJobDescription = useResumeStore((state) => state.setTargetJobDescription);

    const [jdText, setJdText] = useState(targetJobDescription || "");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const localMatch = jdText.trim() ? evaluateJobDescriptionMatch(resumeData, jdText) : null;

    const handleAnalyze = async () => {
        if (!jdText.trim()) return;
        setTargetJobDescription(jdText);
        setIsAnalyzing(true);
        setAiError(null);

        try {
            const prompt = AI_PROMPTS.atsMatch(
                JSON.stringify({
                    jobTitle: resumeData.personalInfo.jobTitle,
                    skills: resumeData.skills.map((s) => s.name),
                    experience: resumeData.experience.map((e) => `${e.position} at ${e.company}: ${e.description}`),
                    summary: resumeData.summary,
                }),
                jdText
            );

            const res = await executeAiPrompt({ prompt, type: "json" });
            if (res.success && res.data) {
                setAiInsights(res.data);
            } else if (res.error) {
                setAiError(res.error);
            }
        } catch (err: any) {
            setAiError(err.message || "Failed to analyze job description with AI.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!isJdModalOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Target Job Description & ATS Matching</h3>
                                <p className="text-xs text-slate-400">
                                    Analyze keywords, skills alignment, and ethical resume optimization
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setJdModalOpen(false)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                        {/* Textarea Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Paste Target Job Description (JD)
                            </label>
                            <textarea
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                placeholder="Paste the job posting requirements, required technologies, responsibilities..."
                                rows={5}
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[11px] text-slate-500">
                                    {jdText.length} characters • Privacy: analyzed locally / via your configured key
                                </span>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!jdText.trim() || isAnalyzing}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Analyzing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Run Deep ATS Match
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {aiError && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">AI Service Notice</p>
                                    <p className="text-[11px] opacity-90">{aiError}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Local keyword heuristic analysis below is active and does not require AI.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Local Keyword Analysis Cards */}
                        {localMatch && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                        <span className="text-[11px] text-slate-500 font-medium uppercase block mb-1">
                                            Keyword Coverage
                                        </span>
                                        <span className="text-2xl font-black text-blue-400">
                                            {localMatch.coveragePercentage}%
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1">Top JD terms matched</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                        <span className="text-[11px] text-slate-500 font-medium uppercase block mb-1">
                                            Found in Resume
                                        </span>
                                        <span className="text-2xl font-black text-emerald-400">
                                            {localMatch.foundKeywords.length}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1">Keywords detected</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                        <span className="text-[11px] text-slate-500 font-medium uppercase block mb-1">
                                            Missing Keywords
                                        </span>
                                        <span className="text-2xl font-black text-amber-400">
                                            {localMatch.missingKeywords.length}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1">Potential gaps</p>
                                    </div>
                                </div>

                                {/* Found vs Missing Badges */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-2">
                                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Matched Keywords ({localMatch.foundKeywords.length})</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {localMatch.foundKeywords.map((kw, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[11px] border border-emerald-500/20"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Missing Keywords ({localMatch.missingKeywords.length})</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {localMatch.missingKeywords.map((kw, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-blue-300 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 shrink-0" />
                                    <span>
                                        <strong>Recruiter Tip:</strong> Only incorporate missing keywords that you genuinely
                                        know or have worked with. Never fabricate skills to game ATS systems.
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Deep AI Match Results */}
                        {aiInsights && (
                            <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                        <h4 className="text-sm font-bold text-white">AI ATS Deep Analysis</h4>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                                        Estimated Match: {aiInsights.estimatedScore ?? 75}%
                                    </span>
                                </div>

                                {aiInsights.summaryAssessment && (
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        {aiInsights.summaryAssessment}
                                    </p>
                                )}

                                {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                                    <div>
                                        <h5 className="text-xs font-semibold text-slate-300 mb-2">
                                            Recommended Tailoring (Truthful):
                                        </h5>
                                        <ul className="space-y-1.5 text-xs text-slate-300">
                                            {aiInsights.recommendations.map((rec: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-blue-400 font-bold">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setTargetJobDescription(jdText);
                                setJdModalOpen(false);
                            }}
                            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
                        >
                            Save & Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
