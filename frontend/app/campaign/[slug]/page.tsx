'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import axios from 'axios';
import { MessageCircle, ShieldCheck, Loader2 } from 'lucide-react';

export default function CampaignPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string;
    const intent = searchParams.get('intent') || '';

    const [loading, setLoading] = useState(false);
    const [aiStep, setAiStep] = useState<'idle' | 'analyzing' | 'found' | 'redirecting'>('idle');
    const [aiMessage, setAiMessage] = useState("Analyzing your request...");

    const handleRedirect = async () => {
        setLoading(true);
        setAiStep('analyzing');
        setAiMessage("Connecting to intelligent support...");

        try {
            // Simulate AI "Thinking" time for UX (The "Impress" factor)
            await new Promise(r => setTimeout(r, 1500));

            setAiMessage("Optimizing connection to best agent...");
            setAiStep('found');

            // Call Backend (Next.js API Route)
            const response = await axios.get(`/api/redirect`, {
                params: {
                    slug,
                    intent,
                    device: 'mobile' // In real app, detect this
                }
            });

            if (response.data.success && response.data.targetUrl) {
                setAiStep('redirecting');
                setAiMessage("Redirecting to WhatsApp...");
                await new Promise(r => setTimeout(r, 800)); // Short delay to read message
                window.location.href = response.data.targetUrl;
            } else {
                alert('Campaign not active or error occurred.');
                setLoading(false);
                setAiStep('idle');
            }

        } catch (error) {
            console.error(error);
            setAiMessage("Error connecting. Please try again.");
            setLoading(false);
            setTimeout(() => setAiStep('idle'), 2000);
        }
    };

    return (
        <main className="relative w-full h-screen text-white overflow-hidden flex flex-col items-center justify-center">
            {/* 3D Background */}
            <ThreeBackground />

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 w-[90%] max-w-md p-8 glass-panel rounded-2xl flex flex-col items-center text-center space-y-6"
            >
                <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center mb-2 border border-neon-green/30 shadow-[0_0_15px_rgba(0,255,148,0.3)]">
                    <MessageCircle className="text-neon-green w-8 h-8" />
                </div>

                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Exclusive Access
                </h1>

                <p className="text-gray-400 text-sm">
                    Connect directly with our premium support team. Your session is secure and encrypted.
                </p>

                <div className="w-full h-[1px] bg-white/10" />

                <button
                    onClick={handleRedirect}
                    disabled={loading}
                    className="relative group w-full py-4 px-6 bg-electric-blue hover:bg-blue-600 transition-all rounded-xl font-bold tracking-wide overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? 'Processing...' : 'Start Chat on WhatsApp'}
                        {!loading && <ShieldCheck size={18} />}
                    </span>
                    {/* Glitch/Shine effect */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12" />
                </button>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={12} />
                    <span>Round-Robin Intelligent Routing Active</span>
                </div>
            </motion.div>

            {/* AI Chat Bubble Interstitial */}
            <AnimatePresence>
                {aiStep !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-10 z-50 max-w-sm w-[90%]"
                    >
                        <div className="glass-panel p-4 rounded-2xl rounded-bl-none border-neon-green/30 flex items-start gap-3 shadow-2xl">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-purple-600 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold">AI</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-neon-green text-xs font-bold mb-1">Gemini AI Assistant</p>
                                <p className="text-sm text-gray-200 typing-effect">
                                    {aiMessage}
                                </p>
                            </div>
                            {aiStep === 'analyzing' && <Loader2 className="animate-spin text-gray-400 w-4 h-4" />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .typing-effect {
           border-right: 2px solid rgba(255,255,255,0.5);
           white-space: nowrap;
           overflow: hidden;
           animation: blink 0.7s step-end infinite;
        }
        @keyframes blink {
           50% { border-color: transparent }
        }
      `}</style>
        </main>
    );
}
