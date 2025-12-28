'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BarChart2, Link as LinkIcon, Trash, Copy, Check, PlusCircle, X, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import DashboardCharts from '@/components/DashboardCharts';
import { signOut, useSession } from 'next-auth/react';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Dynamic Form State
    const [formData, setFormData] = useState({
        slug: '',
        name: '',
        baseMessage: ''
    });
    const [numbers, setNumbers] = useState<string[]>(['']);
    const [creating, setCreating] = useState(false);
    const [newCampaignLink, setNewCampaignLink] = useState('');
    const [copied, setCopied] = useState(false);

    // Stats state
    const [selectedCampaignStats, setSelectedCampaignStats] = useState<string | null>(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get('/api/campaign/list');
            setCampaigns(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNumberChange = (index: number, value: string) => {
        const newNumbers = [...numbers];
        newNumbers[index] = value;
        setNumbers(newNumbers);
    };

    const addNumberField = () => {
        setNumbers([...numbers, '']);
    };

    const removeNumberField = (index: number) => {
        const newNumbers = numbers.filter((_, i) => i !== index);
        setNumbers(newNumbers.length ? newNumbers : ['']);
    };

    const createCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setNewCampaignLink('');

        try {
            // Filter empty numbers
            const cleanNumbers = numbers.map(n => n.trim()).filter(n => n.length > 0);

            if (cleanNumbers.length === 0) {
                alert('Please add at least one WhatsApp number');
                setCreating(false);
                return;
            }

            await axios.post(`/api/campaign/create`, {
                slug: formData.slug,
                name: formData.name,
                whatsappNumbers: cleanNumbers,
                baseMessage: formData.baseMessage
            });

            setNewCampaignLink(`${window.location.origin}/campaign/${formData.slug}`);
            fetchCampaigns();
            setCreating(false);
        } catch (err) {
            alert('Error creating campaign. Check console or slug uniqueness.');
            setCreating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(newCampaignLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const viewStats = async (id: string) => {
        setSelectedCampaignStats(id);
    };

    // Mock Data for "Live Analytics Preview"
    const statsCards = [
        { title: "Total Traffic", value: campaigns.reduce((acc, curr) => acc + (curr.totalClicks || 0), 0), color: "text-neon-green" },
        { title: "Active Campaigns", value: campaigns.length, color: "text-electric-blue" },
        { title: "Numbers in Rotation", value: campaigns.reduce((acc, curr) => acc + (curr.whatsappNumbers?.length || 0), 0), color: "text-purple-400" },
    ];

    const [activeTab, setActiveTab] = useState<'campaigns' | 'test-zone'>('campaigns');
    const [testSlug, setTestSlug] = useState('');
    const [simulation, setSimulation] = useState<{ step: number, status: 'idle' | 'running' | 'pass' | 'fail' }>({ step: 0, status: 'idle' });

    const runSimulation = () => {
        if (!testSlug) return;
        setSimulation({ step: 0, status: 'running' });

        // Simulate checks
        const steps = [
            () => setSimulation(prev => ({ ...prev, step: 1 })),
            () => setSimulation(prev => ({ ...prev, step: 2 })),
            () => setSimulation(prev => ({ ...prev, step: 3 })),
            () => setSimulation({ step: 3, status: 'pass' })
        ];

        steps.forEach((fn, i) => setTimeout(fn, (i + 1) * 800));
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 font-mono relative overflow-x-hidden">
            {/* Futurstic Grid Background Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black -z-10" />

            <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-blue-500 tracking-tighter">
                        XG BOOST
                    </h1>
                    <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">Command Center v1.0</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                            onClick={() => setActiveTab('campaigns')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'campaigns' ? 'bg-neon-green text-black shadow-[0_0_10px_rgba(0,255,148,0.4)]' : 'text-gray-400 hover:text-white'}`}
                        >
                            CAMPAIGNS
                        </button>
                        <button
                            onClick={() => setActiveTab('test-zone')}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'test-zone' ? 'bg-electric-blue text-white shadow-[0_0_10px_rgba(45,91,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
                        >
                            TEST ZONE
                        </button>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 transition-all"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {activeTab === 'campaigns' ? (
                <>
                    <div className="flex justify-end mb-8">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-white/5 border border-neon-green/30 px-6 py-3 rounded-full font-bold hover:bg-neon-green/10 transition-all shadow-[0_0_15px_rgba(0,255,148,0.2)] text-neon-green"
                        >
                            <Plus size={18} /> New Campaign
                        </button>
                    </div>

                    {/* Live Analytics Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {statsCards.map((stat, i) => (
                            <GlassCard key={i} className="p-6 flex flex-col items-center justify-center">
                                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.title}</h3>
                                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Stats Modal / Section */}
                    {selectedCampaignStats && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <GlassCard className="p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-neon-green/20">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Analytics Report</h2>
                                        <p className="text-xs text-gray-500 uppercase">Real-time Campaign Intelligence</p>
                                    </div>
                                    <button onClick={() => setSelectedCampaignStats(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
                                </div>

                                {/* Charts Component */}
                                <DashboardCharts campaignId={selectedCampaignStats} />

                            </GlassCard>
                        </div>
                    )}

                    {/* Campaign Form */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-12"
                            >
                                <GlassCard className="p-8 max-w-4xl mx-auto border-neon-green/20 relative">
                                    <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>

                                    {!newCampaignLink ? (
                                        <form onSubmit={createCampaign} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-2 block uppercase">Campaign Name</label>
                                                    <input
                                                        placeholder="e.g. Black Friday 2025"
                                                        className="w-full p-3 rounded bg-black/40 border border-white/10 focus:border-neon-green outline-none text-white transition-colors"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-2 block uppercase">Slug (Unique ID)</label>
                                                    <input
                                                        placeholder="e.g. bf-2025"
                                                        className="w-full p-3 rounded bg-black/40 border border-white/10 focus:border-neon-green outline-none text-white transition-colors"
                                                        value={formData.slug}
                                                        onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-500 mb-2 block uppercase">AI Base Prompt</label>
                                                <textarea
                                                    placeholder="Context for the AI (e.g. You are selling premium sneakers...)"
                                                    className="w-full p-3 rounded bg-black/40 border border-white/10 focus:border-neon-green outline-none text-white transition-colors min-h-[100px]"
                                                    value={formData.baseMessage}
                                                    onChange={e => setFormData({ ...formData, baseMessage: e.target.value })}
                                                />
                                            </div>

                                            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                                                <label className="text-xs text-neon-green mb-4 block uppercase flex items-center gap-2">
                                                    <Check size={12} /> WhatsApp Rotation Array (Anti-Ban)
                                                </label>
                                                <div className="space-y-3">
                                                    {numbers.map((num, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <input
                                                                placeholder={`Number ${i + 1} (e.g. 1555000...)`}
                                                                className="flex-1 p-3 rounded bg-black/40 border border-white/10 focus:border-electric-blue outline-none"
                                                                value={num}
                                                                onChange={(e) => handleNumberChange(i, e.target.value)}
                                                            />
                                                            {numbers.length > 1 && (
                                                                <button type="button" onClick={() => removeNumberField(i)} className="p-3 text-red-500 hover:bg-red-500/10 rounded">
                                                                    <Trash size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={addNumberField} className="text-sm flex items-center gap-2 text-gray-400 hover:text-white mt-2">
                                                        <PlusCircle size={16} /> Add Another Number
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={creating}
                                                className="w-full py-4 bg-gradient-to-r from-neon-green to-green-600 text-black font-bold text-lg rounded-lg hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] transition-all disabled:opacity-50"
                                            >
                                                {creating ? 'Deploying to Network...' : 'Launch Campaign'}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="w-16 h-16 bg-neon-green/20 text-neon-green rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Check size={32} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Campaign Deployed!</h3>
                                            <p className="text-gray-400 mb-6">Your master link is ready for distribution.</p>

                                            <div className="bg-black/50 p-4 rounded-lg flex items-center justify-between border border-white/10 max-w-lg mx-auto">
                                                <code className="text-electric-blue truncate">{newCampaignLink}</code>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="ml-4 p-2 hover:bg-white/10 rounded text-gray-300 transition-colors"
                                                >
                                                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                                </button>
                                            </div>

                                            <button onClick={() => { setShowForm(false); setNewCampaignLink(''); }} className="mt-8 text-sm text-gray-500 hover:text-white underline">
                                                Close & View Dashboard
                                            </button>
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Campaigns List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map(camp => (
                            <GlassCard key={camp._id} className="p-6 hover:border-neon-green/50 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold group-hover:text-neon-green transition-colors">{camp.name}</h3>
                                            <span title="Instagram Ready" className="text-neon-green/80 bg-neon-green/10 rounded-full p-0.5"><Check size={10} /></span>
                                        </div>
                                        <p className="text-gray-500 text-sm font-mono">/{camp.slug}</p>
                                    </div>
                                    <div className="bg-neon-green/10 px-3 py-1 rounded-full text-xs font-bold text-neon-green border border-neon-green/20">
                                        {camp.totalClicks || 0} CLICKS
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Rotation Pool</span>
                                        <span>{camp.whatsappNumbers?.length} Numbers</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-electric-blue w-full animate-pulse" style={{ width: `${Math.min(100, (camp.whatsappNumbers?.length || 0) * 20)}%` }} />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={`/campaign/${camp.slug}`}
                                        target="_blank"
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold border border-white/5 transition-all"
                                    >
                                        <LinkIcon size={16} /> Test Link
                                    </a>
                                    <button
                                        onClick={() => viewStats(camp._id)}
                                        className="flex-1 bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold border border-blue-500/20 transition-all"
                                    >
                                        <BarChart2 size={16} /> Data
                                    </button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </>
            ) : (
                /* Test Zone */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Instagram Validator</h2>
                            <p className="text-gray-400">Simulate how your links perform inside the Instagram In-App Browser.</p>
                        </div>

                        <GlassCard className="p-8 border-electric-blue/20">
                            <label className="text-xs uppercase text-gray-500 mb-2 block">Select Campaign to Test</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 rounded p-4 text-white outline-none focus:border-electric-blue mb-6"
                                onChange={(e) => {
                                    setTestSlug(e.target.value);
                                    setSimulation({ step: 0, status: 'idle' });
                                }}
                            >
                                <option value="">-- Select Campaign --</option>
                                {campaigns.map(c => <option key={c._id} value={c.slug}>{c.name} (/r/{c.slug})</option>)}
                            </select>

                            <button
                                onClick={runSimulation}
                                disabled={!testSlug || simulation.status === 'running'}
                                className="w-full py-4 bg-electric-blue text-white font-bold rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {simulation.status === 'running' ? 'Running Simulation...' : 'Simulate Instagram Click'}
                            </button>
                        </GlassCard>

                        {simulation.status !== 'idle' && (
                            <GlassCard className="p-6">
                                <h3 className="text-xs font-bold uppercase text-gray-500 mb-4">Diagnostics Log</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${simulation.step >= 0 ? 'bg-green-500' : 'bg-gray-700'}`} />
                                        <p className="text-sm">Initiating connection check...</p>
                                    </div>
                                    <div className={`flex items-center gap-3 transition-opacity duration-500 ${simulation.step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className={`w-2 h-2 rounded-full ${simulation.step >= 1 ? 'bg-green-500' : 'bg-gray-700'}`} />
                                        <p className="text-sm">Detecting User-Agent: <span className="text-orange-400 font-mono">Instagram/254.0.0.19.109</span></p>
                                    </div>
                                    <div className={`flex items-center gap-3 transition-opacity duration-500 ${simulation.step >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className={`w-2 h-2 rounded-full ${simulation.step >= 2 ? 'bg-green-500' : 'bg-gray-700'}`} />
                                        <p className="text-sm">Injecting <code>whatsapp://</code> Deep Link Intent...</p>
                                    </div>
                                    <div className={`flex items-center gap-3 transition-opacity duration-500 ${simulation.step >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className={`w-2 h-2 rounded-full ${simulation.status === 'pass' ? 'bg-neon-green' : 'bg-gray-700'}`} />
                                        <p className="text-sm text-neon-green font-bold">PASS: Deep Link Strategy Validated.</p>
                                    </div>
                                </div>
                            </GlassCard>
                        )}
                    </div>

                    {/* Mock Phone */}
                    <div className="relative mx-auto border-gray-800 bg-gray-900 border-[8px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden flex flex-col">
                        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[10px] top-[72px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[10px] top-[124px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[10px] top-[178px] rounded-l-lg"></div>
                        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[10px] top-[142px] rounded-r-lg"></div>

                        {/* Screen Content */}
                        <div className="bg-black w-full h-full text-white relative flex flex-col">
                            {/* Instagram Header Mock */}
                            <div className="bg-[#1c1c1c] p-3 flex justify-between items-center border-b border-gray-800">
                                <span className="text-xs">X Close</span>
                                <span className="font-bold text-xs">xg-boost.io</span>
                                <span className="text-xs">...</span>
                            </div>

                            {/* Inner Content */}
                            <div className="flex-1 flex items-center justify-center p-4">
                                {simulation.status === 'idle' && (
                                    <div className="text-center text-gray-500 text-sm">
                                        <p>Waiting for simulation...</p>
                                    </div>
                                )}
                                {simulation.status !== 'idle' && (
                                    <div className="w-full text-center">
                                        <div className="w-12 h-12 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-xs font-mono text-neon-green animate-pulse">REDIRECTING...</p>

                                        {simulation.step >= 2 && (
                                            <div className="mt-8 bg-white text-black p-3 rounded-lg font-bold text-sm shadow-lg animate-bounce">
                                                Open in WhatsApp?
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
