import React from "react";
import { CertificationItem } from "@/types/resume";
import { ExternalLink } from "lucide-react";

interface CertificationsSectionProps {
    items: CertificationItem[];
    themeColor?: string;
}

export default function CertificationsSection({ items, themeColor }: CertificationsSectionProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-2">
            {items.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline break-inside-avoid text-xs">
                    <div>
                        <span className="font-bold text-gray-900">{cert.name}</span>
                        {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                        {cert.credentialId && (
                            <span className="text-gray-500 font-mono text-[11px]">
                                {" "}• ID: {cert.credentialId}
                            </span>
                        )}
                        {cert.url && (
                            <a
                                href={cert.url}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-1 text-blue-600 hover:underline inline-flex items-center"
                            >
                                <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        )}
                    </div>
                    {cert.date && <span className="text-gray-500 font-medium">{cert.date}</span>}
                </div>
            ))}
        </div>
    );
}
