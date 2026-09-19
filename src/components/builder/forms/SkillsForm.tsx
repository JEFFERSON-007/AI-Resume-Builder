"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { Plus, Trash2, Cpu, X, Tag } from "lucide-react";
import { SkillCategory } from "@/types/resume";

const CATEGORIES: { id: SkillCategory; label: string }[] = [
    { id: "technical", label: "Core Technical" },
    { id: "languages", label: "Programming Languages" },
    { id: "frameworks", label: "Frameworks & Libraries" },
    { id: "cloud", label: "Cloud & DevOps" },
    { id: "databases", label: "Databases & Storage" },
    { id: "tools", label: "Developer Tools" },
    { id: "softSkills", label: "Core Competencies" },
    { id: "other", label: "Other" },
];

export default function SkillsForm() {
    const skills = useResumeStore((state) => state.resumeData.skills);
    const addSkill = useResumeStore((state) => state.addSkill);
    const updateSkill = useResumeStore((state) => state.updateSkill);
    const removeSkill = useResumeStore((state) => state.removeSkill);

    const [newSkillInput, setNewSkillInput] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("technical");

    const handleAddSingleSkill = () => {
        if (!newSkillInput.trim()) return;
        const tokens = newSkillInput.split(",").map((t) => t.trim()).filter(Boolean);
        tokens.forEach((tok) => {
            addSkill(selectedCategory);
            // Grab the newly added item from state and update its name
            setTimeout(() => {
                const currentSkills = useResumeStore.getState().resumeData.skills;
                const lastSkill = currentSkills[currentSkills.length - 1];
                if (lastSkill) {
                    useResumeStore.getState().updateSkill(lastSkill.id, {
                        name: tok,
                        category: selectedCategory,
                    });
                }
            }, 10);
        });
        setNewSkillInput("");
    };

    return (
        <div className="space-y-5 text-left">
            <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" /> Skills & Technical Keywords
                </h3>
                <p className="text-xs text-slate-400">
                    Grouped technical competencies for high-match ATS indexing
                </p>
            </div>

            {/* Quick Add Bar */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as SkillCategory)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSingleSkill();
                            }
                        }}
                        placeholder="Add skill or comma-separated list (e.g. TypeScript, React, Docker)..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />

                    <button
                        type="button"
                        onClick={handleAddSingleSkill}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            {/* Existing Skills List Categorized */}
            <div className="space-y-4">
                {CATEGORIES.map((cat) => {
                    const catSkills = skills.filter((s) => (s.category || "technical") === cat.id);
                    if (catSkills.length === 0) return null;

                    return (
                        <div key={cat.id} className="p-3.5 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                {cat.label} ({catSkills.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {catSkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                                    >
                                        <input
                                            type="text"
                                            value={skill.name}
                                            onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                                            className="bg-transparent border-none text-xs text-white focus:outline-none w-28"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill.id)}
                                            className="p-0.5 text-slate-500 hover:text-rose-400 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {skills.length === 0 && (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl">
                    <p className="text-xs text-slate-500">No skills added yet. Type your core skills above.</p>
                </div>
            )}
        </div>
    );
}
