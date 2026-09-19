"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { Plus, Trash2, ChevronDown, ChevronUp, FolderGit2, ExternalLink, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsForm() {
    const projects = useResumeStore((state) => state.resumeData.projects);
    const addProject = useResumeStore((state) => state.addProject);
    const updateProject = useResumeStore((state) => state.updateProject);
    const removeProject = useResumeStore((state) => state.removeProject);

    const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

    return (
        <div className="space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-blue-400" /> Key Projects & Open Source
                    </h3>
                    <p className="text-xs text-slate-400">
                        Demonstrate applied engineering, product delivery, and technical depth
                    </p>
                </div>
                <button
                    onClick={addProject}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl hover:bg-blue-500/20 transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                </button>
            </div>

            <div className="space-y-3">
                {projects.map((proj, index) => {
                    const isExpanded = expandedId === proj.id;

                    return (
                        <div
                            key={proj.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                        >
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-bold text-white truncate">
                                            {proj.name || "Untitled Project"}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 truncate">
                                            {(proj.technologies || []).join(", ") || "No technologies tagged"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeProject(proj.id);
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
                                                    Project Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={proj.name}
                                                    onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                                                    placeholder="Real-Time Task Queue"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                    Technologies (Comma-separated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={(proj.technologies || []).join(", ")}
                                                    onChange={(e) =>
                                                        updateProject(proj.id, {
                                                            technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                                        })
                                                    }
                                                    placeholder="Go, Redis, Docker, gRPC"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                                                    <ExternalLink className="w-3 h-3 text-blue-400" /> Demo / Live URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={proj.link || ""}
                                                    onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                                                    placeholder="https://myproject.app"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                                                    <Github className="w-3 h-3 text-purple-400" /> GitHub Repository URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={proj.githubUrl || ""}
                                                    onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                                                    placeholder="https://github.com/myusername/project"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                                Description & Technical Impact
                                            </label>
                                            <textarea
                                                value={proj.description}
                                                onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                                                placeholder="Engineered a fault-tolerant distributed queue handling 50,000 concurrent jobs..."
                                                rows={3}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
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
