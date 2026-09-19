"use client";

import { useResumeStore } from "@/lib/store";
import { calculateAtsScore, AtsReport } from "@/lib/ats/ats-analyzer";
import {
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    ChevronDown,
    ChevronUp,
    FileSearch,
    AlertTriangle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AtsScoreCard() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const targetJobDescription = useResumeStore((state) => state.targetJobDescription);
    const setJdModalOpen = useResumeStore((state) => state.setJdModalOpen);
    const [isExpanded, setIsExpanded] = useState(false);

    const report: AtsReport = useMemo(
        () => calculateAtsScore(resumeData, targetJobDescription),
        [resumeData, targetJobDescription]
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 60) return "text-amber-400";
        return "text-rose-400";
    };

    const getProgressBg = (score: number) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-amber-500";
        return "bg-rose-500";
    };

    return (
        <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md transition-all duration-300">
            {/* Header / Summary Bar */}
            <div
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                className="text-slate-800"
                            />
                            <motion.circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeDasharray={113}
                                initial={{ strokeDashoffset: 113 }}
                                animate={{ strokeDashoffset: 113 - (113 * report.totalScore) / 100 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={getScoreColor(report.totalScore)}
                            />
                        </svg>
                        <span className={`absolute text-xs font-bold ${getScoreColor(report.totalScore)}`}>
                            {report.totalScore}
                        </span>
                    </div>

                    <div className="text-left">
                        <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-semibold text-slate-200">ATS Readiness</h4>
                            {report.totalScore >= 80 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            {report.matchLabel} • {report.detectedActionVerbs.length} action verbs
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setJdModalOpen(true);
                        }}
                        title="Match against Job Description"
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <FileSearch className="w-4 h-4" />
                    </button>
                    <div className="p-1 text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>
            </div>

            {/* Expandable Breakdown Drawer */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 border-t border-slate-800/80 pt-3 text-left space-y-3.5"
                    >
                        {/* Notice */}
                        <p className="text-[10px] text-slate-500 italic">
                            Transparent heuristic estimate. Identifies keyword density, action verbs, and structure.
                        </p>

                        {/* Category Bars */}
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(report.categories).map(([key, cat]) => {
                                const pct = Math.round((cat.score / cat.maxScore) * 100);
                                return (
                                    <div key={key} className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                                        <div className="flex justify-between items-center mb-1 text-[10px]">
                                            <span className="text-slate-400 font-medium truncate">{cat.name}</span>
                                            <span className={`font-semibold ${getScoreColor(pct)}`}>
                                                {cat.score}/{cat.maxScore}
                                            </span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${pct}%` }}
                                                className={`h-full ${getProgressBg(pct)} transition-all duration-500`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Format Flags */}
                        {report.formatFlags.length > 0 && (
                            <div className="space-y-1">
                                <h5 className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertTriangle className="w-3 h-3" /> Formatting Checks
                                </h5>
                                <ul className="space-y-1 text-[11px] text-slate-300">
                                    {report.formatFlags.map((flag, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5">
                                            <span className="text-amber-400">•</span>
                                            <span>{flag}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Top Actionable Suggestions */}
                        {report.overallSuggestions.length > 0 && (
                            <div className="space-y-1">
                                <h5 className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <ArrowUpRight className="w-3 h-3" /> Recommendations
                                </h5>
                                <ul className="space-y-1 text-[11px] text-slate-300">
                                    {report.overallSuggestions.slice(0, 3).map((sug, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5">
                                            <AlertCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                            <span>{sug}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* JD Match CTA */}
                        <button
                            type="button"
                            onClick={() => setJdModalOpen(true)}
                            className="w-full py-1.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <FileSearch className="w-3.5 h-3.5" />
                            {targetJobDescription ? "View Job Match Analysis" : "Compare with Job Description"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
