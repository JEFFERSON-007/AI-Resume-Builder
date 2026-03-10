import { ResumeData } from "@/lib/store";

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

export function calculateAtsScore(data: ResumeData): DetailedScore {
    const categories = {
        contact: calculateContactScore(data.personalInfo),
        summary: calculateSummaryScore(data.summary),
        experience: calculateExperienceScore(data.experience),
        skills: calculateSkillsScore(data.skills),
        education: calculateEducationScore(data.education),
        projects: calculateProjectsScore(data.projects),
    };

    const totalScore = Math.round(
        categories.contact.score +
        categories.summary.score +
        categories.experience.score +
        categories.skills.score +
        categories.education.score +
        categories.projects.score
    );

    const overallSuggestions = Object.values(categories)
        .flatMap(cat => cat.suggestions)
        .slice(0, 5); // Limit to top 5 suggestions

    return {
        totalScore,
        categories,
        overallSuggestions,
    };
}

function calculateContactScore(info: ResumeData['personalInfo']): ScoreCategory {
    let score = 0;
    const maxScore = 15;
    const suggestions: string[] = [];

    if (info.fullName) score += 3; else suggestions.push("Add your full name.");
    if (info.email) {
        score += 3;
        if (!info.email.includes("@")) suggestions.push("Provide a valid email address.");
    } else suggestions.push("Add an email address.");
    if (info.phone) score += 3; else suggestions.push("Add a phone number.");
    if (info.location) score += 3; else suggestions.push("Add your location (City, State/Country).");
    if (info.jobTitle) score += 3; else suggestions.push("Add a professional job title.");

    return { score, maxScore, suggestions };
}

function calculateSummaryScore(summary: string): ScoreCategory {
    let score = 0;
    const maxScore = 10;
    const suggestions: string[] = [];

    const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;

    if (wordCount >= 30 && wordCount <= 80) {
        score = 10;
    } else if (wordCount > 0) {
        score = 5;
        if (wordCount < 30) suggestions.push("Your professional summary is a bit short. Aim for 30-80 words.");
        if (wordCount > 80) suggestions.push("Your professional summary is quite long. Try to keep it concise (under 80 words).");
    } else {
        suggestions.push("Add a professional summary to highlight your key strengths.");
    }

    return { score, maxScore, suggestions };
}

function calculateExperienceScore(experience: ResumeData['experience']): ScoreCategory {
    let score = 0;
    const maxScore = 30;
    const suggestions: string[] = [];

    if (experience.length === 0) {
        suggestions.push("Add your work experience to build professional credibility.");
        return { score, maxScore, suggestions };
    }

    // Score based on count
    score += Math.min(experience.length * 5, 10);

    // Score based on descriptions
    let totalDescLength = 0;
    let hasActionVerbs = false;
    const actionVerbs = ["managed", "developed", "led", "increased", "created", "spearheaded", "implemented", "designed"];

    experience.forEach(exp => {
        totalDescLength += exp.description.length;
        if (actionVerbs.some(verb => exp.description.toLowerCase().includes(verb))) {
            hasActionVerbs = true;
        }
    });

    if (totalDescLength > 200) score += 10;
    else suggestions.push("Explain your roles in more detail using bullet points.");

    if (hasActionVerbs) score += 10;
    else suggestions.push("Use strong action verbs like 'Managed', 'Developed', or 'Led' in your descriptions.");

    return { score: Math.min(score, maxScore), maxScore, suggestions };
}

function calculateSkillsScore(skills: ResumeData['skills']): ScoreCategory {
    let score = 0;
    const maxScore = 20;
    const suggestions: string[] = [];

    if (skills.length === 0) {
        suggestions.push("List your technical and soft skills.");
        return { score, maxScore, suggestions };
    }

    score = Math.min(skills.length * 2, 20);

    if (skills.length < 5) {
        suggestions.push("Add at least 5-10 relevant skills to improve keyword matching.");
    }

    return { score, maxScore, suggestions };
}

function calculateEducationScore(education: ResumeData['education']): ScoreCategory {
    let score = 0;
    const maxScore = 15;
    const suggestions: string[] = [];

    if (education.length === 0) {
        suggestions.push("Add your educational background.");
        return { score, maxScore, suggestions };
    }

    education.forEach(edu => {
        if (edu.school && edu.degree) score += 7.5;
    });

    return { score: Math.min(score, maxScore), maxScore, suggestions };
}

function calculateProjectsScore(projects: ResumeData['projects']): ScoreCategory {
    let score = 0;
    const maxScore = 10;
    const suggestions: string[] = [];

    if (projects.length === 0) {
        suggestions.push("Add some projects to showcase your practical skills.");
        return { score, maxScore, suggestions };
    }

    score = Math.min(projects.length * 5, 10);

    return { score, maxScore, suggestions };
}
