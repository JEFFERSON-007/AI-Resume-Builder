"use client";

import { useResumeStore } from "@/lib/store";
import { Plus, Trash2, Award, ExternalLink } from "lucide-react";

export default function CertificationsForm() {
    const certifications = useResumeStore((state) => state.resumeData.certifications || []);
    const addCertification = useResumeStore((state) => state.addCertification);
    const updateCertification = useResumeStore((state) => state.updateCertification);
    const removeCertification = useResumeStore((state) => state.removeCertification);

    return (
        <div className="space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-400" /> Certifications & Badges
                    </h3>
                    <p className="text-xs text-slate-400">
                        Industry-recognized certifications and professional licenses
                    </p>
                </div>
                <button
                    onClick={addCertification}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl hover:bg-blue-500/20 transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Certification
                </button>
            </div>

            <div className="space-y-3">
                {certifications.map((cert, index) => (
                    <div
                        key={cert.id}
                        className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300">
                                #{index + 1} {cert.name || "New Certification"}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeCertification(cert.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                    Certification Name *
                                </label>
                                <input
                                    type="text"
                                    value={cert.name}
                                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                                    placeholder="AWS Solutions Architect Associate"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                    Issuing Organization *
                                </label>
                                <input
                                    type="text"
                                    value={cert.issuer}
                                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                                    placeholder="Amazon Web Services"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                    Date Issued
                                </label>
                                <input
                                    type="text"
                                    value={cert.date}
                                    onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                                    placeholder="2024-05"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                    Credential ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={cert.credentialId || ""}
                                    onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                                    placeholder="AWS-194820"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                                    Verification URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={cert.url || ""}
                                    onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                                    placeholder="https://verify.cert.com/..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {certifications.length === 0 && (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl">
                    <p className="text-xs text-slate-500">No certifications added yet.</p>
                </div>
            )}
        </div>
    );
}
