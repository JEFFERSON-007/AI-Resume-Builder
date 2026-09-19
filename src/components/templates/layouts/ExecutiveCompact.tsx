import React from "react";
import { ResumeData } from "@/types/resume";
import ResumeHeader from "../primitives/ResumeHeader";
import ResumeSection from "../primitives/ResumeSection";
import ExperienceSection from "../primitives/ExperienceSection";
import EducationSection from "../primitives/EducationSection";
import SkillsSection from "../primitives/SkillsSection";
import ProjectsSection from "../primitives/ProjectsSection";
import CertificationsSection from "../primitives/CertificationsSection";
import {
    AchievementsSection,
    PublicationsSection,
    VolunteeringSection,
    LanguagesSection,
    CustomSectionRenderer,
} from "../primitives/AdditionalSections";

export default function ExecutiveCompact({
    data,
    themeColor = "#0f172a",
}: {
    data: ResumeData;
    themeColor?: string;
}) {
    const hidden = new Set(data.hiddenSections || []);

    return (
        <div className="w-full text-slate-900 leading-normal text-left">
            <ResumeHeader info={data.personalInfo} themeColor={themeColor} variant="left-aligned" />

            {/* Summary */}
            {!hidden.has("summary") && data.summary && (
                <ResumeSection title="Executive Profile" themeColor={themeColor} variant="left-border">
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">
                        {data.summary}
                    </p>
                </ResumeSection>
            )}

            {/* Core Competencies & Skills */}
            {!hidden.has("skills") && data.skills.length > 0 && (
                <ResumeSection title="Core Competencies & Domain Expertise" themeColor={themeColor} variant="left-border">
                    <SkillsSection items={data.skills} themeColor={themeColor} variant="categorized" />
                </ResumeSection>
            )}

            {/* Professional Experience */}
            {!hidden.has("experience") && data.experience.length > 0 && (
                <ResumeSection title="Leadership & Professional History" themeColor={themeColor} variant="left-border">
                    <ExperienceSection items={data.experience} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Key Initiatives / Projects */}
            {!hidden.has("projects") && data.projects.length > 0 && (
                <ResumeSection title="Strategic Initiatives" themeColor={themeColor} variant="left-border">
                    <ProjectsSection items={data.projects} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Education & Credentials in 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!hidden.has("education") && data.education.length > 0 && (
                    <ResumeSection title="Education" themeColor={themeColor} variant="left-border">
                        <EducationSection items={data.education} themeColor={themeColor} />
                    </ResumeSection>
                )}

                {!hidden.has("certifications") && (data.certifications || []).length > 0 && (
                    <ResumeSection title="Credentials & Board Certifications" themeColor={themeColor} variant="left-border">
                        <CertificationsSection items={data.certifications} themeColor={themeColor} />
                    </ResumeSection>
                )}
            </div>

            {/* Achievements */}
            {!hidden.has("achievements") && (data.achievements || []).length > 0 && (
                <ResumeSection title="Key Honors & Accolades" themeColor={themeColor} variant="left-border">
                    <AchievementsSection items={data.achievements} />
                </ResumeSection>
            )}

            {/* Languages */}
            {!hidden.has("languages") && (data.languages || []).length > 0 && (
                <ResumeSection title="Languages" themeColor={themeColor} variant="left-border">
                    <LanguagesSection items={data.languages} />
                </ResumeSection>
            )}

            {/* Custom Sections */}
            {!hidden.has("custom") &&
                (data.customSections || []).map((sec) => (
                    <ResumeSection key={sec.id} title={sec.title} themeColor={themeColor} variant="left-border">
                        <CustomSectionRenderer section={sec} />
                    </ResumeSection>
                ))}
        </div>
    );
}
