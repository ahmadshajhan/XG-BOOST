'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function RedirectPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string;
    const intent = searchParams.get('intent') || '';

    const [status, setStatus] = useState<'analyzing' | 'connecting' | 'redirecting' | 'error'>('analyzing');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const initRedirect = async () => {
            try {
                // Stay on "analyzing" for dramatic effect
                await new Promise(r => setTimeout(r, 800));
                setStatus('connecting');

                const res = await axios.get(`/api/redirect`, {
                    params: {
                        slug,
                        intent,
                        device: 'mobile' // In prod, use a hook to detect this
                    }
                });

                if (res.data.success) {
                    await new Promise(r => setTimeout(r, 800)); // "Connecting..."
                    setStatus('redirecting');
                    window.location.href = res.data.targetUrl;
                } else {
                    setStatus('error');
                    setErrorMsg('Campaign invalid or expired.');
                }

            } catch (err) {
                setStatus('error');
                setErrorMsg('Connection failed. Please try again.');
            }
        };

        if (slug) initRedirect();
    }, [slug, intent]);

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Link Expired</h1>
                <p className="text-gray-500 mb-6">{errorMsg}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 rounded hover:bg-white/20 transition">
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Radar Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 2, 3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="w-32 h-32 border border-neon-green/30 rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    className="w-32 h-32 bg-neon-green/10 rounded-full absolute"
                />
            </div>

            <div className="z-10 flex flex-col items-center space-y-8">
                <div className="w-16 h-16 bg-black border border-neon-green rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,148,0.4)] relative">
                    <ShieldCheck className="text-neon-green w-8 h-8" />
                    {/* Spinner Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-neon-green rounded-full w-full h-full"
                    />
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold font-mono tracking-widest">
                        {status === 'analyzing' && 'ANALYZING ROUTE...'}
                        {status === 'connecting' && 'CONNECTING AGENT...'}
                        {status === 'redirecting' && 'REDIRECTING...'}
                    </h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                        Secure Encryption Active
                    </p>
                </div>
            </div>
        </div>
    );
}
