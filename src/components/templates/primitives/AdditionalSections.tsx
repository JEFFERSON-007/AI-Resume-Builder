import React from "react";
import {
    AchievementItem,
    PublicationItem,
    VolunteeringItem,
    LanguageItem,
    CustomSection,
} from "@/types/resume";
import { ExternalLink } from "lucide-react";

export function AchievementsSection({ items }: { items: AchievementItem[] }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="space-y-2">
            {items.map((ach) => (
                <div key={ach.id} className="text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-900">{ach.title}</span>
                        {ach.date && <span className="text-gray-500">{ach.date}</span>}
                    </div>
                    {ach.description && (
                        <p className="text-gray-600 mt-0.5 leading-relaxed">{ach.description}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export function PublicationsSection({ items }: { items: PublicationItem[] }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="space-y-2">
            {items.map((pub) => (
                <div key={pub.id} className="text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                        <div>
                            <span className="font-bold text-gray-900">{pub.title}</span>
                            {pub.publisher && <span className="text-gray-600"> • {pub.publisher}</span>}
                            {pub.url && (
                                <a href={pub.url} target="_blank" rel="noreferrer" className="text-blue-600 ml-1">
                                    <ExternalLink className="w-2.5 h-2.5 inline" />
                                </a>
                            )}
                        </div>
                        {pub.date && <span className="text-gray-500">{pub.date}</span>}
                    </div>
                    {pub.description && <p className="text-gray-600 mt-0.5">{pub.description}</p>}
                </div>
            ))}
        </div>
    );
}

export function VolunteeringSection({ items }: { items: VolunteeringItem[] }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="space-y-2.5">
            {items.map((vol) => (
                <div key={vol.id} className="text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                        <div>
                            <span className="font-bold text-gray-900">{vol.role}</span>
                            {vol.organization && <span className="text-gray-700"> • {vol.organization}</span>}
                        </div>
                        <div className="text-gray-500">
                            {vol.startDate && <span>{vol.startDate} — </span>}
                            <span>{vol.current ? "Present" : vol.endDate}</span>
                        </div>
                    </div>
                    {vol.description && <p className="text-gray-600 mt-0.5">{vol.description}</p>}
                </div>
            ))}
        </div>
    );
}

export function LanguagesSection({ items }: { items: LanguageItem[] }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700 break-inside-avoid">
            {items.map((lang) => (
                <div key={lang.id} className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">{lang.language}:</span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                </div>
            ))}
        </div>
    );
}

export function CustomSectionRenderer({ section }: { section: CustomSection }) {
    if (!section || !section.items || section.items.length === 0) return null;
    return (
        <div className="space-y-2.5">
            {section.items.map((item) => (
                <div key={item.id} className="text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                        <div>
                            <span className="font-bold text-gray-900">{item.title}</span>
                            {item.subtitle && <span className="text-gray-600"> — {item.subtitle}</span>}
                        </div>
                        {item.date && <span className="text-gray-500">{item.date}</span>}
                    </div>
                    {item.description && (
                        <p className="text-gray-600 mt-0.5 leading-relaxed">{item.description}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
