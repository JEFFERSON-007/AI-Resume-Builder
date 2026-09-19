import { ResumeData } from "@/types/resume";
import { calculateAtsScore as calculateNewAtsScore, AtsReport } from "@/lib/ats/ats-analyzer";

export interface ScoreCategory {
    score: number;
    maxScore: number;
    suggestions: string[];
}

export interface DetailedScore {
    totalScore: number;
    categories: {
        contact: ScoreCategory;
        summary: ScoreCategory;
        experience: ScoreCategory;
        skills: ScoreCategory;
        education: ScoreCategory;
        projects: ScoreCategory;
    };
    overallSuggestions: string[];
}

/**
 * Backwards compatibility wrapper around the V2 ATS Analyzer
 */
export function calculateAtsScore(data: ResumeData): DetailedScore {
    const report: AtsReport = calculateNewAtsScore(data);
    return {
        totalScore: report.totalScore,
        categories: {
            contact: {
                score: report.categories.contact.score,
                maxScore: report.categories.contact.maxScore,
                suggestions: report.categories.contact.suggestions,
            },
            summary: {
                score: report.categories.summary.score,
                maxScore: report.categories.summary.maxScore,
                suggestions: report.categories.summary.suggestions,
            },
            experience: {
                score: report.categories.experience.score,
                maxScore: report.categories.experience.maxScore,
                suggestions: report.categories.experience.suggestions,
            },
            skills: {
                score: report.categories.skills.score,
                maxScore: report.categories.skills.maxScore,
                suggestions: report.categories.skills.suggestions,
            },
            education: {
                score: report.categories.education.score,
                maxScore: report.categories.education.maxScore,
                suggestions: report.categories.education.suggestions,
            },
            projects: {
                score: report.categories.projectsAndCerts.score,
                maxScore: report.categories.projectsAndCerts.maxScore,
                suggestions: report.categories.projectsAndCerts.suggestions,
            },
        },
        overallSuggestions: report.overallSuggestions,
    };
}
