import React from "react";
import { PersonalInfo } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface ResumeHeaderProps {
    info: PersonalInfo;
    themeColor?: string;
    variant?: "centered" | "left-aligned" | "sidebar" | "technical" | "compact";
}

export default function ResumeHeader({
    info,
    themeColor = "#0f172a",
    variant = "left-aligned",
}: ResumeHeaderProps) {
    if (!info.fullName && !info.jobTitle && !info.email) {
        return null;
    }

    const contactItems = [
        info.email && {
            icon: Mail,
            text: info.email,
            href: `mailto:${info.email}`,
        },
        info.phone && {
            icon: Phone,
            text: info.phone,
            href: `tel:${info.phone}`,
        },
        info.location && {
            icon: MapPin,
            text: info.location,
        },
        info.website && {
            icon: Globe,
            text: info.website.replace(/^https?:\/\//, ""),
            href: info.website,
        },
        info.linkedin && {
            icon: Linkedin,
            text: info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "in/"),
            href: info.linkedin,
        },
        info.github && {
            icon: Github,
            text: info.github.replace(/^https?:\/\/(www\.)?github\.com\//, "github/"),
            href: info.github,
        },
        info.portfolio && {
            icon: ExternalLink,
            text: "Portfolio",
            href: info.portfolio,
        },
    ].filter(Boolean) as { icon: any; text: string; href?: string }[];

    if (variant === "centered") {
        return (
            <header className="text-center pb-6 mb-6 border-b border-gray-200">
                {info.fullName && (
                    <h1
                        className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1"
                        style={{ color: themeColor }}
                    >
                        {info.fullName}
                    </h1>
                )}
                {info.jobTitle && (
                    <p className="text-base font-semibold text-gray-700 tracking-wide mb-3">
                        {info.jobTitle}
                    </p>
                )}
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    {contactItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                            <item.icon className="w-3 h-3 text-gray-500 shrink-0" />
                            {item.href ? (
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline hover:text-blue-600"
                                >
                                    {item.text}
                                </a>
                            ) : (
                                <span>{item.text}</span>
                            )}
                            {idx < contactItems.length - 1 && <span className="text-gray-300 ml-3">•</span>}
                        </div>
                    ))}
                </div>
            </header>
        );
    }

    if (variant === "technical") {
        return (
            <header className="pb-5 mb-5 border-b-2 border-gray-800">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-[11px] font-mono text-gray-500 mb-1">
                            const candidate = &#123; role: &quot;{info.jobTitle || "Engineer"}&quot; &#125;;
                        </div>
                        <h1 className="text-3xl font-black font-mono tracking-tight text-gray-950 uppercase">
                            {info.fullName || "Candidate Name"}
                        </h1>
                        <p className="text-sm font-bold font-mono text-blue-700 mt-1">
                            // {info.jobTitle}
                        </p>
                    </div>

                    <div className="text-right text-[11px] font-mono text-gray-600 space-y-1">
                        {info.location && (
                            <div>
                                <span className="text-gray-400">location:</span> &quot;{info.location}&quot;
                            </div>
                        )}
                        {info.email && (
                            <div>
                                <span className="text-gray-400">email:</span>{" "}
                                <a href={`mailto:${info.email}`} className="text-blue-600 underline">
                                    {info.email}
                                </a>
                            </div>
                        )}
                        {info.github && (
                            <div>
                                <span className="text-gray-400">git:</span>{" "}
                                <a href={info.github} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                    {info.github.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        );
    }

    // Default left-aligned professional header
    return (
        <header className="pb-5 mb-5 border-b border-gray-200">
            <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    {info.fullName && (
                        <h1
                            className="text-3xl font-extrabold tracking-tight text-gray-900"
                            style={{ color: themeColor }}
                        >
                            {info.fullName}
                        </h1>
                    )}
                    {info.jobTitle && (
                        <p className="text-base font-medium text-gray-600 tracking-wide mt-1">
                            {info.jobTitle}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600 max-w-md justify-start md:justify-end">
                    {contactItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            <item.icon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            {item.href ? (
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline hover:text-blue-600"
                                >
                                    {item.text}
                                </a>
                            ) : (
                                <span>{item.text}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}
