'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Moon, Sparkles, Tag, Mic, BrainCircuit } from 'lucide-react';
import { DreamEntry, DreamType } from '../../lib/types'; // Assuming this imports the types correctly
import GlassCard from '../common/GlassCard';
import { formatDate } from '../../lib/utils';
import Image from 'next/image';

interface DreamCardProps {
    entry: DreamEntry;
    onClick?: () => void;
}

const typeColors: Record<string, string> = {
    lucid: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    nightmare: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    recurring: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    prophetic: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    normal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const mapTypeToColor = (type: string) => {
    return typeColors[type] || typeColors.normal;
};

const DreamCard: React.FC<DreamCardProps> = ({ entry, onClick }) => {
    const typeColorClass = mapTypeToColor(entry.type);

    return (
        <GlassCard
            className="group cursor-pointer hover:border-emerald-500/30 overflow-hidden relative flex flex-col h-full min-h-[300px]"
            hoverEffect={true}
            gradientBorder="none"
            delay={0.1}
        >
            {/* Background Image (if available) */}
            {entry.imageUrl ? (
                <div className="absolute inset-0 z-0">
                    <img
                        src={entry.imageUrl}
                        alt={entry.title}
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
            ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-emerald-900/10 opacity-50" />
            )}

            <div className="relative z-10 flex flex-col h-full p-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-background/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(entry.date)}
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${typeColorClass} backdrop-blur-sm`}>
                        {entry.type}
                    </div>
                </div>

                {/* Content */}
                <div className="mt-auto mb-4">
                    <h3 className="text-2xl font-black text-foreground mb-2 group-hover:text-emerald-400 transition-colors drop-shadow-lg">
                        {entry.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-3 leading-relaxed drop-shadow-md">
                        {entry.description}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                    <div className="flex gap-2">
                        {entry.audioUrl && (
                            <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20" title="Voice Note">
                                <Mic className="w-4 h-4" />
                            </div>
                        )}
                        {entry.interpretation && (
                            <div className="p-2 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/20" title="AI Interpreted">
                                <BrainCircuit className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    {entry.lucidityLevel > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                            <Sparkles className="w-3 h-3" />
                            Lucidity: {entry.lucidityLevel}/10
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};

export default DreamCard;
