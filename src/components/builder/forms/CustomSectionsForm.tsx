"use client";

import { useResumeStore } from "@/lib/store";
import { Plus, Trash2, Globe2, Trophy, HeartHandshake, Layers, X } from "lucide-react";

export default function CustomSectionsForm() {
    const languages = useResumeStore((state) => state.resumeData.languages || []);
    const achievements = useResumeStore((state) => state.resumeData.achievements || []);
    const volunteering = useResumeStore((state) => state.resumeData.volunteering || []);
    const customSections = useResumeStore((state) => state.resumeData.customSections || []);

    const addLanguage = useResumeStore((state) => state.addLanguage);
    const updateLanguage = useResumeStore((state) => state.updateLanguage);
    const removeLanguage = useResumeStore((state) => state.removeLanguage);

    const addAchievement = useResumeStore((state) => state.addAchievement);
    const updateAchievement = useResumeStore((state) => state.updateAchievement);
    const removeAchievement = useResumeStore((state) => state.removeAchievement);

    const addVolunteering = useResumeStore((state) => state.addVolunteering);
    const updateVolunteering = useResumeStore((state) => state.updateVolunteering);
    const removeVolunteering = useResumeStore((state) => state.removeVolunteering);

    const addCustomSection = useResumeStore((state) => state.addCustomSection);
    const updateCustomSectionTitle = useResumeStore((state) => state.updateCustomSectionTitle);
    const removeCustomSection = useResumeStore((state) => state.removeCustomSection);
    const addCustomSectionItem = useResumeStore((state) => state.addCustomSectionItem);
    const updateCustomSectionItem = useResumeStore((state) => state.updateCustomSectionItem);
    const removeCustomSectionItem = useResumeStore((state) => state.removeCustomSectionItem);

    return (
        <div className="space-y-6 text-left">
            <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" /> Additional & Custom Sections
                </h3>
                <p className="text-xs text-slate-400">
                    Languages, honors, community volunteering, and tailored custom sections
                </p>
            </div>

            {/* LANGUAGES */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-emerald-400" /> Spoken Languages
                    </span>
                    <button
                        type="button"
                        onClick={addLanguage}
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add Language
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {languages.map((lang) => (
                        <div
                            key={lang.id}
                            className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2"
                        >
                            <input
                                type="text"
                                value={lang.language}
                                onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                                placeholder="e.g. Spanish"
                                className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                            />
                            <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as any })}
                                className="bg-slate-900 text-[11px] text-slate-300 rounded px-1.5 py-0.5 border border-slate-700"
                            >
                                <option value="Basic">Basic</option>
                                <option value="Conversational">Conversational</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Native">Native</option>
                                <option value="Bilingual">Bilingual</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => removeLanguage(lang.id)}
                                className="p-1 text-slate-500 hover:text-rose-400"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" /> Honors & Awards
                    </span>
                    <button
                        type="button"
                        onClick={addAchievement}
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add Award
                    </button>
                </div>

                <div className="space-y-2">
                    {achievements.map((ach) => (
                        <div
                            key={ach.id}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <input
                                    type="text"
                                    value={ach.title}
                                    onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                                    placeholder="Award Title (e.g. 1st Place Hackathon)"
                                    className="flex-1 bg-transparent text-xs font-semibold text-white focus:outline-none"
                                />
                                <input
                                    type="text"
                                    value={ach.date || ""}
                                    onChange={(e) => updateAchievement(ach.id, { date: e.target.value })}
                                    placeholder="2023"
                                    className="w-20 bg-slate-900 text-[11px] text-slate-300 rounded px-2 py-0.5 border border-slate-700 text-center"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeAchievement(ach.id)}
                                    className="p-1 text-slate-500 hover:text-rose-400"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={ach.description}
                                onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                                placeholder="Brief description of the accomplishment..."
                                className="w-full bg-transparent text-[11px] text-slate-400 focus:outline-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* CUSTOM SECTIONS */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Custom Sections
                    </span>
                    <button
                        type="button"
                        onClick={() => addCustomSection("Custom Section")}
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Custom Section
                    </button>
                </div>

                {customSections.map((sec) => (
                    <div
                        key={sec.id}
                        className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={sec.title}
                                onChange={(e) => updateCustomSectionTitle(sec.id, e.target.value)}
                                className="bg-transparent text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-1 focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => addCustomSectionItem(sec.id)}
                                    className="text-[11px] text-blue-400 hover:underline"
                                >
                                    + Add Item
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeCustomSection(sec.id)}
                                    className="p-1 text-slate-500 hover:text-rose-400"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {sec.items.map((it) => (
                                <div
                                    key={it.id}
                                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <input
                                            type="text"
                                            value={it.title}
                                            onChange={(e) =>
                                                updateCustomSectionItem(sec.id, it.id, { title: e.target.value })
                                            }
                                            placeholder="Item Title"
                                            className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={it.date || ""}
                                            onChange={(e) =>
                                                updateCustomSectionItem(sec.id, it.id, { date: e.target.value })
                                            }
                                            placeholder="Date"
                                            className="w-20 bg-slate-900 text-[11px] text-slate-300 rounded px-2 py-0.5 border border-slate-700 text-center"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCustomSectionItem(sec.id, it.id)}
                                            className="p-1 text-slate-500 hover:text-rose-400"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={it.description}
                                        onChange={(e) =>
                                            updateCustomSectionItem(sec.id, it.id, { description: e.target.value })
                                        }
                                        placeholder="Description..."
                                        className="w-full bg-transparent text-[11px] text-slate-400 focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
