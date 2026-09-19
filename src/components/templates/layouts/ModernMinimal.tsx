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

export default function ModernMinimal({
    data,
    themeColor = "#0f172a",
}: {
    data: ResumeData;
    themeColor?: string;
}) {
    const hidden = new Set(data.hiddenSections || []);

    return (
        <div className="w-full text-slate-900 leading-normal text-left">
            <ResumeHeader info={data.personalInfo} themeColor={themeColor} variant="centered" />

            {/* Summary */}
            {!hidden.has("summary") && data.summary && (
                <ResumeSection title="About" themeColor={themeColor} variant="minimal">
                    <p className="text-xs text-gray-700 leading-relaxed text-center max-w-xl mx-auto italic">
                        &quot;{data.summary}&quot;
                    </p>
                </ResumeSection>
            )}

            {/* Work Experience */}
            {!hidden.has("experience") && data.experience.length > 0 && (
                <ResumeSection title="Experience" themeColor={themeColor} variant="minimal">
                    <ExperienceSection items={data.experience} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Key Projects */}
            {!hidden.has("projects") && data.projects.length > 0 && (
                <ResumeSection title="Selected Projects" themeColor={themeColor} variant="minimal">
                    <ProjectsSection items={data.projects} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Skills */}
            {!hidden.has("skills") && data.skills.length > 0 && (
                <ResumeSection title="Expertise" themeColor={themeColor} variant="minimal">
                    <SkillsSection items={data.skills} themeColor={themeColor} variant="badges" />
                </ResumeSection>
            )}

            {/* Education */}
            {!hidden.has("education") && data.education.length > 0 && (
                <ResumeSection title="Education" themeColor={themeColor} variant="minimal">
                    <EducationSection items={data.education} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Certifications */}
            {!hidden.has("certifications") && (data.certifications || []).length > 0 && (
                <ResumeSection title="Certifications" themeColor={themeColor} variant="minimal">
                    <CertificationsSection items={data.certifications} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Achievements */}
            {!hidden.has("achievements") && (data.achievements || []).length > 0 && (
                <ResumeSection title="Awards" themeColor={themeColor} variant="minimal">
                    <AchievementsSection items={data.achievements} />
                </ResumeSection>
            )}

            {/* Languages */}
            {!hidden.has("languages") && (data.languages || []).length > 0 && (
                <ResumeSection title="Languages" themeColor={themeColor} variant="minimal">
                    <LanguagesSection items={data.languages} />
                </ResumeSection>
            )}

            {/* Custom Sections */}
            {!hidden.has("custom") &&
                (data.customSections || []).map((sec) => (
                    <ResumeSection key={sec.id} title={sec.title} themeColor={themeColor} variant="minimal">
                        <CustomSectionRenderer section={sec} />
                    </ResumeSection>
                ))}
        </div>
    );
}
