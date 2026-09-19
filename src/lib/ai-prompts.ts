export const AI_PROMPTS = {
    summary: (role: string, experienceContext: string, level = "mid-senior") => `
You are an expert ATS and career specialist.
Generate a concise, high-impact professional summary for a candidate targeting the role of: "${role}".
Target Career Level: ${level}.

CANDIDATE CONTEXT (Use ONLY the following factual context provided by the candidate):
${experienceContext ? experienceContext : "The candidate is targeting this role and transitioning with foundational technical and organizational skills."}

CRITICAL RULES:
1. NEVER invent companies, degrees, credentials, specific projects, or numbers that are not provided in the context above.
2. Keep it between 3 to 4 sentences (approximately 40-70 words).
3. Emphasize verified technical capabilities, leadership, and problem-solving.
4. Output ONLY the summary paragraph text with no introductory pleasantries, markdown headings, or quotation marks.
`,

    improveBullet: (bullet: string, role?: string) => `
You are an executive resume editor.
Improve the following resume bullet point to adhere strictly to the professional "Action + Task + Technology + Result" framework:

ORIGINAL BULLET:
"${bullet}"
${role ? `TARGET ROLE CONTEXT: ${role}` : ""}

STRICT TRUTHFULNESS RULES:
1. Base the revision ONLY on the facts present in the original bullet point.
2. DO NOT fabricate metrics, percentages, dollar amounts, team sizes, or specific performance gains that are not in the original text.
3. If an outcome or metric is missing, use strong action verbs (e.g. "Architected", "Engineered", "Spearheaded", "Optimized") and append "[Add measurable outcome if known]" at the end.
4. Provide exactly 2 distinct variations:
   - Variation 1: Direct & Concise
   - Variation 2: Impact & Architecture Focused
5. Format your response strictly as valid JSON:
{
  "variation1": "string",
  "variation2": "string",
  "recommendedActionVerb": "string"
}
`,

    analyzeJobDescription: (jobDescription: string) => `
You are an ATS parser and recruitment intelligence engine.
Analyze the following Job Description (JD) and extract structured requirements:

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 5000)}
"""

Extract the information accurately. Do not extrapolate unsupported skills.
Format your output strictly as a JSON object:
{
  "jobTitle": "Extracted or inferred target job title",
  "experienceLevel": "Entry / Mid / Senior / Lead / Executive",
  "requiredSkills": ["Skill 1", "Skill 2"],
  "preferredSkills": ["Skill 1", "Skill 2"],
  "technologies": ["Tech 1", "Tech 2"],
  "certifications": ["Cert 1", "Cert 2"],
  "keyResponsibilities": ["Resp 1", "Resp 2"],
  "importantKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "summary": "1-2 sentence overview of the role"
}
`,

    atsMatch: (resumeJson: string, jobDescription: string) => `
You are an advanced ATS (Applicant Tracking System) matching engine.
Compare the candidate's actual resume against the target Job Description.

RESUME DATA:
${resumeJson.slice(0, 6000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

EVALUATION CRITERIA:
1. Keyword coverage: What critical JD keywords and tools appear in the resume?
2. Missing skills: What skills required by the JD are missing from the resume?
3. Formatting & Completeness: Check clarity and section coverage.
4. Honesty Rule: Never instruct the candidate to fabricate qualifications or claim unearned experience. Only suggest incorporating skills they genuinely possess.

Format your output strictly as a JSON object:
{
  "estimatedScore": 75,
  "matchLevel": "Strong / Moderate / Needs Optimization",
  "matchingSkills": ["Skill 1", "Skill 2"],
  "missingKeywords": ["Skill 3", "Tool 4"],
  "strengths": ["Clear work history", "Strong action verbs"],
  "recommendations": [
    "Add Docker under Skills if you have practical experience with containerization.",
    "Mention specific APIs in your experience bullets where you designed backend endpoints."
  ],
  "formatRisks": ["string if any, or empty array"],
  "summaryAssessment": "2-3 sentences evaluating the match transparently."
}
`,

    careerChat: (userQuery: string, resumeSummary: string, targetRole?: string) => `
You are an elite career mentor and resume advisor.
Candidate Target Role: ${targetRole || "Professional Role"}
Resume Overview:
${resumeSummary.slice(0, 3000)}

USER QUESTION:
"${userQuery}"

GUIDELINES:
1. Provide practical, actionable, and concise advice.
2. Never invent fake credentials or advise deceptive tactics.
3. Keep responses recruiter-focused, ethical, and tailored to current industry hiring standards.
4. Format with clean bullet points or short paragraphs.
`,
};
