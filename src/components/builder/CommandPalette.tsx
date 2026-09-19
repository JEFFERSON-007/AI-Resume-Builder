"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    FileText,
    Sparkles,
    Printer,
    FileSearch,
    Undo2,
    Redo2,
    Layout,
    Download,
    Settings,
    FolderKanban,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
    const router = useRouter();
    const isCommandPaletteOpen = useResumeStore((state) => state.isCommandPaletteOpen);
    const setCommandPaletteOpen = useResumeStore((state) => state.setCommandPaletteOpen);
    const setAiOpen = useResumeStore((state) => state.setAiOpen);
    const setJdModalOpen = useResumeStore((state) => state.setJdModalOpen);
    const setManagerOpen = useResumeStore((state) => state.setManagerOpen);
    const setSettingsOpen = useResumeStore((state) => state.setSettingsOpen);
    const undo = useResumeStore((state) => state.undo);
    const redo = useResumeStore((state) => state.redo);
    const canUndo = useResumeStore((state) => state.canUndo);
    const canRedo = useResumeStore((state) => state.canRedo);
    const exportResumeJson = useResumeStore((state) => state.exportResumeJson);

    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Global keyboard listener for Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setCommandPaletteOpen(!isCommandPaletteOpen);
            } else if (e.key === "Escape" && isCommandPaletteOpen) {
                setCommandPaletteOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isCommandPaletteOpen, setCommandPaletteOpen]);

    const commands = [
        {
            id: "ai-assistant",
            title: "AI Career Assistant",
            desc: "Generate summary, improve bullets, or career chat",
            icon: Sparkles,
            action: () => setAiOpen(true),
            category: "AI",
        },
        {
            id: "ats-match",
            title: "Job Description Matcher",
            desc: "Compare resume against job posting keywords",
            icon: FileSearch,
            action: () => setJdModalOpen(true),
            category: "ATS",
        },
        {
            id: "print-pdf",
            title: "Print Resume / Vector PDF",
            desc: "Trigger high-fidelity vector print dialog (Ctrl+P)",
            icon: Printer,
            action: () => window.print(),
            category: "Export",
        },
        {
            id: "switch-template",
            title: "Change Template & Theme",
            desc: "Browse modern ATS, technical, and executive designs",
            icon: Layout,
            action: () => router.push("/templates"),
            category: "Design",
        },
        {
            id: "manage-resumes",
            title: "Manage Multiple Resumes",
            desc: "Create, rename, or switch job-specific resume versions",
            icon: FolderKanban,
            action: () => setManagerOpen(true),
            category: "General",
        },
        {
            id: "undo",
            title: "Undo Edit",
            desc: "Revert last change (Ctrl+Z)",
            icon: Undo2,
            action: () => {
                if (canUndo) undo();
            },
            disabled: !canUndo,
            category: "Edit",
        },
        {
            id: "redo",
            title: "Redo Edit",
            desc: "Re-apply reverted change (Ctrl+Y)",
            icon: Redo2,
            action: () => {
                if (canRedo) redo();
            },
            disabled: !canRedo,
            category: "Edit",
        },
        {
            id: "export-json",
            title: "Export JSON Backup",
            desc: "Download full resume state as JSON file",
            icon: Download,
            action: () => {
                const json = exportResumeJson();
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `resume-${Date.now()}.json`;
                a.click();
            },
            category: "Export",
        },
        {
            id: "settings",
            title: "Settings & API Key",
            desc: "Configure Gemini key, manage data, and privacy",
            icon: Settings,
            action: () => setSettingsOpen(true),
            category: "General",
        },
    ];

    const filtered = commands.filter(
        (c) =>
            c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.desc.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (cmd: (typeof commands)[0]) => {
        setCommandPaletteOpen(false);
        cmd.action();
    };

    if (!isCommandPaletteOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Search Bar */}
                    <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
                        <Search className="w-5 h-5 text-slate-400 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(0);
                            }}
                            placeholder="Type a command or search actions..."
                            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                            autoFocus
                        />
                        <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">ESC</kbd>
                    </div>

                    {/* Results list */}
                    <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-left">
                        {filtered.length === 0 ? (
                            <p className="p-6 text-center text-xs text-slate-500">No matching commands found.</p>
                        ) : (
                            filtered.map((cmd, idx) => {
                                const isSelected = idx === selectedIndex;
                                return (
                                    <button
                                        key={cmd.id}
                                        onClick={() => handleSelect(cmd)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        disabled={cmd.disabled}
                                        className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-colors ${isSelected ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/50"
                                            } ${cmd.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-blue-400">
                                                <cmd.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold text-white">{cmd.title}</h4>
                                                <p className="text-[11px] text-slate-400">{cmd.desc}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-500 uppercase font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                                            {cmd.category}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500 flex justify-between px-4">
                        <span>Navigate with mouse or keyboard</span>
                        <span>Ctrl+K to toggle</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
