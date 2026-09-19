import React from "react";
import { ResumeData, TypographyFamily } from "@/types/resume";
import AtsStandard from "./layouts/AtsStandard";
import ModernMinimal from "./layouts/ModernMinimal";
import TechnicalStack from "./layouts/TechnicalStack";
import ExecutiveCompact from "./layouts/ExecutiveCompact";
import CreativeSidebar from "./layouts/CreativeSidebar";

export type LayoutId =
    | "ats"
    | "classic"
    | "sidebar"
    | "grid"
    | "executive"
    | "minimalist"
    | "compact"
    | "modern"
    | "clean"
    | "bold"
    | "technical"
    | "corporate"
    | "developer"
    | "modern-minimal"
    | "entrepreneur";

export type ThemeId =
    | "midnight"
    | "sapphire"
    | "emerald"
    | "ruby"
    | "amber"
    | "slate"
    | "rose"
    | "indigo"
    | "forest"
    | "crimson";

export const THEME_PALETTES: Record<ThemeId, { primary: string; secondary: string; accent: string }> = {
    midnight: { primary: "#0f172a", secondary: "#334155", accent: "#2563eb" },
    sapphire: { primary: "#1e3a8a", secondary: "#1d4ed8", accent: "#3b82f6" },
    emerald: { primary: "#064e3b", secondary: "#047857", accent: "#10b981" },
    ruby: { primary: "#881337", secondary: "#be123c", accent: "#f43f5e" },
    amber: { primary: "#78350f", secondary: "#b45309", accent: "#f59e0b" },
    slate: { primary: "#334155", secondary: "#475569", accent: "#64748b" },
    rose: { primary: "#9f1239", secondary: "#e11d48", accent: "#fb7185" },
    indigo: { primary: "#312e81", secondary: "#4338ca", accent: "#6366f1" },
    forest: { primary: "#14532d", secondary: "#15803d", accent: "#22c55e" },
    crimson: { primary: "#7f1d1d", secondary: "#b91c1c", accent: "#ef4444" },
};

const FONT_MAP: Record<TypographyFamily, string> = {
    Inter: "font-sans",
    Merriweather: "font-serif",
    "Roboto Mono": "font-mono",
    "Playfair Display": "font-serif",
    Outfit: "font-sans",
    Geist: "font-sans",
};

interface UniversalTemplateProps {
    data: ResumeData;
    layoutId?: LayoutId;
    themeId?: ThemeId;
}

export default function UniversalTemplate({
    data,
    layoutId: propLayoutId,
    themeId: propThemeId,
}: UniversalTemplateProps) {
    // Parse layout and theme from templateId if not explicitly provided
    let resolvedLayout: LayoutId = propLayoutId || "classic";
    let resolvedTheme: ThemeId = propThemeId || "midnight";

    if (data.templateId && (!propLayoutId || !propThemeId)) {
        const parts = data.templateId.split("-");
        const candidateTheme = parts[parts.length - 1] as ThemeId;
        if (THEME_PALETTES[candidateTheme]) {
            resolvedTheme = candidateTheme;
            resolvedLayout = parts.slice(0, parts.length - 1).join("-") as LayoutId;
        } else {
            resolvedLayout = data.templateId as LayoutId;
        }
    }

    const themePalette = THEME_PALETTES[resolvedTheme] || THEME_PALETTES.midnight;
    const { pageSettings } = data;
    const fontClass = FONT_MAP[pageSettings?.fontFamily] || "font-sans";

    const marginPx =
        pageSettings?.marginSize === "compact"
            ? "24px"
            : pageSettings?.marginSize === "relaxed"
                ? "48px"
                : `${pageSettings?.margins || 36}px`;

    const fontScalePercent = pageSettings?.fontScale ? pageSettings.fontScale / 100 : 1;

    // Dispatcher mapping layouts to the modular implementation
    const renderLayout = () => {
        switch (resolvedLayout) {
            case "technical":
            case "developer":
                return <TechnicalStack data={data} themeColor={themePalette.primary} />;

            case "sidebar":
            case "grid":
                return <CreativeSidebar data={data} themeColor={themePalette.primary} />;

            case "executive":
            case "corporate":
            case "bold":
                return <ExecutiveCompact data={data} themeColor={themePalette.primary} />;

            case "minimalist":
            case "modern-minimal":
            case "modern":
            case "clean":
                return <ModernMinimal data={data} themeColor={themePalette.primary} />;

            case "ats":
            case "classic":
            case "compact":
            case "entrepreneur":
            default:
                return <AtsStandard data={data} themeColor={themePalette.primary} />;
        }
    };

    return (
        <div
            id="resume-canvas-content"
            className={`w-full bg-white text-gray-900 transition-all ${fontClass}`}
            style={{
                padding: marginPx,
                fontSize: `${fontScalePercent * 0.875}rem`,
                lineHeight:
                    pageSettings?.lineHeight === "tight"
                        ? "1.3"
                        : pageSettings?.lineHeight === "relaxed"
                            ? "1.7"
                            : "1.5",
            }}
        >
            {renderLayout()}
        </div>
    );
}
