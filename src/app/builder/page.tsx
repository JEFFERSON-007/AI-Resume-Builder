"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    FileText,
    Briefcase,
    GraduationCap,
    Cpu,
    FolderGit2,
    Award,
    Layers,
    Sparkles,
    Printer,
    Download,
    Undo2,
    Redo2,
    Home,
    Layout,
    Check,
    FolderKanban,
    Settings,
    FileSearch,
    Eye,
    Edit3,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import PersonalInfoForm from "@/components/builder/forms/PersonalInfoForm";
import SummaryForm from "@/components/builder/forms/SummaryForm";
import ExperienceForm from "@/components/builder/forms/ExperienceForm";
import EducationForm from "@/components/builder/forms/EducationForm";
import SkillsForm from "@/components/builder/forms/SkillsForm";
import ProjectsForm from "@/components/builder/forms/ProjectsForm";
import CertificationsForm from "@/components/builder/forms/CertificationsForm";
import CustomSectionsForm from "@/components/builder/forms/CustomSectionsForm";
import ResumePreview from "@/components/builder/ResumePreview";
import AtsScoreCard from "@/components/builder/AtsScoreCard";
import AiAssistantModal from "@/components/ai/AiAssistantModal";
import JobDescriptionModal from "@/components/ats/JobDescriptionModal";
import ResumeManagerModal from "@/components/builder/ResumeManagerModal";
import SettingsModal from "@/components/builder/SettingsModal";
import CommandPalette from "@/components/builder/CommandPalette";
import { printResume, exportToPdf } from "@/utils/export";

const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "certifications", label: "Certs", icon: Award },
    { id: "custom", label: "More", icon: Layers },
];

export default function BuilderPage() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const resumeData = useResumeStore((state) => state.resumeData);
    const resumes = useResumeStore((state) => state.resumes);
    const activeResumeId = useResumeStore((state) => state.activeResumeId);
    const switchResume = useResumeStore((state) => state.switchResume);
    const saveStatus = useResumeStore((state) => state.saveStatus);
    const lastSaved = useResumeStore((state) => state.lastSaved);
    const undo = useResumeStore((state) => state.undo);
    const redo = useResumeStore((state) => state.redo);
    const canUndo = useResumeStore((state) => state.canUndo);
    const canRedo = useResumeStore((state) => state.canRedo);

    const setAiOpen = useResumeStore((state) => state.setAiOpen);
    const setJdModalOpen = useResumeStore((state) => state.setJdModalOpen);
    const setManagerOpen = useResumeStore((state) => state.setManagerOpen);
    const setSettingsOpen = useResumeStore((state) => state.setSettingsOpen);
    const setCommandPaletteOpen = useResumeStore((state) => state.setCommandPaletteOpen);

    // Global keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+P, Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isModifier = e.ctrlKey || e.metaKey;
            if (!isModifier) return;

            if (e.key.toLowerCase() === "z" && !e.shiftKey) {
                e.preventDefault();
                if (useResumeStore.getState().canUndo) {
                    useResumeStore.getState().undo();
                }
            } else if ((e.key.toLowerCase() === "y") || (e.key.toLowerCase() === "z" && e.shiftKey)) {
                e.preventDefault();
                if (useResumeStore.getState().canRedo) {
                    useResumeStore.getState().redo();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleExport = async () => {
        setIsExporting(true);
        const name = (resumeData.personalInfo.fullName || "resume").replace(/\s+/g, "_");
        await exportToPdf("resume-preview-root", `${name}_resume.pdf`, resumeData.pageSettings?.format);
        setIsExporting(false);
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
            {/* LEFT / MAIN COLUMN: TOOLBAR & FORMS */}
            <div
                className={`w-full lg:w-1/2 flex flex-col h-full border-r border-slate-800 transition-all ${mobileView === "preview" ? "hidden lg:flex" : "flex"
                    }`}
            >
                {/* Header Bar */}
                <header className="p-3.5 sm:px-6 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md flex items-center justify-between gap-3 select-none">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                                <span className="text-white font-bold text-base">R</span>
                            </div>
                            <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hidden sm:inline">
                                Resume Artist
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-3 ml-2 border-l border-slate-800 pl-3">
                            <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                <Home className="w-3.5 h-3.5" />
                                <span>Home</span>
                            </Link>
                            <Link href="/templates" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                <Layout className="w-3.5 h-3.5" />
                                <span>Templates</span>
                            </Link>
                        </div>

                        {/* Resume Selector Dropdown */}
                        <div className="flex items-center gap-1.5">
                            <select
                                value={activeResumeId}
                                onChange={(e) => switchResume(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500 max-w-[150px] sm:max-w-[200px] truncate"
                            >
                                {Object.values(resumes).map((res) => (
                                    <option key={res.id} value={res.id}>
                                        {res.title || "Untitled Resume"}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => setManagerOpen(true)}
                                title="Manage Resumes"
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <FolderKanban className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Toolbar Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Autosave Pill */}
                        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-800 text-[11px] text-slate-400">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span suppressHydrationWarning>
                                {mounted && lastSaved ? `Saved ${lastSaved}` : "Auto-saved"}
                            </span>
                        </div>

                        {/* Undo / Redo */}
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                            <button
                                onClick={undo}
                                disabled={!canUndo}
                                title="Undo (Ctrl+Z)"
                                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                            >
                                <Undo2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={redo}
                                disabled={!canRedo}
                                title="Redo (Ctrl+Y)"
                                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                            >
                                <Redo2 className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* AI & ATS Triggers */}
                        <button
                            onClick={() => setAiOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">AI Helper</span>
                        </button>

                        <button
                            onClick={() => setJdModalOpen(true)}
                            title="Job Description & ATS Matcher"
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition-colors"
                        >
                            <FileSearch className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setSettingsOpen(true)}
                            title="Settings & Privacy"
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        <Link
                            href="/templates"
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition-colors"
                            title="Browse Templates"
                        >
                            <Layout className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                {/* Section Navigation Tabs */}
                <div className="flex bg-slate-900/60 border-b border-slate-800/80 p-1.5 gap-1 overflow-x-auto select-none scrollbar-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Forms Viewport */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
                    <div className="max-w-xl mx-auto pb-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                            >
                                {activeTab === "personal" && <PersonalInfoForm />}
                                {activeTab === "summary" && <SummaryForm />}
                                {activeTab === "experience" && <ExperienceForm />}
                                {activeTab === "education" && <EducationForm />}
                                {activeTab === "skills" && <SkillsForm />}
                                {activeTab === "projects" && <ProjectsForm />}
                                {activeTab === "certifications" && <CertificationsForm />}
                                {activeTab === "custom" && <CustomSectionsForm />}
                            </motion.div>
                        </AnimatePresence>

                        {/* Step Navigation Bar */}
                        <div className="mt-10 flex items-center justify-between border-t border-slate-800 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    const idx = tabs.findIndex((t) => t.id === activeTab);
                                    if (idx > 0) setActiveTab(tabs[idx - 1].id);
                                }}
                                disabled={activeTab === tabs[0].id}
                                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const idx = tabs.findIndex((t) => t.id === activeTab);
                                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                                }}
                                disabled={activeTab === tabs[tabs.length - 1].id}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                            >
                                Next Step →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: PREVIEW & ATS STATUS */}
            <div
                className={`w-full lg:w-1/2 flex-col h-full bg-slate-950 relative overflow-hidden ${mobileView === "preview" ? "flex" : "hidden lg:flex"
                    }`}
            >
                {/* Floating ATS Score Card in Desktop Preview */}
                <div id="ats-card-container" className="no-print absolute top-14 right-4 z-30">
                    <AtsScoreCard />
                </div>

                <ResumePreview />
            </div>

            {/* MOBILE VIEW TOGGLE SWITCHER (Floating bottom bar on small screens) */}
            <div className="no-print fixed bottom-4 left-1/2 -translate-x-1/2 lg:hidden z-40 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-full p-1 shadow-2xl flex items-center gap-1">
                <button
                    onClick={() => setMobileView("edit")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mobileView === "edit"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:text-white"
                        }`}
                >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editor
                </button>
                <button
                    onClick={() => setMobileView("preview")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mobileView === "preview"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:text-white"
                        }`}
                >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                </button>
            </div>

            {/* MODALS */}
            <AiAssistantModal />
            <JobDescriptionModal />
            <ResumeManagerModal />
            <SettingsModal />
            <CommandPalette />
        </div>
    );
}
