"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, KeyRound, ShieldCheck, Download, Upload, Trash2, Check, AlertCircle, Loader2 } from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { getUserApiKey, setUserApiKey, executeAiPrompt } from "@/lib/ai/gemini-client";

export default function SettingsModal() {
    const isSettingsOpen = useResumeStore((state) => state.isSettingsOpen);
    const setSettingsOpen = useResumeStore((state) => state.setSettingsOpen);
    const exportResumeJson = useResumeStore((state) => state.exportResumeJson);
    const importResumeJson = useResumeStore((state) => state.importResumeJson);
    const resetActiveResume = useResumeStore((state) => state.resetActiveResume);

    const [apiKeyInput, setApiKeyInput] = useState(getUserApiKey());
    const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
    const [testMessage, setTestMessage] = useState("");
    const [importError, setImportError] = useState<string | null>(null);

    if (!isSettingsOpen) return null;

    const handleSaveKey = () => {
        setUserApiKey(apiKeyInput);
        setTestStatus("success");
        setTestMessage("API Key saved securely in your browser's localStorage!");
        setTimeout(() => setTestStatus("idle"), 3000);
    };

    const handleClearKey = () => {
        setUserApiKey("");
        setApiKeyInput("");
        setTestStatus("idle");
        setTestMessage("API Key removed.");
    };

    const handleTestKey = async () => {
        if (!apiKeyInput.trim()) {
            setTestStatus("error");
            setTestMessage("Please enter an API key first.");
            return;
        }
        setUserApiKey(apiKeyInput);
        setTestStatus("testing");
        setTestMessage("Verifying key with Gemini API...");

        const res = await executeAiPrompt({
            prompt: "Respond with the single word: OK",
            type: "text",
        });

        if (res.success && res.result) {
            setTestStatus("success");
            setTestMessage("Verified! Your Gemini API Key is working successfully.");
        } else {
            setTestStatus("error");
            setTestMessage(res.error || "Connection failed. Please check the key and quota.");
        }
    };

    const handleDownloadBackup = () => {
        const json = exportResumeJson();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resume-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result as string;
            const res = importResumeJson(content);
            if (res.success) {
                alert("Resume imported successfully!");
                setSettingsOpen(false);
            } else {
                setImportError(res.error || "Failed to parse imported JSON.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xl flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <KeyRound className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Settings & Privacy</h3>
                                <p className="text-xs text-slate-400">Manage API keys, backups, and data</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSettingsOpen(false)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 text-left max-h-[75vh] overflow-y-auto">
                        {/* SECTION 1: API KEY */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                                    Google Gemini API Key (BYOK)
                                </label>
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-blue-400 hover:underline"
                                >
                                    Get Free Key ↗
                                </a>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                                Stored strictly in your browser&apos;s localStorage. Enables live AI features on static
                                GitHub Pages deployments without exposing server secrets.
                            </p>

                            <div className="relative">
                                <input
                                    type="password"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleSaveKey}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Save Key
                                </button>
                                <button
                                    onClick={handleTestKey}
                                    disabled={testStatus === "testing"}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    {testStatus === "testing" ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <KeyRound className="w-3.5 h-3.5" />
                                    )}
                                    Test Connection
                                </button>
                                {apiKeyInput && (
                                    <button
                                        onClick={handleClearKey}
                                        className="px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Remove
                                    </button>
                                )}
                            </div>

                            {testMessage && (
                                <div
                                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${testStatus === "success"
                                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                                        : testStatus === "error"
                                            ? "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                                            : "bg-slate-800 text-slate-300"
                                        }`}
                                >
                                    {testStatus === "success" ? (
                                        <Check className="w-4 h-4 shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                    )}
                                    <span>{testMessage}</span>
                                </div>
                            )}
                        </div>

                        {/* SECTION 2: BACKUP & RESTORE */}
                        <div className="pt-4 border-t border-slate-800 space-y-3">
                            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                                Resume Backup & Portability
                            </label>
                            <p className="text-xs text-slate-400">
                                Export your full resume in JSON format or restore from an existing backup.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleDownloadBackup}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Export JSON Backup
                                </button>

                                <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    Import JSON Backup
                                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                                </label>
                            </div>

                            {importError && (
                                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {importError}
                                </p>
                            )}
                        </div>

                        {/* SECTION 3: PRIVACY & DATA GUARANTEE */}
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Zero-Tracking Privacy Guarantee</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Your resumes are stored locally in your browser. No personal information, resume
                                text, or analytics are uploaded to any external server without your explicit command.
                                When using AI, only the specific section being generated is processed.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
                        <button
                            onClick={() => setSettingsOpen(false)}
                            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
