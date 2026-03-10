"use client";

import { useResumeStore } from "@/lib/store";
import { calculateAtsScore, DetailedScore } from "@/utils/ats-scorer";
import { CheckCircle2, AlertCircle, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AtsScoreCard() {
    const { resumeData } = useResumeStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const scoreData = useMemo(() => calculateAtsScore(resumeData), [resumeData]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 50) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-400/10 border-green-400/20";
        if (score >= 50) return "bg-yellow-400/10 border-yellow-400/20";
        return "bg-red-400/10 border-red-400/20";
    };

    return (
        <div className={`glass-dark rounded-2xl border transition-all duration-500 overflow-hidden ${getScoreBg(scoreData.totalScore)}`}>
            <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-white/5"
                            />
                            <motion.circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={125.6}
                                initial={{ strokeDashoffset: 125.6 }}
                                animate={{ strokeDashoffset: 125.6 - (125.6 * scoreData.totalScore) / 100 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={getScoreColor(scoreData.totalScore)}
                            />
                        </svg>
                        <span className={`absolute text-sm font-bold ${getScoreColor(scoreData.totalScore)}`}>
                            {scoreData.totalScore}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            ATS Strength
                            {scoreData.totalScore >= 80 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                            Real-time calculation
                        </p>
                    </div>
                </div>
                <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 border-t border-white/5 pt-4"
                    >
                        <div className="space-y-4">
                            {/* Breakdown */}
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(scoreData.categories).map(([key, cat]) => (
                                    <div key={key} className="bg-black/20 p-2 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">{key}</span>
                                            <span className={`text-[10px] font-bold ${getScoreColor((cat.score / cat.maxScore) * 100)}`}>
                                                {cat.score}/{cat.maxScore}
                                            </span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                                                className={`h-full ${getScoreColor((cat.score / cat.maxScore) * 100).replace('text-', 'bg-')}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Suggestions */}
                            {scoreData.overallSuggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                                        <ArrowUpRight className="w-3 h-3" /> How to improve
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {scoreData.overallSuggestions.map((suggestion, i) => (
                                            <li key={i} className="flex gap-2 text-xs text-gray-300">
                                                <AlertCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {scoreData.totalScore >= 90 && (
                                <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <p className="text-[10px] text-green-400 text-center font-medium">
                                        Amazing! Your resume is highly optimized for ATS.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
