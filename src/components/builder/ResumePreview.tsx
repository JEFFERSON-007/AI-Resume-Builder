"use client";

import { useResumeStore } from "@/lib/store";
import { useState } from "react";
import {
    Minus,
    Plus,
    Printer,
    Download,
    Maximize2,
    Type,
    FileText,
} from "lucide-react";
import UniversalTemplate from "../templates/UniversalTemplate";
import { printResume, exportToPdf } from "@/utils/export";
import { TypographyFamily, MarginsSize } from "@/types/resume";

export default function ResumePreview() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const zoom = useResumeStore((state) => state.zoom);
    const setZoom = useResumeStore((state) => state.setZoom);
    const updatePageSettings = useResumeStore((state) => state.updatePageSettings);

    const [isExporting, setIsExporting] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const format = resumeData.pageSettings?.format || "A4";
    const isLetter = format === "Letter";
    const pageWidthMm = isLetter ? 215.9 : 210;
    const pageHeightMm = isLetter ? 279.4 : 297;

    const handleExport = async () => {
        setIsExporting(true);
        const candidateName = (resumeData.personalInfo.fullName || "resume").replace(/\s+/g, "_");
        await exportToPdf("resume-preview-root", `${candidateName}_resume.pdf`, format);
        setIsExporting(false);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden relative select-none">
            {/* Control Bar */}
            <div className="no-print h-12 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between z-20 backdrop-blur-md">
                {/* Format & Margins */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            updatePageSettings({ format: isLetter ? "A4" : "Letter" })
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Toggle Page Format"
                    >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>{format}</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg text-[11px] text-slate-300">
                        {(["compact", "standard", "relaxed"] as MarginsSize[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => updatePageSettings({ marginSize: m })}
                                className={`px-2 py-0.5 rounded-md capitalize transition-colors ${resumeData.pageSettings?.marginSize === m
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "hover:text-white"
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg text-[11px] text-slate-300">
                        <Type className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                        {(["Inter", "Roboto Mono", "Merriweather"] as TypographyFamily[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => updatePageSettings({ fontFamily: f })}
                                className={`px-2 py-0.5 rounded-md transition-colors ${resumeData.pageSettings?.fontFamily === f
                                    ? "bg-slate-700 text-white font-semibold"
                                    : "hover:text-white"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Zoom & Export Actions */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
                        <button
                            onClick={() => setZoom(Math.max(0.4, Math.round((zoom - 0.1) * 10) / 10))}
                            title="Zoom Out"
                            className="p-1 hover:text-white text-slate-400"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-mono text-slate-300 px-2 min-w-[42px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={() => setZoom(Math.min(1.4, Math.round((zoom + 0.1) * 10) / 10))}
                            title="Zoom In"
                            className="p-1 hover:text-white text-slate-400"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <button
                        onClick={printResume}
                        title="Vector Print (Ctrl+P)"
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Print</span>
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-3.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Canvas Viewport */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start scrollbar-thin">
                <div
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: "top center",
                        transition: "transform 0.15s ease-out",
                    }}
                    className="my-4"
                >
                    {/* The Printed / Exported Page Element */}
                    <div
                        id="resume-preview-root"
                        className="bg-white text-slate-900 shadow-2xl rounded-sm transition-all"
                        style={{
                            width: `${pageWidthMm}mm`,
                            minHeight: `${pageHeightMm}mm`,
                        }}
                    >
                        <UniversalTemplate data={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
