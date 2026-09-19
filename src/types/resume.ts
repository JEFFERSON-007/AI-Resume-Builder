export type SectionKey =
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "achievements"
    | "publications"
    | "volunteering"
    | "languages"
    | "custom";

export interface PersonalInfo {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    profilePhoto?: string;
}

export interface ExperienceItem {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements?: string[];
}

export interface EducationItem {
    id: string;
    school: string;
    degree: string;
    field: string;
    location?: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    gpa?: string;
    coursework?: string[];
    achievements?: string[];
}

export type SkillCategory =
    | "technical"
    | "languages"
    | "frameworks"
    | "tools"
    | "cloud"
    | "databases"
    | "softSkills"
    | "other";

export interface SkillItem {
    id: string;
    name: string;
    category?: SkillCategory;
    level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface ProjectItem {
    id: string;
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
    githubUrl?: string;
    achievements?: string[];
}

export interface CertificationItem {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    url?: string;
}

export interface AchievementItem {
    id: string;
    title: string;
    description: string;
    date?: string;
}

export interface PublicationItem {
    id: string;
    title: string;
    publisher: string;
    date: string;
    url?: string;
    description?: string;
}

export interface VolunteeringItem {
    id: string;
    organization: string;
    role: string;
    location?: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    description?: string;
}

export interface LanguageItem {
    id: string;
    language: string;
    proficiency: "Basic" | "Conversational" | "Fluent" | "Native" | "Bilingual";
}

export interface CustomSectionEntry {
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description: string;
}

export interface CustomSection {
    id: string;
    title: string;
    items: CustomSectionEntry[];
}

export type PageFormat = "A4" | "Letter";
export type MarginsSize = "compact" | "standard" | "relaxed";
export type LineHeightSize = "tight" | "normal" | "relaxed";
export type TypographyFamily =
    | "Inter"
    | "Merriweather"
    | "Roboto Mono"
    | "Playfair Display"
    | "Outfit"
    | "Geist";

export interface PageSettings {
    format: PageFormat;
    width: number;
    height: number;
    margins: number;
    marginSize: MarginsSize;
    fontFamily: TypographyFamily;
    fontScale: number; // 90 to 115 (%)
    lineHeight: LineHeightSize;
    cropToContent: boolean;
}

export interface ResumeData {
    id: string;
    title: string;
    targetRole?: string;
    updatedAt: string;
    createdAt: string;
    personalInfo: PersonalInfo;
    summary: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    skills: SkillItem[];
    projects: ProjectItem[];
    certifications: CertificationItem[];
    achievements: AchievementItem[];
    publications: PublicationItem[];
    volunteering: VolunteeringItem[];
    languages: LanguageItem[];
    customSections: CustomSection[];
    sectionOrder: SectionKey[];
    hiddenSections: SectionKey[];
    templateId: string;
    pageSettings: PageSettings;
}

export interface ResumeMeta {
    id: string;
    title: string;
    targetRole?: string;
    templateId: string;
    updatedAt: string;
    atsScore?: number;
}
