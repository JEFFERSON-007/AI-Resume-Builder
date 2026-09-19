"use client";

import { useResumeStore } from "@/lib/store";
import { User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

export default function PersonalInfoForm() {
    const personalInfo = useResumeStore((state) => state.resumeData.personalInfo);
    const updatePersonalInfo = useResumeStore((state) => state.updatePersonalInfo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updatePersonalInfo({ [name]: value });
    };

    return (
        <div className="space-y-5 text-left">
            <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" /> Personal Details
                </h3>
                <p className="text-xs text-slate-400">
                    Your direct contact information and professional identifiers
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Full Name *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="fullName"
                            value={personalInfo.fullName}
                            onChange={handleChange}
                            placeholder="Alex Morgan"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Target Job Title *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="jobTitle"
                            value={personalInfo.jobTitle}
                            onChange={handleChange}
                            placeholder="Senior Full Stack Engineer"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Email Address *
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={personalInfo.email}
                            onChange={handleChange}
                            placeholder="alex.morgan@example.com"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            name="phone"
                            value={personalInfo.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 019-2834"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Location
                </label>
                <input
                    type="text"
                    name="location"
                    value={personalInfo.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA or Remote"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="border-t border-white/5 pt-4 space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Links & Profiles
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn URL
                        </label>
                        <input
                            type="url"
                            name="linkedin"
                            value={personalInfo.linkedin || ""}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/alexmorgan"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Github className="w-3.5 h-3.5 text-purple-400" /> GitHub URL
                        </label>
                        <input
                            type="url"
                            name="github"
                            value={personalInfo.github || ""}
                            onChange={handleChange}
                            placeholder="https://github.com/alexmorgan"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Personal Website
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={personalInfo.website || ""}
                            onChange={handleChange}
                            placeholder="https://alexmorgan.dev"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-amber-400" /> Portfolio URL
                        </label>
                        <input
                            type="url"
                            name="portfolio"
                            value={personalInfo.portfolio || ""}
                            onChange={handleChange}
                            placeholder="https://portfolio.alexmorgan.dev"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
