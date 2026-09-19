import React from "react";
import { EducationItem } from "@/types/resume";

interface EducationSectionProps {
    items: EducationItem[];
    themeColor?: string;
}

export default function EducationSection({ items, themeColor }: EducationSectionProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-3">
            {items.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <div>
                            <span className="font-bold text-sm text-gray-900">
                                {edu.degree}
                                {edu.field && ` in ${edu.field}`}
                            </span>
                            {edu.school && (
                                <span className="font-semibold text-sm text-gray-700">
                                    {" "}• {edu.school}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                            {edu.startDate && <span>{edu.startDate} — </span>}
                            <span>{edu.endDate}</span>
                            {edu.location && <span> | {edu.location}</span>}
                        </div>
                    </div>

                    {edu.gpa && (
                        <p className="text-xs text-gray-600 mt-0.5">
                            <span className="font-medium text-gray-700">GPA:</span> {edu.gpa}
                        </p>
                    )}

                    {edu.coursework && edu.coursework.length > 0 && (
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                            <span className="font-medium text-gray-700">Relevant Coursework:</span>{" "}
                            {edu.coursework.join(", ")}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
