import React from "react";
import { ResumeData } from "@/types/resume";
import ResumeSection from "../primitives/ResumeSection";
import ExperienceSection from "../primitives/ExperienceSection";
import EducationSection from "../primitives/EducationSection";
import SkillsSection from "../primitives/SkillsSection";
import ProjectsSection from "../primitives/ProjectsSection";
import CertificationsSection from "../primitives/CertificationsSection";
import {
    AchievementsSection,
    LanguagesSection,
    CustomSectionRenderer,
} from "../primitives/AdditionalSections";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

export default function CreativeSidebar({
    data,
    themeColor = "#0f172a",
}: {
    data: ResumeData;
    themeColor?: string;
}) {
    const hidden = new Set(data.hiddenSections || []);
    const { personalInfo } = data;

    return (
        <div className="w-full text-slate-900 leading-normal text-left flex flex-col md:flex-row gap-6">
            {/* Left Sidebar */}
            <aside className="w-full md:w-1/3 space-y-5 border-b md:border-b-0 md:border-r border-gray-200 pb-5 md:pb-0 md:pr-5">
                {/* Header / Identity in sidebar */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: themeColor }}>
                        {personalInfo.fullName || "Candidate Name"}
                    </h1>
                    <p className="text-sm font-semibold text-gray-700">{personalInfo.jobTitle}</p>
                </div>

                {/* Contact List */}
                <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200 pt-3">
                    {personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <a href={`mailto:${personalInfo.email}`} className="truncate hover:underline">
                                {personalInfo.email}
                            </a>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <a
                                href={personalInfo.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate hover:underline"
                            >
                                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "in/")}
                            </a>
                        </div>
                    )}
                    {personalInfo.github && (
                        <div className="flex items-center gap-2">
                            <Github className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <a
                                href={personalInfo.github}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate hover:underline"
                            >
                                {personalInfo.github.replace(/^https?:\/\//, "")}
                            </a>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <a
                                href={personalInfo.website}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate hover:underline"
                            >
                                {personalInfo.website.replace(/^https?:\/\//, "")}
                            </a>
                        </div>
                    )}
                </div>

                {/* Skills in Sidebar */}
                {!hidden.has("skills") && data.skills.length > 0 && (
                    <ResumeSection title="Skills" themeColor={themeColor} variant="minimal">
                        <SkillsSection items={data.skills} themeColor={themeColor} variant="badges" />
                    </ResumeSection>
                )}

                {/* Education in Sidebar */}
                {!hidden.has("education") && data.education.length > 0 && (
                    <ResumeSection title="Education" themeColor={themeColor} variant="minimal">
                        <EducationSection items={data.education} themeColor={themeColor} />
                    </ResumeSection>
                )}

                {/* Languages in Sidebar */}
                {!hidden.has("languages") && (data.languages || []).length > 0 && (
                    <ResumeSection title="Languages" themeColor={themeColor} variant="minimal">
                        <LanguagesSection items={data.languages} />
                    </ResumeSection>
                )}
            </aside>

            {/* Right Main Content */}
            <main className="flex-1 space-y-5">
                {/* Summary */}
                {!hidden.has("summary") && data.summary && (
                    <ResumeSection title="Profile" themeColor={themeColor} variant="underlined">
                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                            {data.summary}
                        </p>
                    </ResumeSection>
                )}

                {/* Experience */}
                {!hidden.has("experience") && data.experience.length > 0 && (
                    <ResumeSection title="Experience" themeColor={themeColor} variant="underlined">
                        <ExperienceSection items={data.experience} themeColor={themeColor} />
                    </ResumeSection>
                )}

                {/* Projects */}
                {!hidden.has("projects") && data.projects.length > 0 && (
                    <ResumeSection title="Projects" themeColor={themeColor} variant="underlined">
                        <ProjectsSection items={data.projects} themeColor={themeColor} />
                    </ResumeSection>
                )}

                {/* Certifications */}
                {!hidden.has("certifications") && (data.certifications || []).length > 0 && (
                    <ResumeSection title="Certifications" themeColor={themeColor} variant="underlined">
                        <CertificationsSection items={data.certifications} themeColor={themeColor} />
                    </ResumeSection>
                )}

                {/* Achievements */}
                {!hidden.has("achievements") && (data.achievements || []).length > 0 && (
                    <ResumeSection title="Achievements" themeColor={themeColor} variant="underlined">
                        <AchievementsSection items={data.achievements} />
                    </ResumeSection>
                )}

                {/* Custom Sections */}
                {!hidden.has("custom") &&
                    (data.customSections || []).map((sec) => (
                        <ResumeSection key={sec.id} title={sec.title} themeColor={themeColor} variant="underlined">
                            <CustomSectionRenderer section={sec} />
                        </ResumeSection>
                    ))}
            </main>
        </div>
    );
}
