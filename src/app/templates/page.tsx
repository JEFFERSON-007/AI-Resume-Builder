"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const layouts = [
    { id: "classic", name: "Classic Professional", desc: "A timeless, high-impact layout for any industry." },
    { id: "sidebar", name: "Modern Sidebar", desc: "Focused on contact details and professional visibility." },
    { id: "grid", name: "Creative Grid", desc: "Asymmetric design for creative and bold individuals." },
    { id: "executive", name: "Executive Suite", desc: "Premium layout for leadership and high-level roles." },
    { id: "minimalist", name: "Minimalist Mono", desc: "Clean, whitespace-focused design for high readability." },
    { id: "compact", name: "Compact Professional", desc: "Dense layout optimized for experienced professionals." },
    { id: "modern", name: "Modern Dynamic", desc: "Contemporary aesthetic with bold typography and shapes." },
    { id: "technical", name: "Technical Monospace", desc: "Code-inspired layout for tech and engineering roles." },
    { id: "clean", name: "Clean Essential", desc: "Standard high-contrast design for maximum clarity." },
    { id: "bold", name: "Bold Impact", desc: "Large headers and high-energy design for attention." },
    { id: "corporate", name: "Corporate Gold", desc: "A formal, structured layout for professional excellence." },
    { id: "developer", name: "Dev Stack", desc: "GitHub-inspired layout optimized for technical depth." },
    { id: "modern-minimal", name: "Modern Minimal", desc: "Ultra-clean design with elegant spacing and typography." },
    { id: "entrepreneur", name: "Entrepreneur", desc: "Focuses on vision and achievement with bold visuals." },
];

const themes = [
    { id: "midnight", name: "Midnight", color: "#0f172a" },
    { id: "sapphire", name: "Sapphire", color: "#1e40af" },
    { id: "emerald", name: "Emerald", color: "#059669" },
    { id: "slate", name: "Slate", color: "#475569" },
    { id: "ruby", name: "Ruby", color: "#e11d48" },
];

const layoutImages: Record<string, string> = {
    classic: "1586281380349-6325f6db3d14",
    sidebar: "1512486130939-2c4f79935e4f",
    grid: "1507679799987-c7377f064c1a",
    executive: "1473187983345-8003ffb46272",
    minimalist: "1544005313-94ddf0286df2",
    compact: "1511367461989-f85a21fda167",
    modern: "1573497019940-1c28c88b4f3e",
    technical: "1519389950473-47ba0277781c",
    clean: "1438761681033-6461ffad8d80",
    bold: "1500648767791-00dcc994a43e",
    corporate: "1486406146926-c627a92ad1ab",
    developer: "1555066931-4365d14bab8c",
    "modern-minimal": "1515372039744-4e7f19669677",
    entrepreneur: "1490292634175-814043b87979",
};

const layoutLocalImages: Record<string, string> = {
    classic: "/AI-Resume-Builder/templates/signature-premium.png",
    sidebar: "/AI-Resume-Builder/templates/sidebar-modern.png",
    grid: "/AI-Resume-Builder/templates/creative-grid.png",
    executive: "/AI-Resume-Builder/templates/executive-suite.png",
    minimalist: "/AI-Resume-Builder/templates/minimalist-mono.png",
    compact: "/AI-Resume-Builder/templates/clean-professional.png",
    modern: "/AI-Resume-Builder/templates/modern-dynamic.png",
    technical: "/AI-Resume-Builder/templates/technical-monospace.png",
    clean: "/AI-Resume-Builder/templates/clean-essential.png",
    bold: "/AI-Resume-Builder/templates/bold-impact.png",
    corporate: "/AI-Resume-Builder/templates/corporate.png",
    developer: "/AI-Resume-Builder/templates/developer.png",
    "modern-minimal": "/AI-Resume-Builder/templates/modern-minimal.png",
    entrepreneur: "/AI-Resume-Builder/templates/modern-dynamic.png",
};

const templates = layouts.flatMap((layout) =>
    themes.map((theme) => ({
        id: `${layout.id}-${theme.id}`,
        name: `${layout.name} - ${theme.name}`,
        description: layout.desc,
        image: layoutLocalImages[layout.id], // Use local as primary for reliability
        externalImage: `https://images.unsplash.com/photo-${layoutImages[layout.id]}?auto=format&fit=crop&q=80&w=1000`,
        themeColor: theme.color,
        tags: [layout.id.toUpperCase(), theme.name.toUpperCase()],
    }))
);

export default function TemplateSelection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const setTemplate = useResumeStore((state) => state.setTemplate);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % templates.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
    };

    const handleSelect = (id: string) => {
        setTemplate(id);
        router.push("/builder");
    };

    // Scroll to move functionality
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (isScrolling) return;

            if (Math.abs(e.deltaY) > 50) {
                setIsScrolling(true);
                if (e.deltaY > 0) {
                    handleNext();
                } else {
                    handlePrev();
                }

                // Debounce scrolling
                setTimeout(() => {
                    setIsScrolling(false);
                }, 800);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: true });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [currentIndex, isScrolling, templates.length]);

    return (
        <div className="min-h-screen pt-20 px-4 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Choose Your Canvas
                </h1>
                <p className="text-gray-400">Select a template to start building your professional story.</p>
            </motion.div>

            <div className="relative w-full max-w-5xl h-[800px] flex items-center justify-center overflow-visible">
                <AnimatePresence mode="wait">
                    {templates.map((template, index) => {
                        const isCenter = index === currentIndex;
                        const isLeft = index === (currentIndex - 1 + templates.length) % templates.length;
                        const isRight = index === (currentIndex + 1) % templates.length;

                        if (!isCenter && !isLeft && !isRight) return null;

                        return (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: isCenter ? 1 : 0.5,
                                    scale: isCenter ? 1 : 0.8,
                                    x: isCenter ? 0 : isLeft ? -400 : 400,
                                    rotateY: isCenter ? 0 : isLeft ? 30 : -30,
                                    zIndex: isCenter ? 10 : 0,
                                }}
                                transition={{ duration: 0.6, ease: "circOut" }}
                                className="absolute w-[350px] md:w-[450px]"
                            >
                                <div className="glass-dark rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-blue-500/50 transition-colors shadow-2xl">
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <div className="w-full h-full relative bg-slate-900">
                                            <img
                                                src={template.image}
                                                alt={template.name}
                                                loading="eager"
                                                className="w-full h-full object-cover transition-all duration-500 scale-110 group-hover:scale-100 opacity-90"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = template.externalImage;
                                                }}
                                            />
                                            {/* Dynamic Theme Overlay - lighter and pointer-none */}
                                            <div
                                                className="absolute inset-0 bg-white opacity-[0.03] pointer-events-none"
                                            />
                                            <div
                                                className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
                                                style={{ backgroundColor: template.themeColor }}
                                            />
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 pointer-events-none"
                                            />
                                        </div>
                                        {isCenter && (
                                            <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleSelect(template.id)}
                                                    className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2"
                                                >
                                                    Use Template <Check className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex gap-2 mb-3">
                                            {template.tags.map((tag) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded-full text-blue-400 border border-white/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                                        <p className="text-sm text-gray-500">{template.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                <div className="absolute bottom-10 flex gap-4 z-20">
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
