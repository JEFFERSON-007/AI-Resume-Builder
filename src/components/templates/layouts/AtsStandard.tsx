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

export default function AtsStandard({
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
                <ResumeSection title="Professional Summary" themeColor={themeColor} variant="underlined">
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                        {data.summary}
                    </p>
                </ResumeSection>
            )}

            {/* Work Experience */}
            {!hidden.has("experience") && data.experience.length > 0 && (
                <ResumeSection title="Professional Experience" themeColor={themeColor} variant="underlined">
                    <ExperienceSection items={data.experience} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Skills */}
            {!hidden.has("skills") && data.skills.length > 0 && (
                <ResumeSection title="Technical Skills" themeColor={themeColor} variant="underlined">
                    <SkillsSection items={data.skills} themeColor={themeColor} variant="categorized" />
                </ResumeSection>
            )}

            {/* Projects */}
            {!hidden.has("projects") && data.projects.length > 0 && (
                <ResumeSection title="Key Projects" themeColor={themeColor} variant="underlined">
                    <ProjectsSection items={data.projects} themeColor={themeColor} />
                </ResumeSection>
            )}

            {/* Education */}
            {!hidden.has("education") && data.education.length > 0 && (
                <ResumeSection title="Education" themeColor={themeColor} variant="underlined">
                    <EducationSection items={data.education} themeColor={themeColor} />
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
                <ResumeSection title="Honors & Achievements" themeColor={themeColor} variant="underlined">
                    <AchievementsSection items={data.achievements} />
                </ResumeSection>
            )}

            {/* Publications */}
            {!hidden.has("publications") && (data.publications || []).length > 0 && (
                <ResumeSection title="Publications" themeColor={themeColor} variant="underlined">
                    <PublicationsSection items={data.publications} />
                </ResumeSection>
            )}

            {/* Volunteering */}
            {!hidden.has("volunteering") && (data.volunteering || []).length > 0 && (
                <ResumeSection title="Leadership & Community" themeColor={themeColor} variant="underlined">
                    <VolunteeringSection items={data.volunteering} />
                </ResumeSection>
            )}

            {/* Languages */}
            {!hidden.has("languages") && (data.languages || []).length > 0 && (
                <ResumeSection title="Languages" themeColor={themeColor} variant="underlined">
                    <LanguagesSection items={data.languages} />
                </ResumeSection>
            )}

            {/* Custom Sections */}
            {!hidden.has("custom") &&
                (data.customSections || []).map((sec) => (
                    <ResumeSection key={sec.id} title={sec.title} themeColor={themeColor} variant="underlined">
                        <CustomSectionRenderer section={sec} />
                    </ResumeSection>
                ))}
        </div>
    );
}
