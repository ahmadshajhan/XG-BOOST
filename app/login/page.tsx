'use client';

import React, { useState } from 'react';
import ThreeBackground from '@/components/ThreeBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [zoomEffect, setZoomEffect] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError('Invalid credentials');
            setLoading(false);
        } else {
            // Success! Trigger Warp Speed
            setZoomEffect(true);
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 1500); // Wait for zoom effect
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
            <ThreeBackground zoom={zoomEffect} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: zoomEffect ? 0 : 1, scale: zoomEffect ? 2 : 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-4"
            >
                <GlassCard className="p-8 border-neon-green/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-green/50">
                            <Lock className="text-neon-green w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
                        <p className="text-gray-400 text-sm mt-2">Identify yourself to proceed.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-xs uppercase text-gray-500 mb-2 block">Identity</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-neon-green outline-none transition-colors"
                                placeholder="admin@xgboost.io"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase text-gray-500 mb-2 block">Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-neon-green outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neon-green text-black font-bold py-4 rounded flex items-center justify-center gap-2 hover:bg-green-400 transition-all hover:shadow-[0_0_20px_rgba(0,255,148,0.4)]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Initialize Session <ArrowRight size={18} /></>}
                        </button>
                    </form>
                </GlassCard>
            </motion.div>
        </div>
    );
}
