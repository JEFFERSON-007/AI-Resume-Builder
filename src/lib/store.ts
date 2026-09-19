import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    ResumeData,
    PersonalInfo,
    ExperienceItem,
    EducationItem,
    SkillItem,
    ProjectItem,
    CertificationItem,
    AchievementItem,
    PublicationItem,
    VolunteeringItem,
    LanguageItem,
    CustomSection,
    SectionKey,
    PageSettings,
    TypographyFamily,
} from "@/types/resume";
import { SAMPLE_RESUMES, createEmptyResume } from "./sample-data";

export type SaveStatus = "saved" | "saving" | "unsaved";

interface ResumeStoreState {
    // Multi-resume storage
    resumes: Record<string, ResumeData>;
    activeResumeId: string;

    // Direct active resume data accessor
    resumeData: ResumeData;

    // Undo / Redo history stacks
    past: ResumeData[];
    future: ResumeData[];
    canUndo: boolean;
    canRedo: boolean;

    // Autosave tracking
    saveStatus: SaveStatus;
    lastSaved: string | null;

    // Viewport & UI state
    zoom: number;
    previewMode: "edit" | "preview";
    isAiOpen: boolean;
    isJdModalOpen: boolean;
    isCommandPaletteOpen: boolean;
    isManagerOpen: boolean;
    isSettingsOpen: boolean;

    // Target job description for ATS matching
    targetJobDescription: string;
    setTargetJobDescription: (jd: string) => void;

    // UI actions
    setZoom: (zoom: number) => void;
    setPreviewMode: (mode: "edit" | "preview") => void;
    setAiOpen: (open: boolean) => void;
    setJdModalOpen: (open: boolean) => void;
    setCommandPaletteOpen: (open: boolean) => void;
    setManagerOpen: (open: boolean) => void;
    setSettingsOpen: (open: boolean) => void;

    // History controls
    undo: () => void;
    redo: () => void;

    // Multi-resume management
    switchResume: (id: string) => void;
    createResume: (title?: string) => string;
    duplicateResume: (id?: string) => string;
    renameResume: (id: string, newTitle: string) => void;
    deleteResume: (id: string) => void;
    loadSampleResume: (key: keyof typeof SAMPLE_RESUMES) => void;
    resetActiveResume: () => void;
    importResumeJson: (jsonString: string) => { success: boolean; error?: string };
    exportResumeJson: () => string;

    // Section data mutators
    updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
    updateSummary: (summary: string) => void;

    // Experience
    addExperience: () => void;
    updateExperience: (id: string, data: Partial<ExperienceItem>) => void;
    removeExperience: (id: string) => void;
    reorderExperience: (startIndex: number, endIndex: number) => void;

    // Education
    addEducation: () => void;
    updateEducation: (id: string, data: Partial<EducationItem>) => void;
    removeEducation: (id: string) => void;
    reorderEducation: (startIndex: number, endIndex: number) => void;

    // Skills
    addSkill: (category?: SkillItem["category"]) => void;
    updateSkill: (id: string, data: Partial<SkillItem>) => void;
    removeSkill: (id: string) => void;

    // Projects
    addProject: () => void;
    updateProject: (id: string, data: Partial<ProjectItem>) => void;
    removeProject: (id: string) => void;
    reorderProjects: (startIndex: number, endIndex: number) => void;

    // Certifications
    addCertification: () => void;
    updateCertification: (id: string, data: Partial<CertificationItem>) => void;
    removeCertification: (id: string) => void;

    // Achievements
    addAchievement: () => void;
    updateAchievement: (id: string, data: Partial<AchievementItem>) => void;
    removeAchievement: (id: string) => void;

    // Publications
    addPublication: () => void;
    updatePublication: (id: string, data: Partial<PublicationItem>) => void;
    removePublication: (id: string) => void;

    // Volunteering
    addVolunteering: () => void;
    updateVolunteering: (id: string, data: Partial<VolunteeringItem>) => void;
    removeVolunteering: (id: string) => void;

    // Languages
    addLanguage: () => void;
    updateLanguage: (id: string, data: Partial<LanguageItem>) => void;
    removeLanguage: (id: string) => void;

    // Custom sections
    addCustomSection: (title?: string) => void;
    updateCustomSectionTitle: (sectionId: string, title: string) => void;
    removeCustomSection: (sectionId: string) => void;
    addCustomSectionItem: (sectionId: string) => void;
    updateCustomSectionItem: (sectionId: string, itemId: string, data: Partial<CustomSection["items"][0]>) => void;
    removeCustomSectionItem: (sectionId: string, itemId: string) => void;

    // Section ordering & visibility
    reorderSections: (newOrder: SectionKey[]) => void;
    toggleSectionVisibility: (sectionKey: SectionKey) => void;

    // Design, template, typography & page settings
    setTemplate: (templateId: string) => void;
    updatePageSettings: (settings: Partial<PageSettings>) => void;
    setFontFamily: (font: TypographyFamily) => void;
    setFontScale: (scale: number) => void;
}

const MAX_HISTORY = 30;
let historyTimer: NodeJS.Timeout | null = null;

const recordHistory = (
    currentData: ResumeData,
    past: ResumeData[]
): { past: ResumeData[]; future: ResumeData[] } => {
    const trimmedPast = past.length >= MAX_HISTORY ? past.slice(past.length - MAX_HISTORY + 1) : past;
    return {
        past: [...trimmedPast, JSON.parse(JSON.stringify(currentData))],
        future: [],
    };
};

const initialResumes: Record<string, ResumeData> = {
    ...SAMPLE_RESUMES,
};
const defaultActiveId = "software-engineer";

export const useResumeStore = create<ResumeStoreState>()(
    persist(
        (set, get) => ({
            resumes: initialResumes,
            activeResumeId: defaultActiveId,
            resumeData: initialResumes[defaultActiveId] || createEmptyResume(),

            past: [],
            future: [],
            canUndo: false,
            canRedo: false,

            saveStatus: "saved",
            lastSaved: null,

            zoom: 0.85,
            previewMode: "edit",
            isAiOpen: false,
            isJdModalOpen: false,
            isCommandPaletteOpen: false,
            isManagerOpen: false,
            isSettingsOpen: false,
            targetJobDescription: "",

            setTargetJobDescription: (jd) => set({ targetJobDescription: jd }),
            setZoom: (zoom) => set({ zoom }),
            setPreviewMode: (mode) => set({ previewMode: mode }),
            setAiOpen: (open) => set({ isAiOpen: open }),
            setJdModalOpen: (open) => set({ isJdModalOpen: open }),
            setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
            setManagerOpen: (open) => set({ isManagerOpen: open }),
            setSettingsOpen: (open) => set({ isSettingsOpen: open }),

            undo: () => {
                const { past, future, resumeData, resumes, activeResumeId } = get();
                if (past.length === 0) return;

                const previous = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);
                const newFuture = [JSON.parse(JSON.stringify(resumeData)), ...future];

                set({
                    resumeData: previous,
                    resumes: { ...resumes, [activeResumeId]: previous },
                    past: newPast,
                    future: newFuture,
                    canUndo: newPast.length > 0,
                    canRedo: true,
                    saveStatus: "saved",
                });
            },

            redo: () => {
                const { past, future, resumeData, resumes, activeResumeId } = get();
                if (future.length === 0) return;

                const next = future[0];
                const newFuture = future.slice(1);
                const newPast = [...past, JSON.parse(JSON.stringify(resumeData))];

                set({
                    resumeData: next,
                    resumes: { ...resumes, [activeResumeId]: next },
                    past: newPast,
                    future: newFuture,
                    canUndo: true,
                    canRedo: newFuture.length > 0,
                    saveStatus: "saved",
                });
            },

            switchResume: (id) => {
                const { resumes } = get();
                if (!resumes[id]) return;
                set({
                    activeResumeId: id,
                    resumeData: resumes[id],
                    past: [],
                    future: [],
                    canUndo: false,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            createResume: (title = "Untitled Resume") => {
                const id = "resume-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
                const newResume = createEmptyResume(id, title);
                const { resumes } = get();
                set({
                    resumes: { ...resumes, [id]: newResume },
                    activeResumeId: id,
                    resumeData: newResume,
                    past: [],
                    future: [],
                    canUndo: false,
                    canRedo: false,
                    saveStatus: "saved",
                });
                return id;
            },

            duplicateResume: (idToDup) => {
                const { resumes, activeResumeId } = get();
                const targetId = idToDup || activeResumeId;
                const source = resumes[targetId] || get().resumeData;
                const newId = "resume-" + Date.now().toString(36);
                const duplicated: ResumeData = {
                    ...JSON.parse(JSON.stringify(source)),
                    id: newId,
                    title: `${source.title} (Copy)`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set({
                    resumes: { ...resumes, [newId]: duplicated },
                    activeResumeId: newId,
                    resumeData: duplicated,
                    past: [],
                    future: [],
                    canUndo: false,
                    canRedo: false,
                    saveStatus: "saved",
                });
                return newId;
            },

            renameResume: (id, newTitle) => {
                const { resumes, activeResumeId, resumeData } = get();
                if (!resumes[id]) return;
                const updated = { ...resumes[id], title: newTitle, updatedAt: new Date().toISOString() };
                set({
                    resumes: { ...resumes, [id]: updated },
                    resumeData: id === activeResumeId ? updated : resumeData,
                    saveStatus: "saved",
                });
            },

            deleteResume: (id) => {
                const { resumes, activeResumeId } = get();
                const resumeKeys = Object.keys(resumes);
                if (resumeKeys.length <= 1) {
                    alert("You must keep at least one resume. You can create a new resume before deleting this one.");
                    return;
                }
                const updatedResumes = { ...resumes };
                delete updatedResumes[id];

                const nextId = id === activeResumeId ? Object.keys(updatedResumes)[0] : activeResumeId;
                set({
                    resumes: updatedResumes,
                    activeResumeId: nextId,
                    resumeData: updatedResumes[nextId],
                    past: [],
                    future: [],
                    canUndo: false,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            loadSampleResume: (key) => {
                const sample = SAMPLE_RESUMES[key];
                if (!sample) return;
                const { resumes, activeResumeId } = get();
                const updatedResume: ResumeData = {
                    ...JSON.parse(JSON.stringify(sample)),
                    id: activeResumeId,
                    title: resumes[activeResumeId]?.title || sample.title,
                    updatedAt: new Date().toISOString(),
                };
                set({
                    resumes: { ...resumes, [activeResumeId]: updatedResume },
                    resumeData: updatedResume,
                    past: [],
                    future: [],
                    canUndo: false,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            resetActiveResume: () => {
                const { activeResumeId, resumes } = get();
                const blank = createEmptyResume(activeResumeId, resumes[activeResumeId]?.title || "Fresh Resume");
                set({
                    resumes: { ...resumes, [activeResumeId]: blank },
                    resumeData: blank,
                    past: [],
                    future: [],
                    canUndo: false,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            importResumeJson: (jsonString: string) => {
                try {
                    const parsed = JSON.parse(jsonString);
                    if (!parsed || typeof parsed !== "object") {
                        return { success: false, error: "Invalid JSON format." };
                    }
                    if (!parsed.personalInfo || typeof parsed.personalInfo !== "object") {
                        return { success: false, error: "Missing required 'personalInfo' object." };
                    }

                    const id = "imported-" + Date.now().toString(36);
                    const safeResume: ResumeData = {
                        ...createEmptyResume(id, parsed.title || "Imported Resume"),
                        ...parsed,
                        id,
                        updatedAt: new Date().toISOString(),
                    };

                    const { resumes } = get();
                    set({
                        resumes: { ...resumes, [id]: safeResume },
                        activeResumeId: id,
                        resumeData: safeResume,
                        past: [],
                        future: [],
                        canUndo: false,
                        canRedo: false,
                        saveStatus: "saved",
                    });
                    return { success: true };
                } catch (err: any) {
                    return { success: false, error: err.message || "Failed to parse JSON." };
                }
            },

            exportResumeJson: () => {
                const { resumeData } = get();
                return JSON.stringify(resumeData, null, 2);
            },

            // Helper to mutate active resume with debounced undo history
            updatePersonalInfo: (data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    personalInfo: { ...currentData.personalInfo, ...data },
                };

                // Debounce history snapshot
                if (historyTimer) clearTimeout(historyTimer);
                historyTimer = setTimeout(() => {
                    const { past } = get();
                    const hist = recordHistory(currentData, past);
                    set({ past: hist.past, future: hist.future, canUndo: true, canRedo: false });
                }, 800);

                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                    lastSaved: new Date().toLocaleTimeString(),
                });
            },

            updateSummary: (summary) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    summary,
                    updatedAt: new Date().toISOString(),
                };

                if (historyTimer) clearTimeout(historyTimer);
                historyTimer = setTimeout(() => {
                    const { past } = get();
                    const hist = recordHistory(currentData, past);
                    set({ past: hist.past, future: hist.future, canUndo: true, canRedo: false });
                }, 800);

                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                    lastSaved: new Date().toLocaleTimeString(),
                });
            },

            addExperience: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: ExperienceItem = {
                    id: "exp-" + Date.now().toString(36),
                    company: "",
                    position: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                    achievements: [],
                };
                const hist = recordHistory(currentData, state.past);
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    experience: [newItem, ...currentData.experience],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    past: hist.past,
                    future: hist.future,
                    canUndo: true,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            updateExperience: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    experience: currentData.experience.map((e) => (e.id === id ? { ...e, ...data } : e)),
                };

                if (historyTimer) clearTimeout(historyTimer);
                historyTimer = setTimeout(() => {
                    const { past } = get();
                    const hist = recordHistory(currentData, past);
                    set({ past: hist.past, future: hist.future, canUndo: true, canRedo: false });
                }, 800);

                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeExperience: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const hist = recordHistory(currentData, state.past);
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    experience: currentData.experience.filter((e) => e.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    past: hist.past,
                    future: hist.future,
                    canUndo: true,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            reorderExperience: (startIndex, endIndex) => {
                const state = get();
                const currentData = state.resumeData;
                const items = [...currentData.experience];
                const [removed] = items.splice(startIndex, 1);
                items.splice(endIndex, 0, removed);

                const hist = recordHistory(currentData, state.past);
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    experience: items,
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    past: hist.past,
                    future: hist.future,
                    canUndo: true,
                    canRedo: false,
                });
            },

            addEducation: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: EducationItem = {
                    id: "edu-" + Date.now().toString(36),
                    school: "",
                    degree: "",
                    field: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    gpa: "",
                    coursework: [],
                    achievements: [],
                };
                const hist = recordHistory(currentData, state.past);
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    education: [...currentData.education, newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    past: hist.past,
                    future: hist.future,
                    canUndo: true,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            updateEducation: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    education: currentData.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeEducation: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const hist = recordHistory(currentData, state.past);
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    education: currentData.education.filter((e) => e.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    past: hist.past,
                    future: hist.future,
                    canUndo: true,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            reorderEducation: (startIndex, endIndex) => {
                const state = get();
                const currentData = state.resumeData;
                const items = [...currentData.education];
                const [removed] = items.splice(startIndex, 1);
                items.splice(endIndex, 0, removed);
                const nextData: ResumeData = { ...currentData, education: items };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },

            addSkill: (category = "technical") => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: SkillItem = {
                    id: "sk-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
                    name: "",
                    category,
                    level: "Intermediate",
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    skills: [...currentData.skills, newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updateSkill: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    skills: currentData.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeSkill: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    skills: currentData.skills.filter((s) => s.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            addProject: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: ProjectItem = {
                    id: "proj-" + Date.now().toString(36),
                    name: "",
                    description: "",
                    technologies: [],
                    link: "",
                    githubUrl: "",
                    achievements: [],
                };
                const hist = recordHistory(currentData, state.past);
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    projects: [...currentData.projects, newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    past: hist.past,
                    future: hist.future,
                    canUndo: true,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            updateProject: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    projects: currentData.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeProject: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const hist = recordHistory(currentData, state.past);
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    projects: currentData.projects.filter((p) => p.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    past: hist.past,
                    future: hist.future,
                    canUndo: true,
                    canRedo: false,
                    saveStatus: "saved",
                });
            },

            reorderProjects: (startIndex, endIndex) => {
                const state = get();
                const currentData = state.resumeData;
                const items = [...currentData.projects];
                const [removed] = items.splice(startIndex, 1);
                items.splice(endIndex, 0, removed);
                const nextData: ResumeData = { ...currentData, projects: items };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },

            addCertification: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: CertificationItem = {
                    id: "cert-" + Date.now().toString(36),
                    name: "",
                    issuer: "",
                    date: "",
                    credentialId: "",
                    url: "",
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    certifications: [...(currentData.certifications || []), newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updateCertification: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    certifications: (currentData.certifications || []).map((c) =>
                        c.id === id ? { ...c, ...data } : c
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeCertification: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    certifications: (currentData.certifications || []).filter((c) => c.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            addAchievement: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: AchievementItem = {
                    id: "ach-" + Date.now().toString(36),
                    title: "",
                    description: "",
                    date: "",
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    achievements: [...(currentData.achievements || []), newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updateAchievement: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    achievements: (currentData.achievements || []).map((a) =>
                        a.id === id ? { ...a, ...data } : a
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeAchievement: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    achievements: (currentData.achievements || []).filter((a) => a.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            addPublication: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: PublicationItem = {
                    id: "pub-" + Date.now().toString(36),
                    title: "",
                    publisher: "",
                    date: "",
                    url: "",
                    description: "",
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    publications: [...(currentData.publications || []), newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updatePublication: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    publications: (currentData.publications || []).map((p) =>
                        p.id === id ? { ...p, ...data } : p
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removePublication: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    publications: (currentData.publications || []).filter((p) => p.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            addVolunteering: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: VolunteeringItem = {
                    id: "vol-" + Date.now().toString(36),
                    organization: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    volunteering: [...(currentData.volunteering || []), newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updateVolunteering: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    volunteering: (currentData.volunteering || []).map((v) =>
                        v.id === id ? { ...v, ...data } : v
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeVolunteering: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    volunteering: (currentData.volunteering || []).filter((v) => v.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            addLanguage: () => {
                const state = get();
                const currentData = state.resumeData;
                const newItem: LanguageItem = {
                    id: "lang-" + Date.now().toString(36),
                    language: "",
                    proficiency: "Conversational",
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    languages: [...(currentData.languages || []), newItem],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updateLanguage: (id, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    languages: (currentData.languages || []).map((l) =>
                        l.id === id ? { ...l, ...data } : l
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeLanguage: (id) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    languages: (currentData.languages || []).filter((l) => l.id !== id),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            addCustomSection: (title = "Additional Information") => {
                const state = get();
                const currentData = state.resumeData;
                const newSection: CustomSection = {
                    id: "custom-" + Date.now().toString(36),
                    title,
                    items: [
                        {
                            id: "item-" + Date.now().toString(36),
                            title: "",
                            subtitle: "",
                            date: "",
                            description: "",
                        },
                    ],
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    customSections: [...(currentData.customSections || []), newSection],
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updateCustomSectionTitle: (sectionId, title) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    customSections: (currentData.customSections || []).map((s) =>
                        s.id === sectionId ? { ...s, title } : s
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeCustomSection: (sectionId) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    customSections: (currentData.customSections || []).filter((s) => s.id !== sectionId),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            addCustomSectionItem: (sectionId) => {
                const state = get();
                const currentData = state.resumeData;
                const newItem = {
                    id: "citem-" + Date.now().toString(36),
                    title: "",
                    subtitle: "",
                    date: "",
                    description: "",
                };
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    customSections: (currentData.customSections || []).map((s) =>
                        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            updateCustomSectionItem: (sectionId, itemId, data) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    customSections: (currentData.customSections || []).map((s) =>
                        s.id === sectionId
                            ? {
                                  ...s,
                                  items: s.items.map((it) => (it.id === itemId ? { ...it, ...data } : it)),
                              }
                            : s
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            removeCustomSectionItem: (sectionId, itemId) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    updatedAt: new Date().toISOString(),
                    customSections: (currentData.customSections || []).map((s) =>
                        s.id === sectionId
                            ? { ...s, items: s.items.filter((it) => it.id !== itemId) }
                            : s
                    ),
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                    saveStatus: "saved",
                });
            },

            reorderSections: (newOrder) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = { ...currentData, sectionOrder: newOrder };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },

            toggleSectionVisibility: (sectionKey) => {
                const state = get();
                const currentData = state.resumeData;
                const hidden = currentData.hiddenSections || [];
                const isHidden = hidden.includes(sectionKey);
                const nextHidden = isHidden
                    ? hidden.filter((k) => k !== sectionKey)
                    : [...hidden, sectionKey];

                const nextData: ResumeData = { ...currentData, hiddenSections: nextHidden };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },

            setTemplate: (templateId) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = { ...currentData, templateId };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },

            updatePageSettings: (settings) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    pageSettings: { ...currentData.pageSettings, ...settings },
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },

            setFontFamily: (fontFamily) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    pageSettings: { ...currentData.pageSettings, fontFamily },
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },

            setFontScale: (fontScale) => {
                const state = get();
                const currentData = state.resumeData;
                const nextData: ResumeData = {
                    ...currentData,
                    pageSettings: { ...currentData.pageSettings, fontScale },
                };
                set({
                    resumeData: nextData,
                    resumes: { ...state.resumes, [state.activeResumeId]: nextData },
                });
            },
        }),
        {
            name: "ai-career-studio-resumes-v2",
            partialize: (state) => ({
                resumes: state.resumes,
                activeResumeId: state.activeResumeId,
                targetJobDescription: state.targetJobDescription,
            }),
        }
    )
);
