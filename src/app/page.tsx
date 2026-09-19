"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, Download, Zap, BrainCircuit, TrendingUp, Search, Palette } from "lucide-react";
import LiquidEther from "@/components/ui/LiquidEther";

const Hero3D = () => {
    return (
        <div className="fixed inset-0 -z-10 h-screen w-full">
            <LiquidEther
                mouseForce={25}
                cursorSize={120}
                colors={['#3b82f6', '#8b5cf6', '#1e40af']}
                autoDemo={true}
                resolution={0.6}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
        </div>
    );
};

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center pt-20 px-4 min-h-screen">
            <Hero3D />

            <section className="max-w-6xl w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
                        AI-Powered Resume Excellence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Create Your Own Resume <br /> with AI Assistance
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Build a professional, high-impact resume in minutes with our AI assistant.
                        Get smart content suggestions, premium designer templates, and real-time previews.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/builder">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors"
                            >
                                Build Your Resume <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <Link href="/templates">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold backdrop-blur-md hover:bg-white/10 transition-colors"
                            >
                                View Templates
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="mt-20 relative"
                >
                    <div className="glass-dark rounded-2xl p-4 md:p-8 max-w-5xl mx-auto transform perspective-1000 rotate-x-6 border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-white uppercase tracking-wider text-sm">AI Content Assistant</h3>
                                    <p className="text-xs text-gray-500">Intelligent Resume Optimization Engine</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: "AI Summary", icon: BrainCircuit, color: "text-blue-400" },
                                { label: "Impact Bullets", icon: TrendingUp, color: "text-green-400" },
                                { label: "Keywords", icon: Search, color: "text-purple-400" },
                                { label: "Resume Score", icon: Palette, color: "text-orange-400" },
                            ].map((opt, i) => (
                                <Link key={i} href="/builder">
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className={`p-2 rounded-lg bg-black/20 ${opt.color}`}>
                                            <opt.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-300">{opt.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </section>

            <section className="py-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {[
                    { icon: Wand2, title: "AI Assistant", desc: "Craft perfect professional summaries and bullet points with AI." },
                    { icon: Zap, title: "Live Preview", desc: "Watch your resume evolve in real-time with AI-driven design." },
                    { icon: Download, title: "PDF Export", desc: "One-click export to ATS-friendly professional formats." }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="glass-dark p-8 rounded-2xl border border-white/5"
                    >
                        <feature.icon className="w-10 h-10 text-blue-500 mb-6" />
                        <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
