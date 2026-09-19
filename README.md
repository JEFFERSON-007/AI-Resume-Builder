# 💼 AI-Powered Resume Builder & Career Studio (V2)

An enterprise-grade, privacy-first, ATS-optimized AI resume builder engineered with Next.js 14, React, Tailwind CSS, and Zustand. Build job-winning, recruiter-ready resumes in minutes with deterministic ATS scoring, STAR-framework AI bullet point enhancements, live job description matching, and vector-perfect PDF printing.

[![Next.js 14](https://img.shields.io/badge/Next.js-14.1.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand State](https://img.shields.io/badge/Zustand-4.5-orange?style=flat)](https://github.com/pmndrs/zustand)
[![Privacy-First](https://img.shields.io/badge/Privacy-100%25_Client_Side-success?style=flat)](#-privacy--security-architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### 🌐 [Live Demo on GitHub Pages](https://jefferson-007.github.io/AI-Resume-Builder/)

---

## ⚡ What's New in V2

The V2 release is a comprehensive architectural and product upgrade designed to eliminate outdated legacy patterns, fix silent bugs, enhance ATS pass-rates, and deliver a zero-telemetry, highly responsive studio experience.

- **🛡️ 100% Offline Deterministic ATS Scorer**: Instant score breakdown across contact info, summary, experience, skills, education, and credentials with concrete recommendations.
- **🎯 Job Description Matcher**: Paste any target job description to compute real-time keyword coverage, discover missing skills, and receive prioritized ATS alignment tips.
- **✨ Truthful AI Assistant (STAR Framework)**: Bring-Your-Own-Key (BYOK) Google Gemini AI integration. Rephrases raw bullets into quantified achievements (**Situation, Task, Action, Result**) with strict anti-hallucination guardrails that never invent fake credentials or bogus metrics.
- **🧩 Modular Template System**: Replaced monolithic template code with reusable, clean primitives (`ResumeHeader`, `ResumeSection`, `ExperienceSection`, `SkillsSection`, `ProjectsSection`, `CertificationsSection`, `AdditionalSections`).
- **🖨️ High-Fidelity Vector Printing (`Ctrl+P`)**: Direct `@media print` CSS isolation that strips editor chrome, preserves hyperlinks, supports multi-page flow, and generates crystal-clear vector PDFs.
- **⏪ Undo / Redo & Multi-Resume Studio**: Full history stacks (`Ctrl+Z` / `Ctrl+Y`), autosave indicator, JSON profile export/import, and multi-profile switching.
- **⌨️ Command Palette (`Ctrl+K`)**: Instant keyboard navigation to jump between sections, switch templates, trigger AI tools, and export files.

---

## 🏛️ Architecture & Tech Stack

```
AI-Resume-Builder/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── builder/page.tsx      # Core V2 Studio (Split Editor + Preview)
│   │   ├── templates/page.tsx    # Interactive Template Catalog
│   │   ├── page.tsx              # Landing Page
│   │   └── layout.tsx            # Root Layout with Font & Meta config
│   ├── components/
│   │   ├── ai/                   # AI Assistant Modal & Tools
│   │   ├── ats/                  # Job Description Matcher Modal
│   │   ├── builder/              # Canvas, Forms, Settings, ScoreCard, Palette
│   │   │   └── forms/            # Strongly-typed section editors
│   │   └── templates/
│   │       ├── primitives/       # Headless, reusable section components
│   │       ├── layouts/          # ATS, Modern, Tech, Executive, Creative layouts
│   │       └── UniversalTemplate.tsx # Template dispatcher (14 styles)
│   ├── lib/
│   │   ├── ai/gemini-client.ts   # Dual-mode AI client (BYOK + server fallback)
│   │   ├── ats/ats-analyzer.ts   # Deterministic ATS Scoring & JD Matcher
│   │   ├── sample-data.ts        # Fictional reference resumes & defaults
│   │   └── store.ts              # Zustand Store with Undo/Redo & Persistence
│   ├── styles/globals.css        # Tailwind + Media Print isolation rules
│   └── types/resume.ts           # Comprehensive TypeScript Resume Schema
```

### Core Technologies
- **Framework**: Next.js 14 (App Router, Static Export compatible)
- **Language**: TypeScript 5 (Strict mode, zero `any` shortcuts)
- **Styling**: Tailwind CSS + Custom CSS Variables + `@media print`
- **State Management**: Zustand with `persist` middleware and custom debounced undo/redo history stacks
- **AI Integration**: Google Gemini API via client-side BYOK with local caching
- **Icons**: Lucide React
- **Exporting**: Native Browser Print Engine + `html2canvas` / `jsPDF` fallback

---

## 🔒 Privacy & Security Architecture

Most web resume builders upload your personal details (phone, email, career history, salary) to third-party databases. **AI-Resume-Builder is strictly privacy-first**:

1. **Zero Server Databases**: 100% of your personal details remain in your browser's `localStorage`.
2. **Bring-Your-Own-Key (BYOK)**: Your Gemini API key is stored only in your local browser and sent directly to Google's official Gemini endpoint. No intermediary proxies harvest your queries.
3. **Zero Telemetry**: No third-party tracking scripts, analytics cookies, or advertising pixels.
4. **Offline Capability**: Core features (editing, live preview, ATS scoring, vector PDF printing, and JSON backups) work entirely offline without any internet connection.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 1. Clone & Install
```bash
git clone https://github.com/JEFFERSON-007/AI-Resume-Builder.git
cd AI-Resume-Builder
npm install
```

### 2. Configure AI (Optional)
You can configure Google Gemini AI in one of two ways:

- **Option A (UI Settings - Recommended)**: Launch the app, click **Settings** (or press `Ctrl+K` -> Settings), and paste your Gemini API key. It is saved directly to your browser's `localStorage`.
- **Option B (Environment Variable)**: Create a `.env.local` file:
  ```env
  NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
  ```
  Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Scope |
| :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | Open Command Palette | Global Studio |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Cmd</kbd> + <kbd>Z</kbd> | Undo recent edit | Resume Editor |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Redo edit | Resume Editor |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> / <kbd>Cmd</kbd> + <kbd>P</kbd> | Print / Save Vector PDF | Global Studio |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> / <kbd>Cmd</kbd> + <kbd>S</kbd> | Save snapshot & trigger ATS check | Resume Editor |
| <kbd>Escape</kbd> | Close active modal / palette | Global Studio |

---

## 📋 Comprehensive Resume Sections Supported

- **Personal Details**: Full Name, Job Title, Email, Phone, Location, Portfolio, LinkedIn, GitHub.
- **Executive Summary**: Character count, word count, role-targeted summary generator.
- **Work Experience**: Job Title, Company, Location, Date range, Current role toggle, STAR bullet points with AI bullet enhancement.
- **Education**: Degree, Institution, Location, Graduation Year, GPA, Relevant Coursework.
- **Skills**: Categorized skills (Languages, Frameworks, Developer Tools, Methodologies) with quick-add badge chips.
- **Projects**: Project Name, Role/Subtitle, Description bullets, Tech Stack tags, Live Demo link, GitHub repo link.
- **Certifications**: Credential Name, Issuing Organization, Issue Date, Expiration Date, Credential ID / Verification URL.
- **Additional Sections**: Languages & proficiencies, Honors & Awards, Volunteering & Community Leadership, and Custom Sections with arbitrary bullet points.

---

## 🖨️ Vector PDF Export Guide

To produce the highest quality, recruiter-ready PDF:
1. Click **Print / PDF** in the builder header, or press <kbd>Ctrl</kbd> + <kbd>P</kbd>.
2. In the browser print dialog:
   - **Destination**: Choose **Save as PDF**.
   - **Pages**: All.
   - **Layout**: Portrait.
   - **Paper Size**: **A4** (or **Letter**, matching your builder canvas setting).
   - **Margins**: **None** (the template provides its own precise spacing).
   - **Options**: Enable **Background graphics**.
3. Click **Save**. The exported PDF retains crystal-clear selectable text, searchable strings for ATS parsers, and clickable hyperlinks for your portfolio and GitHub.

---

## 🚢 Deployment Options

### GitHub Pages (Default)
The repository is preconfigured for static export (`output: 'export'`) to GitHub Pages:
1. Push your repository to GitHub.
2. In repository **Settings** -> **Pages**, set **Source** to **GitHub Actions**.
3. GitHub Actions builds and deploys the static files into `gh-pages` automatically.

### Vercel / Netlify / Self-Hosted Node.js
If deploying to Vercel or any Node.js host:
1. Change `next.config.mjs` to remove `basePath` if deploying to the root domain.
2. Run `npm run build` followed by `npm start`.

---

## 📄 License & Credits

Distributed under the **MIT License**. See `LICENSE` for more information.

Maintained with ❤️ by the open-source community. Original architecture by [JEFFERSON-007](https://github.com/JEFFERSON-007).