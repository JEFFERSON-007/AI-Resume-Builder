import { ResumeData } from "@/types/resume";

export interface AtsCategoryScore {
    name: string;
    score: number;
    maxScore: number;
    status: "good" | "fair" | "needs-work";
    suggestions: string[];
}

export interface AtsReport {
    totalScore: number;
    matchLabel: "Needs Work" | "Moderate" | "Strong" | "Exceptional";
    categories: {
        contact: AtsCategoryScore;
        summary: AtsCategoryScore;
        experience: AtsCategoryScore;
        skills: AtsCategoryScore;
        education: AtsCategoryScore;
        projectsAndCerts: AtsCategoryScore;
    };
    overallSuggestions: string[];
    formatFlags: string[];
    detectedActionVerbs: string[];
    quantifiedMetricsCount: number;
    jdMatch?: {
        matchScore: number;
        foundKeywords: string[];
        missingKeywords: string[];
        coveragePercentage: number;
    };
}

const ACTION_VERBS = [
    "accelerated", "achieved", "administered", "analyzed", "architected",
    "automated", "built", "centralized", "championed", "collaborated",
    "configured", "consolidated", "constructed", "coordinated", "created",
    "debugged", "decreased", "delivered", "deployed", "designed",
    "developed", "devised", "diminished", "directed", "documented",
    "doubled", "drafted", "drove", "engineered", "enhanced",
    "established", "evaluated", "executed", "expanded", "expedited",
    "facilitated", "formulated", "founded", "generated", "guided",
    "halted", "headed", "identified", "implemented", "improved",
    "increased", "initiated", "innovated", "inspected", "installed",
    "instituted", "integrated", "introduced", "invented", "investigated",
    "launched", "led", "managed", "maximized", "mentored",
    "migrated", "minimized", "modeled", "modernized", "monitored",
    "negotiated", "optimized", "orchestrated", "organized", "overhauled",
    "oversaw", "partnered", "pioneered", "planned", "prepared",
    "produced", "programmed", "published", "rearchitected", "rebuilt",
    "reduced", "refined", "refactored", "remodeled", "reorganized",
    "resolved", "restructured", "revamped", "saved", "scaled",
    "scheduled", "secured", "simplified", "solved", "spearheaded",
    "standardized", "streamlined", "strengthened", "structured", "supervised",
    "surpassed", "synthesized", "systematized", "tested", "tracked",
    "trained", "transformed", "tripled", "troubleshot", "unified",
    "upgraded", "validated", "verified", "yielded"
];

const COMMON_STOP_WORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can", "cannot", "could", "did", "do",
    "does", "doing", "don't", "down", "during", "each", "few", "for", "from", "further",
    "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself",
    "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of",
    "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "should", "so", "some", "such",
    "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
    "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "we", "were", "what", "when", "where", "which", "while", "who",
    "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves",
    "will", "shall", "work", "experience", "role", "candidate", "responsibilities",
    "required", "preferred", "years", "qualification", "qualifications", "must", "ability"
]);

export function calculateAtsScore(resume: ResumeData, jobDescriptionText = ""): AtsReport {
    const contactScore = evalContact(resume.personalInfo);
    const summaryScore = evalSummary(resume.summary, resume.personalInfo.jobTitle);
    const expScore = evalExperience(resume.experience, resume.skills);
    const skillsScore = evalSkills(resume.skills);
    const eduScore = evalEducation(resume.education);
    const projCertsScore = evalProjectsAndCerts(resume.projects, resume.certifications);

    const totalRaw =
        contactScore.score +
        summaryScore.score +
        expScore.score +
        skillsScore.score +
        eduScore.score +
        projCertsScore.score;

    const totalScore = Math.min(100, Math.round(totalRaw));

    let matchLabel: AtsReport["matchLabel"] = "Needs Work";
    if (totalScore >= 88) matchLabel = "Exceptional";
    else if (totalScore >= 75) matchLabel = "Strong";
    else if (totalScore >= 55) matchLabel = "Moderate";

    // Format hazards check
    const formatFlags: string[] = [];
    if (!resume.personalInfo.fullName.trim()) formatFlags.push("Candidate name is missing from header.");
    if (!resume.personalInfo.email.trim()) formatFlags.push("Direct contact email is missing.");
    if (resume.experience.length === 0) formatFlags.push("No work experience entries listed.");
    if (resume.skills.length < 5) formatFlags.push("Fewer than 5 skills listed; keyword indexability is weak.");
    if (resume.summary.length > 800) formatFlags.push("Summary is excessively long (>800 chars); keep it concise.");

    // Aggregated suggestions
    const overallSuggestions = [
        ...contactScore.suggestions,
        ...summaryScore.suggestions,
        ...expScore.suggestions,
        ...skillsScore.suggestions,
        ...projCertsScore.suggestions,
        ...eduScore.suggestions,
    ].slice(0, 6);

    // Optional Job Description matching
    let jdMatch: AtsReport["jdMatch"] = undefined;
    if (jobDescriptionText.trim()) {
        jdMatch = evaluateJobDescriptionMatch(resume, jobDescriptionText);
    }

    return {
        totalScore,
        matchLabel,
        categories: {
            contact: contactScore,
            summary: summaryScore,
            experience: expScore,
            skills: skillsScore,
            education: eduScore,
            projectsAndCerts: projCertsScore,
        },
        overallSuggestions,
        formatFlags,
        detectedActionVerbs: expScore.detectedVerbs,
        quantifiedMetricsCount: expScore.metricsCount,
        jdMatch,
    };
}

function evalContact(info: ResumeData["personalInfo"]): AtsCategoryScore {
    let score = 0;
    const maxScore = 15;
    const suggestions: string[] = [];

    if (info.fullName && info.fullName.trim().length > 1) score += 3;
    else suggestions.push("Add your full name in the header.");

    if (info.email && info.email.includes("@")) score += 3;
    else suggestions.push("Include a professional email address.");

    if (info.phone && info.phone.trim().length > 6) score += 3;
    else suggestions.push("Add a reliable phone number.");

    if (info.location && info.location.trim().length > 2) score += 3;
    else suggestions.push("Add your location (City, State / Country).");

    if (info.linkedin || info.github || info.website) score += 3;
    else suggestions.push("Link your LinkedIn or GitHub profile.");

    return {
        name: "Contact Information",
        score,
        maxScore,
        status: score >= 12 ? "good" : score >= 8 ? "fair" : "needs-work",
        suggestions,
    };
}

function evalSummary(summary: string, jobTitle: string): AtsCategoryScore {
    let score = 0;
    const maxScore = 15;
    const suggestions: string[] = [];
    const text = summary ? summary.trim() : "";
    const words = text ? text.split(/\s+/).filter(Boolean) : [];

    if (words.length >= 35 && words.length <= 110) {
        score += 10;
    } else if (words.length > 0) {
        score += 5;
        if (words.length < 35) suggestions.push("Summary is too short. Aim for 35 to 80 impactful words.");
        else suggestions.push("Summary is slightly wordy. Condense to 3-4 tight sentences.");
    } else {
        suggestions.push("Add a professional summary highlighting core strengths.");
    }

    if (jobTitle && text.toLowerCase().includes(jobTitle.toLowerCase())) {
        score += 5;
    } else if (text) {
        suggestions.push(`Include your target title '${jobTitle || "Job Title"}' in your summary.`);
    }

    return {
        name: "Professional Summary",
        score,
        maxScore,
        status: score >= 12 ? "good" : score >= 7 ? "fair" : "needs-work",
        suggestions,
    };
}

function evalExperience(
    experiences: ResumeData["experience"],
    skills: ResumeData["skills"]
): AtsCategoryScore & { detectedVerbs: string[]; metricsCount: number } {
    let score = 0;
    const maxScore = 30;
    const suggestions: string[] = [];

    if (experiences.length === 0) {
        return {
            name: "Work Experience",
            score: 0,
            maxScore,
            status: "needs-work",
            suggestions: ["Add your professional work history."],
            detectedVerbs: [],
            metricsCount: 0,
        };
    }

    score += Math.min(10, experiences.length * 5);

    const allText = experiences
        .map((e) => `${e.position} ${e.description} ${(e.achievements || []).join(" ")}`)
        .join(" ")
        .toLowerCase();

    // Check action verbs
    const detectedVerbs = ACTION_VERBS.filter((verb) => allText.includes(verb));
    if (detectedVerbs.length >= 4) score += 8;
    else if (detectedVerbs.length >= 2) score += 4;
    else suggestions.push("Start bullet points with strong action verbs (e.g., 'Architected', 'Spearheaded').");

    // Check quantified metrics (% / $ / numbers / reduction / increase)
    const metricMatches = allText.match(/(\d+[\.\d]*\s*(%|\$|k|m|x|ms|s|users|clients|engineers)?)/g) || [];
    const metricsCount = metricMatches.length;
    if (metricsCount >= 3) score += 8;
    else if (metricsCount >= 1) score += 4;
    else suggestions.push("Quantify your achievements with numbers or percentages (e.g. 'Reduced latency by 30%').");

    // Check skill integration into experience
    const skillNames = skills.map((s) => s.name.toLowerCase()).filter((s) => s.length > 2);
    const integratedSkills = skillNames.filter((sk) => allText.includes(sk));
    if (integratedSkills.length >= 3) score += 4;
    else suggestions.push("Mention your primary skills directly in your work descriptions.");

    return {
        name: "Work Experience",
        score: Math.min(maxScore, score),
        maxScore,
        status: score >= 24 ? "good" : score >= 15 ? "fair" : "needs-work",
        suggestions,
        detectedVerbs,
        metricsCount,
    };
}

function evalSkills(skills: ResumeData["skills"]): AtsCategoryScore {
    let score = 0;
    const maxScore = 20;
    const suggestions: string[] = [];

    if (skills.length === 0) {
        return {
            name: "Skills & Keywords",
            score: 0,
            maxScore,
            status: "needs-work",
            suggestions: ["List your core technical and domain skills."],
        };
    }

    if (skills.length >= 10) score += 15;
    else if (skills.length >= 6) score += 10;
    else {
        score += 5;
        suggestions.push("Include 8-15 technical skills to enhance keyword matching.");
    }

    // Reward skill categorization
    const categories = new Set(skills.map((s) => s.category || "technical"));
    if (categories.size >= 2) score += 5;
    else suggestions.push("Organize skills by category (Languages, Cloud, Databases, Tools).");

    return {
        name: "Skills & Keywords",
        score: Math.min(maxScore, score),
        maxScore,
        status: score >= 16 ? "good" : score >= 10 ? "fair" : "needs-work",
        suggestions,
    };
}

function evalEducation(education: ResumeData["education"]): AtsCategoryScore {
    let score = 0;
    const maxScore = 10;
    const suggestions: string[] = [];

    if (education.length === 0) {
        return {
            name: "Education",
            score: 0,
            maxScore,
            status: "needs-work",
            suggestions: ["Add your degree, school name, and graduation dates."],
        };
    }

    const first = education[0];
    if (first.school && first.degree) score += 7;
    if (first.field) score += 3;

    return {
        name: "Education",
        score: Math.min(maxScore, score),
        maxScore,
        status: score >= 8 ? "good" : "fair",
        suggestions,
    };
}

function evalProjectsAndCerts(
    projects: ResumeData["projects"],
    certifications: ResumeData["certifications"]
): AtsCategoryScore {
    let score = 0;
    const maxScore = 10;
    const suggestions: string[] = [];

    const hasProjects = (projects || []).length > 0;
    const hasCerts = (certifications || []).length > 0;

    if (hasProjects) score += 6;
    else suggestions.push("Add 1-2 portfolio projects demonstrating hands-on expertise.");

    if (hasCerts) score += 4;
    else suggestions.push("Add industry certifications to validate your skills.");

    return {
        name: "Projects & Certifications",
        score: Math.min(maxScore, score),
        maxScore,
        status: score >= 8 ? "good" : score >= 4 ? "fair" : "needs-work",
        suggestions,
    };
}

export function evaluateJobDescriptionMatch(resume: ResumeData, jobDescription: string) {
    // Extract keywords from job description
    const jdTokens = jobDescription
        .toLowerCase()
        .replace(/[^a-z0-9#+.\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2 && !COMMON_STOP_WORDS.has(t));

    // Calculate word frequency in JD to find top terms
    const freqMap: Record<string, number> = {};
    for (const token of jdTokens) {
        freqMap[token] = (freqMap[token] || 0) + 1;
    }

    const topJdTerms = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([word]) => word);

    // Build resume text token collection
    const resumeText = [
        resume.personalInfo.jobTitle,
        resume.summary,
        ...resume.skills.map((s) => s.name),
        ...resume.experience.map((e) => `${e.position} ${e.company} ${e.description} ${(e.achievements || []).join(" ")}`),
        ...resume.projects.map((p) => `${p.name} ${p.description} ${(p.technologies || []).join(" ")}`),
        ...resume.education.map((ed) => `${ed.degree} ${ed.field} ${ed.school}`),
        ...(resume.certifications || []).map((c) => `${c.name} ${c.issuer}`),
    ]
        .join(" ")
        .toLowerCase();

    const foundKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const term of topJdTerms) {
        if (resumeText.includes(term)) {
            foundKeywords.push(term);
        } else {
            missingKeywords.push(term);
        }
    }

    const coveragePercentage = topJdTerms.length > 0
        ? Math.round((foundKeywords.length / topJdTerms.length) * 100)
        : 100;

    return {
        matchScore: coveragePercentage,
        foundKeywords: foundKeywords.slice(0, 15),
        missingKeywords: missingKeywords.slice(0, 15),
        coveragePercentage,
    };
}
