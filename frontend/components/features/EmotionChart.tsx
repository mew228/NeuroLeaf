'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, ReferenceLine } from 'recharts';

interface EmotionChartProps {
    data: { name: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md p-3 rounded-lg border border-emerald-500/10 shadow-xl ring-1 ring-emerald-500/10">
                <p className="font-bold text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">{label}</p>
                <p className="text-foreground font-bold text-lg leading-none">
                    {payload[0].value} <span className="text-[10px] font-medium text-muted-foreground ml-1">Entries</span>
                </p>
            </div>
        );
    }
    return null;
};

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground/40 text-xs font-medium">
                No emotional data yet
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#6ee7b7', fontWeight: 600, fontFamily: 'monospace' }}
                    dy={10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.1)' }} />
                <Bar dataKey="count" radius={[4, 4, 4, 4]} barSize={32}>
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={index % 2 === 0 ? '#10b981' : '#0d9488'}
                            className="transition-all hover:opacity-80 cursor-pointer"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default EmotionChart;
