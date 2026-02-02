'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BrainCircuit, Sparkles, AlertTriangle } from 'lucide-react';
import api from '../../../lib/api';
import { JournalEntry, AIAnalysis } from '../../../lib/types';
import GlassCard from '../../../components/common/GlassCard';
import InsightOrb from '../../../components/features/InsightOrb';
import { formatDate } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';

const JournalDetail = () => {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const id = params?.id as string;

    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchEntry();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchEntry = async () => {
        try {
            const res = await api.get(`/journal/entry/${id}`);
            const entryData = res.data.entry || res.data;
            setEntry(entryData);

            if (entryData.has_analysis) {
                const analysisRes = await api.get(`/analysis/${id}`);
                setAnalysis(analysisRes.data);
            }
        } catch (err) {
            console.error('Failed to fetch entry', err);
            showToast('Failed to load entry', 'error');
            router.push('/journal');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse pb-24 lg:pb-0">
                <div className="h-8 w-24 bg-secondary rounded-full" />
                <div className="space-y-4">
                    <div className="h-12 w-3/4 bg-secondary rounded-xl" />
                    <div className="h-4 w-40 bg-secondary rounded-full" />
                </div>
                <div className="h-64 bg-secondary rounded-[2.5rem]" />
            </div>
        );
    }

    if (!entry) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24 lg:pb-0">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-emerald-600 transition-colors mb-6 font-bold text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Journal
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
                        {entry.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        {formatDate(entry.entry_date)}
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <GlassCard className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/90 p-10 font-medium">
                {entry.content}
            </GlassCard>

            {/* Analysis Section */}
            {analysis && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                        <BrainCircuit className="w-6 h-6 text-emerald-600" />
                        Neural Analysis
                    </h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <GlassCard className="pb-12 text-foreground relative overflow-hidden" gradientBorder="emerald">
                            <div className="absolute top-0 right-0 p-8">
                                <InsightOrb intensity="high" size="lg" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6">Insight</h3>
                            <p className="text-2xl font-black italic tracking-tight leading-snug pr-16">
                                &quot;{analysis.ai_reflection}&quot;
                            </p>
                        </GlassCard>

                        <div className="grid md:grid-cols-2 gap-4">
                            <GlassCard className="p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sentiment</span>
                                <p className="text-2xl font-black text-emerald-600 mt-1 capitalize">{analysis.sentiment.label}</p>
                            </GlassCard>
                            <GlassCard className="p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Emotion</span>
                                <p className="text-2xl font-black text-emerald-600 mt-1 capitalize">{analysis.emotions.primary}</p>
                            </GlassCard>
                        </div>

                        <GlassCard className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stress Level</span>
                                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${analysis.stress.level === 'low' ? 'bg-emerald-500/10 text-emerald-600' :
                                    analysis.stress.level === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                                        'bg-rose-500/10 text-rose-600'
                                    }`}>
                                    {analysis.stress.level}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.stress.keywords.map((kw, i) => (
                                    <span key={i} className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl">
                                        #{kw}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>

                        {analysis.crisis_detected && (
                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-rose-500 text-sm">Action Required</h4>
                                    <p className="text-xs text-rose-600/80 mt-1 leading-relaxed font-medium">
                                        Our AI detected signs of significant distress. We recommend connecting with support resources.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default JournalDetail;
