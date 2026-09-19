import React from "react";
import { SkillItem, SkillCategory } from "@/types/resume";

interface SkillsSectionProps {
    items: SkillItem[];
    themeColor?: string;
    variant?: "categorized" | "inline" | "badges";
}

const CATEGORY_LABELS: Record<SkillCategory, string> = {
    technical: "Technical Skills",
    languages: "Languages",
    frameworks: "Frameworks & Libraries",
    tools: "Developer Tools",
    cloud: "Cloud & Infrastructure",
    databases: "Databases & Storage",
    softSkills: "Core Competencies",
    other: "Other Skills",
};

export default function SkillsSection({
    items,
    themeColor = "#0f172a",
    variant = "categorized",
}: SkillsSectionProps) {
    if (!items || items.length === 0) return null;

    if (variant === "badges") {
        return (
            <div className="flex flex-wrap gap-1.5 break-inside-avoid">
                {items.map((skill) => (
                    <span
                        key={skill.id}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                    >
                        {skill.name}
                    </span>
                ))}
            </div>
        );
    }

    if (variant === "inline") {
        return (
            <p className="text-xs text-gray-700 leading-relaxed break-inside-avoid">
                {items.map((s) => s.name).join(" • ")}
            </p>
        );
    }

    // Default categorized display (ATS preferred)
    const grouped = items.reduce((acc, skill) => {
        const cat = skill.category || "technical";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className="space-y-1.5 break-inside-avoid text-xs">
            {Object.entries(grouped).map(([catKey, skillNames]) => {
                const label = CATEGORY_LABELS[catKey as SkillCategory] || "Skills";
                return (
                    <div key={catKey} className="flex flex-wrap items-baseline gap-1">
                        <span className="font-bold text-gray-900 min-w-[120px]">
                            {label}:
                        </span>
                        <span className="text-gray-700 leading-relaxed">
                            {skillNames.join(", ")}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
