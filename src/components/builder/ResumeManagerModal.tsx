"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    FolderKanban,
    Plus,
    Copy,
    Trash2,
    Edit3,
    Check,
    FileText,
    Sparkles,
    Calendar,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { SAMPLE_RESUMES } from "@/lib/sample-data";

export default function ResumeManagerModal() {
    const isManagerOpen = useResumeStore((state) => state.isManagerOpen);
    const setManagerOpen = useResumeStore((state) => state.setManagerOpen);
    const resumes = useResumeStore((state) => state.resumes);
    const activeResumeId = useResumeStore((state) => state.activeResumeId);
    const switchResume = useResumeStore((state) => state.switchResume);
    const createResume = useResumeStore((state) => state.createResume);
    const duplicateResume = useResumeStore((state) => state.duplicateResume);
    const renameResume = useResumeStore((state) => state.renameResume);
    const deleteResume = useResumeStore((state) => state.deleteResume);
    const loadSampleResume = useResumeStore((state) => state.loadSampleResume);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [newResumeTitle, setNewResumeTitle] = useState("");

    if (!isManagerOpen) return null;

    const handleStartRename = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditTitle(currentTitle);
    };

    const handleSaveRename = (id: string) => {
        if (editTitle.trim()) {
            renameResume(id, editTitle.trim());
        }
        setEditingId(null);
    };

    const handleCreateNew = () => {
        const id = createResume(newResumeTitle.trim() || "Untitled Resume");
        setNewResumeTitle("");
        switchResume(id);
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
                                <FolderKanban className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">My Resumes</h3>
                                <p className="text-xs text-slate-400">
                                    Manage job-tailored versions (e.g., Frontend, Cybersecurity, Leadership)
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setManagerOpen(false)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                        {/* Quick create new */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newResumeTitle}
                                onChange={(e) => setNewResumeTitle(e.target.value)}
                                placeholder="New resume title (e.g. Lead React Developer)..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleCreateNew();
                                }}
                            />
                            <button
                                onClick={handleCreateNew}
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                Create
                            </button>
                        </div>

                        {/* Resume Cards Grid */}
                        <div className="space-y-3">
                            {Object.values(resumes).map((res) => {
                                const isActive = res.id === activeResumeId;
                                const isEditing = editingId === res.id;

                                return (
                                    <div
                                        key={res.id}
                                        className={`p-4 rounded-2xl border transition-all ${isActive
                                            ? "bg-slate-950/80 border-blue-500/40 shadow-lg shadow-blue-500/5"
                                            : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div
                                                    className={`p-2.5 rounded-xl shrink-0 ${isActive
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : "bg-slate-800 text-slate-400"
                                                        }`}
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={editTitle}
                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") handleSaveRename(res.id);
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => handleSaveRename(res.id)}
                                                                className="text-emerald-400 p-1 hover:bg-slate-800 rounded"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-bold text-white truncate">
                                                                {res.title || "Untitled Resume"}
                                                            </h4>
                                                            {isActive && (
                                                                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                                                        <span>
                                                            {res.personalInfo.fullName || "Unnamed Candidate"} •{" "}
                                                            {res.personalInfo.jobTitle || "No role specified"}
                                                        </span>
                                                        <span className="hidden sm:inline text-slate-600">•</span>
                                                        <span className="hidden sm:flex items-center gap-1 text-slate-500" suppressHydrationWarning>
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(res.updatedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {!isActive && (
                                                    <button
                                                        onClick={() => {
                                                            switchResume(res.id);
                                                            setManagerOpen(false);
                                                        }}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
                                                    >
                                                        Open
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleStartRename(res.id, res.title)}
                                                    title="Rename"
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => duplicateResume(res.id)}
                                                    title="Duplicate"
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>

                                                {Object.keys(resumes).length > 1 && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Delete "${res.title}"?`)) {
                                                                deleteResume(res.id);
                                                            }
                                                        }}
                                                        title="Delete"
                                                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Load Sample Data Options */}
                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                Need inspiration? Load a verified fictional sample:
                            </span>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <button
                                    onClick={() => {
                                        if (confirm("Replace current active resume with Software Engineer sample?")) {
                                            loadSampleResume("software-engineer");
                                            setManagerOpen(false);
                                        }
                                    }}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                                >
                                    Software Engineer (Alex Morgan)
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm("Replace current active resume with Cybersecurity sample?")) {
                                            loadSampleResume("cybersecurity");
                                            setManagerOpen(false);
                                        }
                                    }}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                                >
                                    Cybersecurity Analyst (Jordan Hayes)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
                        <button
                            onClick={() => setManagerOpen(false)}
                            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
