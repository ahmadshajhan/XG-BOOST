'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface DashboardChartsProps {
    campaignId: string;
}

interface ChartData {
    dailyClicks: { _id: string; count: number }[];
    deviceStats: { _id: string; count: number }[];
}

export default function DashboardCharts({ campaignId }: DashboardChartsProps) {
    const [data, setData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/campaign/${campaignId}/stats`);
                if (res.data.success) {
                    setData(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch stats", e);
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) fetchData();
    }, [campaignId]);

    if (loading) {
        return <div className="h-64 flex items-center justify-center text-neon-green"><Loader2 className="animate-spin" /></div>;
    }

    if (!data) return <div className="text-gray-500 text-center py-10">No Data Available</div>;

    const COLORS = ['#00FF94', '#2D5BFF', '#A855F7', '#FF0055'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Area Chart */}
            <div className="h-64 w-full">
                <h4 className="text-xs uppercase text-gray-500 mb-4">Traffic (Last 7 Days)</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.dailyClicks}>
                        <defs>
                            <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="_id" stroke="#666" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#00FF94' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#00FF94" fillOpacity={1} fill="url(#colorClick)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="h-64 w-full">
                <h4 className="text-xs uppercase text-gray-500 mb-4">Device Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.deviceStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                        >
                            {data.deviceStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
