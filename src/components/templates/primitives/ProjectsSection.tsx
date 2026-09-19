import React from "react";
import { ProjectItem } from "@/types/resume";
import { ExternalLink, Github } from "lucide-react";

interface ProjectsSectionProps {
    items: ProjectItem[];
    themeColor?: string;
}

export default function ProjectsSection({ items, themeColor }: ProjectsSectionProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-3.5">
            {items.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{proj.name}</span>
                            {proj.link && (
                                <a
                                    href={proj.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-500 hover:text-blue-600 inline-flex items-center gap-0.5 text-xs"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                            {proj.githubUrl && (
                                <a
                                    href={proj.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-500 hover:text-blue-600 inline-flex items-center gap-0.5 text-xs"
                                >
                                    <Github className="w-3 h-3" />
                                </a>
                            )}
                        </div>

                        {proj.technologies && proj.technologies.length > 0 && (
                            <span className="text-xs text-gray-500 font-mono">
                                [{proj.technologies.join(", ")}]
                            </span>
                        )}
                    </div>

                    {proj.description && (
                        <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                            {proj.description}
                        </p>
                    )}

                    {proj.achievements && proj.achievements.length > 0 && (
                        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-gray-600">
                            {proj.achievements.map((ach, idx) => (
                                <li key={idx}>{ach}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
