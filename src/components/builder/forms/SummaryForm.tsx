"use client";

import { useResumeStore } from "@/lib/store";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function SummaryForm() {
    const summary = useResumeStore((state) => state.resumeData.summary);
    const jobTitle = useResumeStore((state) => state.resumeData.personalInfo.jobTitle);
    const updateSummary = useResumeStore((state) => state.updateSummary);
    const setAiOpen = useResumeStore((state) => state.setAiOpen);

    const words = summary ? summary.trim().split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const isOptimal = wordCount >= 35 && wordCount <= 90;

    return (
        <div className="space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" /> Professional Summary
                    </h3>
                    <p className="text-xs text-slate-400">
                        3-4 concise sentences highlighting core technical strengths and impact
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setAiOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl hover:bg-blue-500/20 transition-all shadow-sm"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Assistant
                </button>
            </div>

            <div className="relative">
                <textarea
                    value={summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="e.g. Results-driven Senior Full Stack Engineer with 7+ years of experience architecting high-throughput distributed microservices and scalable web applications..."
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between mt-2 text-[11px]">
                    <div className="flex items-center gap-2">
                        <span
                            className={`font-semibold ${isOptimal
                                ? "text-emerald-400"
                                : wordCount > 0
                                    ? "text-amber-400"
                                    : "text-slate-500"
                                }`}
                        >
                            {wordCount} words
                        </span>
                        {isOptimal && (
                            <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Optimal ATS length
                            </span>
                        )}
                        {wordCount > 0 && wordCount < 35 && (
                            <span className="text-amber-400">Aim for 35-70 words</span>
                        )}
                    </div>
                    <span className="text-slate-500">{summary.length} characters</span>
                </div>
            </div>

            {jobTitle && !summary.toLowerCase().includes(jobTitle.toLowerCase()) && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                    💡 <strong>ATS Tip:</strong> Mention your target title &apos;{jobTitle}&apos; in the summary to
                    reinforce keyword indexing.
                </div>
            )}
        </div>
    );
}
