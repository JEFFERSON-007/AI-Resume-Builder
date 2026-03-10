"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ResumePreview from "@/components/builder/ResumePreview";
import PersonalInfoForm from "@/components/builder/forms/PersonalInfoForm";
import SummaryForm from "@/components/builder/forms/SummaryForm";
import ExperienceForm from "@/components/builder/forms/ExperienceForm";
import EducationForm from "@/components/builder/forms/EducationForm";
import SkillsForm from "@/components/builder/forms/SkillsForm";
import ProjectsForm from "@/components/builder/forms/ProjectsForm";
import { useState } from "react";
import { User, FileText, Briefcase, GraduationCap, Cpu, FolderGit2, Wand2, Download, Check, Home, Layout } from "lucide-react";
import AiAssistant from "@/components/builder/AiAssistant";
import AtsScoreCard from "@/components/builder/AtsScoreCard";
import { useResumeStore } from "@/lib/store";
import { AI_PROMPTS } from "@/lib/ai-prompts";
import { exportToPdf } from "@/utils/export";

const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "projects", label: "Projects", icon: FolderGit2 },
];

export default function BuilderPage() {
    const [activeTab, setActiveTab] = useState("personal");
    const { isAiOpen, setAiOpen } = useResumeStore();
    const [isExporting, setIsExporting] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { resumeData, updateSummary, updateExperience } = useResumeStore();

    const handleAiAction = async (action: string) => {
        // Always get the latest state from the store to avoid stale closures
        const currentData = useResumeStore.getState().resumeData;
        setIsAiLoading(true);
        try {
            let prompt = "";
            let type = "text";

            if (action === "summary") {
                if (!currentData.personalInfo.jobTitle) {
                    alert("Please enter a Job Title in the Personal section first so the AI knows what to write about!");
                    setIsAiLoading(false);
                    return;
                }
                const experienceText = currentData.experience.map(e => e.description).join(". ");
                prompt = AI_PROMPTS.summary(currentData.personalInfo.jobTitle, experienceText);
            } else if (action === "bullets") {
                const recentExp = currentData.experience[0];
                if (!recentExp || !recentExp.description) {
                    alert("Please add an experience entry with a description first to use 'Impact Bullet points'.");
                    setIsAiLoading(false);
                    return;
                }
                prompt = AI_PROMPTS.improveBullet(recentExp.description);
            } else if (action === "keywords" || action === "scoring") {
                if (!currentData.personalInfo.jobTitle) {
                    alert("Please enter a Job Title first for accurate scoring and optimization.");
                    setIsAiLoading(false);
                    return;
                }
                if (currentData.experience.length === 0) {
                    alert("Please add at least one experience entry to calculate a professional score.");
                    setIsAiLoading(false);
                    return;
                }

                const fullContent = `
                    Role: ${currentData.personalInfo.jobTitle}
                    Experience: ${currentData.experience.map(e => `${e.position} at ${e.company}: ${e.description}`).join("\n")}
                    Skills: ${currentData.skills.map(s => s.name).join(", ")}
                `;
                prompt = action === "scoring" ? AI_PROMPTS.score(fullContent) : AI_PROMPTS.tailor("modern tech industry standards", fullContent);
                type = "json";
            }

            if (!prompt) return;

            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, type }),
            });

            const data = await res.json();
            if (data.result) {
                if (action === "summary") {
                    updateSummary(data.result);
                } else if (action === "bullets") {
                    const recentExp = resumeData.experience[0];
                    if (recentExp) {
                        updateExperience(recentExp.id, { description: data.result });
                    }
                } else if (action === "keywords" || action === "scoring") {
                    try {
                        // More robust JSON extraction: find the first { and last }
                        const jsonMatch = data.result.match(/\{[\s\S]*\}/);
                        const cleanJson = jsonMatch ? jsonMatch[0] : data.result;
                        const parsed = JSON.parse(cleanJson);
                        if (action === "scoring") {
                            alert(`Resume Score: ${parsed.score}/100\n\nATS Feedback: ${parsed.ats_feedback}\n\nTop Suggestions:\n${parsed.suggestions.join("\n")}`);
                        } else {
                            alert(`Keyword Optimization Suggestions:\n\n${Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join("\n\n")}`);
                        }
                    } catch (e) {
                        // If parsing fails, just show the raw response
                        alert(`AI Suggestions:\n\n${data.result}`);
                    }
                }
                setAiOpen(false);
            }
            else if (data.error) {
                alert(`AI Error: ${data.error}`);
            }
        } catch (error) {
            console.error("AI Generation failed", error);
            alert("Failed to connect to AI service. Please check your internet and API key.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportToPdf("resume-preview-root", `resume-${resumeData.personalInfo.fullName || "builder"}.pdf`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            {/* Left Side: Forms */}
            <div className="w-full lg:w-1/2 flex flex-col h-full border-r border-white/5">
                <div className="p-6 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Resume Artist
                        </h1>
                        <div className="flex items-center gap-4 ml-6 border-l border-white/10 pl-6">
                            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                <Home className="w-3.5 h-3.5" />
                                <span>Home</span>
                            </Link>
                            <Link href="/templates" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                <Layout className="w-3.5 h-3.5" />
                                <span>Templates</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAiOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg hover:bg-blue-600/20 transition-colors"
                        >
                            <Wand2 className="w-4 h-4" />
                            <span className="text-sm font-medium">AI Helper</span>
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isExporting ? <span className="animate-spin">◌</span> : <Download className="w-4 h-4" />}
                            <span className="text-sm font-medium">{isExporting ? "Exporting..." : "Export"}</span>
                        </button>
                    </div>
                </div>

                <div className="flex bg-white/5 p-1 mx-6 mt-6 rounded-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${activeTab === tab.id
                                ? "bg-white/10 text-white shadow-lg"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-xl mx-auto pb-24"
                    >
                        {activeTab === "personal" && <PersonalInfoForm />}
                        {activeTab === "summary" && <SummaryForm />}
                        {activeTab === "experience" && <ExperienceForm />}
                        {activeTab === "education" && <EducationForm />}
                        {activeTab === "skills" && <SkillsForm />}
                        {activeTab === "projects" && <ProjectsForm />}

                        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                            <button
                                onClick={() => {
                                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                                }}
                                disabled={activeTab === tabs[0].id}
                                className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                                }}
                                disabled={activeTab === tabs[tabs.length - 1].id}
                                className="px-8 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#050505] items-center justify-center p-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08)_0%,rgba(0,0,0,0)_60%)]" />
                <div className="absolute top-10 right-10 flex flex-col gap-4 text-center">
                    <div className="glass-dark p-4 rounded-2xl animate-float">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Status</span>
                        <span className="text-green-400 text-sm font-bold flex items-center gap-2 justify-center">
                            <Check className="w-4 h-4" /> Live Preview
                        </span>
                    </div>
                    <AtsScoreCard />
                </div>
                <ResumePreview />
            </div>

            <AnimatePresence>
                {isAiOpen && (
                    <AiAssistant
                        onClose={() => setAiOpen(false)}
                        onAction={handleAiAction}
                        loading={isAiLoading}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
