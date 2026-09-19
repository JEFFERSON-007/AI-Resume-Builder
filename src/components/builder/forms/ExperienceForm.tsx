"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Briefcase,
    Calendar,
    MapPin,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExperienceForm() {
    const experience = useResumeStore((state) => state.resumeData.experience);
    const addExperience = useResumeStore((state) => state.addExperience);
    const updateExperience = useResumeStore((state) => state.updateExperience);
    const removeExperience = useResumeStore((state) => state.removeExperience);
    const reorderExperience = useResumeStore((state) => state.reorderExperience);
    const setAiOpen = useResumeStore((state) => state.setAiOpen);

    const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);

    const handleAddAchievement = (expId: string, currentAchievements: string[] = []) => {
        updateExperience(expId, {
            achievements: [...currentAchievements, ""],
        });
    };

    const handleUpdateAchievement = (
        expId: string,
        idx: number,
        value: string,
        achievements: string[] = []
    ) => {
        const next = [...achievements];
        next[idx] = value;
        updateExperience(expId, { achievements: next });
    };

    const handleRemoveAchievement = (expId: string, idx: number, achievements: string[] = []) => {
        const next = achievements.filter((_, i) => i !== idx);
        updateExperience(expId, { achievements: next });
    };

    return (
        <div className="space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" /> Work Experience
                    </h3>
                    <p className="text-xs text-slate-400">
                        Include roles, impact descriptions, and quantifiable accomplishments
                    </p>
                </div>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl hover:bg-blue-500/20 transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Role
                </button>
            </div>

            <div className="space-y-3">
                {experience.map((exp, index) => {
                    const isExpanded = expandedId === exp.id;
                    const achievements = exp.achievements || [];

                    return (
                        <div
                            key={exp.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                        >
                            {/* Card Header */}
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-bold text-white truncate">
                                            {exp.position || "Untitled Position"}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 truncate">
                                            {exp.company || "Company"} • {exp.startDate || "Start"} —{" "}
                                            {exp.current ? "Present" : exp.endDate || "End"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                reorderExperience(index, index - 1);
                                            }}
                                            className="p-1 text-slate-500 hover:text-white"
                                            title="Move Up"
                                        >
                                            <ArrowUp className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    {index < experience.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                reorderExperience(index, index + 1);
                                            }}
                                            className="p-1 text-slate-500 hover:text-white"
                                            title="Move Down"
                                        >
                                            <ArrowDown className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeExperience(exp.id);
                                        }}
                                        className="p-1 text-slate-500 hover:text-rose-400"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="p-1 text-slate-500">
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>

                            {/* Collapsible Form Fields */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3.5"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Position Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={exp.position}
                                                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                                                    placeholder="Senior Software Engineer"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Company / Organization *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                                    placeholder="Acme Corp"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={exp.location || ""}
                                                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                                                    placeholder="San Francisco, CA"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="text"
                                                    value={exp.startDate}
                                                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                                    placeholder="2022-03"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="text"
                                                    value={exp.current ? "Present" : exp.endDate}
                                                    disabled={exp.current}
                                                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                                    placeholder="2024-01"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-40"
                                                />
                                                <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={exp.current}
                                                        onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                                                        className="rounded bg-slate-800 border-slate-700 text-blue-500"
                                                    />
                                                    <span className="text-[10px] text-slate-400">Current Position</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[11px] font-semibold text-slate-300 uppercase">
                                                    Overview / Responsibilities
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setAiOpen(true)}
                                                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                                                >
                                                    <Sparkles className="w-3 h-3" /> Polish with AI
                                                </button>
                                            </div>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                                                placeholder="Key responsibilities and core technologies handled in this role..."
                                                rows={3}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                                            />
                                        </div>

                                        {/* Key Achievements Bullet Points */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[11px] font-semibold text-slate-300 uppercase">
                                                    Key Accomplishments (STAR Bullets)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddAchievement(exp.id, achievements)}
                                                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Bullet
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {achievements.map((ach, aIdx) => (
                                                    <div key={aIdx} className="flex items-center gap-2">
                                                        <span className="text-slate-500 text-xs">•</span>
                                                        <input
                                                            type="text"
                                                            value={ach}
                                                            onChange={(e) =>
                                                                handleUpdateAchievement(exp.id, aIdx, e.target.value, achievements)
                                                            }
                                                            placeholder="e.g. Reduced API response times by 35% through Redis caching..."
                                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAchievement(exp.id, aIdx, achievements)}
                                                            className="p-1 text-slate-500 hover:text-rose-400"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {experience.length === 0 && (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl space-y-2">
                    <p className="text-xs text-slate-500">No work experience entries added yet.</p>
                    <button
                        onClick={addExperience}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                    >
                        Add Your First Role
                    </button>
                </div>
            )}
        </div>
    );
}
