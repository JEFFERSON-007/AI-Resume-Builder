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

export default function TechnicalStack({
    data,
    themeColor = "#0f172a",
}: {
    data: ResumeData;
    themeColor?: string;
}) {
    const hidden = new Set(data.hiddenSections || []);

    return (
        <div className="w-full text-slate-900 leading-normal text-left font-sans">
            <ResumeHeader info={data.personalInfo} themeColor={themeColor} variant="technical" />

            {/* Summary */}
            {!hidden.has("summary") && data.summary && (
                <ResumeSection title="Executive Summary" themeColor={themeColor} variant="technical">
                    <p className="text-xs text-gray-700 leading-relaxed font-mono">
                        {data.summary}
                    </p>
                </ResumeSection>
            )}

            {/* Technical Skills - High Priority for Devs */}
            {!hidden.has("skills") && data.skills.length > 0 && (
                <ResumeSection title="Tech Stack & Tools" themeColor={themeColor} variant="technical">
                    <SkillsSection items={data.skills} themeColor={themeColor} variant="categorized" />
                </ResumeSection>
            )}

            {/* Work Experience */}
            {!hidden.has("experience") && data.experience.length > 0 && (
                <ResumeSection title="Engineering Experience" themeColor={themeColor} variant="technical">
                    <ExperienceSection items={data.experience} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Key Open Source & Projects */}
            {!hidden.has("projects") && data.projects.length > 0 && (
                <ResumeSection title="Open Source & Architecture" themeColor={themeColor} variant="technical">
                    <ProjectsSection items={data.projects} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Certifications */}
            {!hidden.has("certifications") && (data.certifications || []).length > 0 && (
                <ResumeSection title="Certifications & Cloud Badges" themeColor={themeColor} variant="technical">
                    <CertificationsSection items={data.certifications} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Education */}
            {!hidden.has("education") && data.education.length > 0 && (
                <ResumeSection title="Academic Background" themeColor={themeColor} variant="technical">
                    <EducationSection items={data.education} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Achievements */}
            {!hidden.has("achievements") && (data.achievements || []).length > 0 && (
                <ResumeSection title="Hackathons & Awards" themeColor={themeColor} variant="technical">
                    <AchievementsSection items={data.achievements} />
                </ResumeSection>
            )}

            {/* Languages */}
            {!hidden.has("languages") && (data.languages || []).length > 0 && (
                <ResumeSection title="Spoken Languages" themeColor={themeColor} variant="technical">
                    <LanguagesSection items={data.languages} />
                </ResumeSection>
            )}

            {/* Custom Sections */}
            {!hidden.has("custom") &&
                (data.customSections || []).map((sec) => (
                    <ResumeSection key={sec.id} title={sec.title} themeColor={themeColor} variant="technical">
                        <CustomSectionRenderer section={sec} />
                    </ResumeSection>
                ))}
        </div>
    );
}
