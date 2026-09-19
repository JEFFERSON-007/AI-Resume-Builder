import React from "react";
import { ExperienceItem } from "@/types/resume";

interface ExperienceSectionProps {
    items: ExperienceItem[];
    themeColor?: string;
    showLocation?: boolean;
}

export default function ExperienceSection({
    items,
    themeColor = "#0f172a",
    showLocation = true,
}: ExperienceSectionProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-4">
            {items.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <div>
                            <span className="font-bold text-sm text-gray-900">{exp.position}</span>
                            {exp.company && (
                                <span className="font-semibold text-sm text-gray-700">
                                    {" "}• {exp.company}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                            {exp.startDate && <span>{exp.startDate}</span>}
                            {(exp.startDate || exp.endDate) && <span> — </span>}
                            <span>{exp.current ? "Present" : exp.endDate}</span>
                            {showLocation && exp.location && <span> | {exp.location}</span>}
                        </div>
                    </div>

                    {exp.description && (
                        <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">
                            {exp.description}
                        </p>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-xs text-gray-600 leading-relaxed">
                            {exp.achievements.filter(Boolean).map((ach, i) => (
                                <li key={i}>{ach}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
