"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationForm() {
    const education = useResumeStore((state) => state.resumeData.education);
    const addEducation = useResumeStore((state) => state.addEducation);
    const updateEducation = useResumeStore((state) => state.updateEducation);
    const removeEducation = useResumeStore((state) => state.removeEducation);

    const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

    return (
        <div className="space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" /> Education & Academic Background
                    </h3>
                    <p className="text-xs text-slate-400">
                        Degrees, universities, relevant coursework, and honors
                    </p>
                </div>
                <button
                    onClick={addEducation}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl hover:bg-blue-500/20 transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Degree
                </button>
            </div>

            <div className="space-y-3">
                {education.map((edu, index) => {
                    const isExpanded = expandedId === edu.id;

                    return (
                        <div
                            key={edu.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-bold text-white truncate">
                                            {edu.degree ? `${edu.degree} in ${edu.field || "Major"}` : "New Degree"}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 truncate">
                                            {edu.school || "University"} • {edu.startDate || "Start"} — {edu.endDate || "Graduation"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeEducation(edu.id);
                                        }}
                                        className="p-1 text-slate-500 hover:text-rose-400"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="p-1 text-slate-500">
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>

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
                                                    Degree *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                                    placeholder="Bachelor of Science"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Field of Study / Major *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.field}
                                                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                                                    placeholder="Computer Science"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Institution / University *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.school}
                                                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                                                    placeholder="University of Washington"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.location || ""}
                                                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                                                    placeholder="Seattle, WA"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.startDate}
                                                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                                    placeholder="2015-09"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.endDate}
                                                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                                    placeholder="2019-05"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    GPA (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edu.gpa || ""}
                                                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                                                    placeholder="3.85 / 4.0"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                Relevant Coursework (Comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={(edu.coursework || []).join(", ")}
                                                onChange={(e) =>
                                                    updateEducation(edu.id, {
                                                        coursework: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                                    })
                                                }
                                                placeholder="Distributed Systems, Algorithms, Database Design"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
