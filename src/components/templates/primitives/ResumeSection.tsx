import React from "react";

interface ResumeSectionProps {
    title: string;
    themeColor?: string;
    variant?: "underlined" | "left-border" | "badge" | "minimal" | "technical";
    children: React.ReactNode;
}

export default function ResumeSection({
    title,
    themeColor = "#0f172a",
    variant = "underlined",
    children,
}: ResumeSectionProps) {
    if (!children) return null;

    if (variant === "left-border") {
        return (
            <section className="mb-5 break-inside-avoid">
                <div className="border-l-4 pl-3 mb-3" style={{ borderColor: themeColor }}>
                    <h2
                        className="text-xs font-bold uppercase tracking-wider text-gray-900"
                        style={{ color: themeColor }}
                    >
                        {title}
                    </h2>
                </div>
                <div>{children}</div>
            </section>
        );
    }

    if (variant === "technical") {
        return (
            <section className="mb-6 break-inside-avoid font-mono">
                <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-300">
                    <span className="text-blue-600 font-bold text-xs">//</span>
                    <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
                        {title.replace(/\s+/g, "_")}
                    </h2>
                </div>
                <div>{children}</div>
            </section>
        );
    }

    if (variant === "minimal") {
        return (
            <section className="mb-5 break-inside-avoid">
                <h2
                    className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2"
                    style={{ color: themeColor }}
                >
                    {title}
                </h2>
                <div>{children}</div>
            </section>
        );
    }

    // Default underlined style
    return (
        <section className="mb-5 break-inside-avoid">
            <h2
                className="text-xs font-black uppercase tracking-[0.18em] pb-1 mb-3 border-b-2"
                style={{
                    color: themeColor,
                    borderColor: themeColor,
                }}
            >
                {title}
            </h2>
            <div>{children}</div>
        </section>
    );
}
