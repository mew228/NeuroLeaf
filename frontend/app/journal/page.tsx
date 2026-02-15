'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    BrainCircuit,
    Zap,
    AlertTriangle,
    History,
    PenTool,
    Calendar,
    ArrowRight,
    Maximize,
    Mic,
    StopCircle
} from 'lucide-react';
import api from '../../lib/api';
import { AIAnalysis, JournalEntry } from '../../lib/types';
import GlassCard from '../../components/common/GlassCard';
import { formatDate } from '../../lib/utils';
// import Link from 'next/link';
import { useToast } from '../../context/ToastContext';
import FocusMode from '../../components/features/FocusMode';

const JournalPage = () => {
    const { showToast } = useToast();
    const [view, setView] = useState<'write' | 'history'>('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(false);
    const [focusModeOpen, setFocusModeOpen] = useState(false);

    // Voice Journaling State
    const [isRecording, setIsRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);

    useEffect(() => {
        if (view === 'history') {
            fetchEntries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view]);

    const fetchEntries = async () => {
        setLoadingEntries(true);
        try {
            // Add timestamp to prevent caching
            const res = await api.get(`/journal/entries?t=${Date.now()}`);
            setEntries(Array.isArray(res.data) ? res.data : (res.data.entries || []));
        } catch (err) {
            console.error('Failed to fetch entries', err);
            showToast('Failed to load history', 'error');
        } finally {
            setLoadingEntries(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
                await sendAudioToBackend(audioBlob);
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            showToast('Voice Neural Sync Active...', 'info');
        } catch (err) {
            console.error('Failed to start recording', err);
            showToast('Microphone access denied', 'error');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToBackend = async (blob: Blob) => {
        setTranscribing(true);
        try {
            const formData = new FormData();
            const ext = blob.type.includes('webm') ? 'webm' : 'wav';
            formData.append('file', blob, `voice_entry.${ext}`);

            const res = await api.post('/journal/transcribe', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const text = res.data.text;
            if (text) {
                setContent(prev => prev ? `${prev}\n\n${text}` : text);
                showToast('Neural transcription complete', 'success');
            }
        } catch (err) {
            console.error('Failed to transcribe audio', err);
            showToast('Transcription failed', 'error');
        } finally {
            setTranscribing(false);
        }
    };

    const handleSave = async () => {
        if (!title || !content) return;
        setSaving(true);
        try {
            const entryRes = await api.post('/journal/entry', {
                title,
                content,
                entry_date: new Date().toISOString().split('T')[0]
            });
            const entryId = entryRes.data.id;

            showToast('Entry synced successfully', 'success');
            setFocusModeOpen(false);
            setTitle('');
            setContent('');
            if (view === 'history') fetchEntries();

            setAnalyzing(true);
            const analysisRes = await api.post(`/analysis/trigger/${entryId}`);
            setAnalysis(analysisRes.data);
            showToast('Neural analysis complete', 'success');
        } catch (err) {
            console.error('Failed to save or analyze entry', err);
            showToast('Failed to sync entry', 'error');
        } finally {
            setSaving(false);
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24 lg:pb-0">
            {/* Header with Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        {view === 'write' ? (
                            <>Write your <span className="text-gradient">truth.</span></>
                        ) : (
                            <>Your <span className="text-gradient">Journey.</span></>
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        {view === 'write' ? "Neural processing is active. Express yourself freely." : "Reflect on your past entries and insights."}
                    </p>
                </motion.div>

                <div className="flex items-center gap-3 bg-secondary/50 p-1.5 rounded-2xl border border-white/10">
                    <button
                        onClick={() => setView('write')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${view === 'write'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <PenTool className="w-4 h-4" />
                        Write
                    </button>
                    <button
                        onClick={() => setView('history')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${view === 'history'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        History
                    </button>
                </div>

                {/* Focus Mode Toggle */}
                <button
                    onClick={() => setFocusModeOpen(true)}
                    className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 font-bold text-sm transition-all border border-white/5 hover:border-emerald-500/20"
                >
                    <Maximize className="w-4 h-4" />
                    Focus
                </button>
            </div>

            <AnimatePresence mode="wait">
                {view === 'write' ? (
                    <motion.div
                        key="write"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid lg:grid-cols-3 gap-8 items-start px-4 md:px-0"
                    >
                        {/* Editor Space */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card p-1 rounded-[2.5rem] overflow-hidden focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all duration-500 relative">
                                <input
                                    type="text"
                                    placeholder="Atmospheric Title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-transparent p-8 text-3xl font-black tracking-tight border-none focus:outline-none placeholder:text-muted-foreground/30 text-foreground"
                                />
                                <div className="h-px bg-emerald-500/10 mx-8" />
                                <textarea
                                    placeholder="Let your thoughts flow into the neural void..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={15}
                                    className="w-full bg-transparent p-8 text-xl font-medium leading-relaxed border-none focus:outline-none resize-none placeholder:text-muted-foreground/30 text-foreground/80 focus:ring-0"
                                />
                                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span>Chars: {content.length}</span>
                                        <span>Words: {content.match(/\S+/g)?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        Neural Sync Active
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled={transcribing || saving}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl ${isRecording
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/30 animate-pulse'
                                        : 'bg-white/5 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20 shadow-black/20'
                                        }`}
                                >
                                    {transcribing ? (
                                        <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                    ) : isRecording ? (
                                        <StopCircle className="w-5 h-5" />
                                    ) : (
                                        <Mic className="w-5 h-5" />
                                    )}
                                    {transcribing ? 'Transcribing...' : isRecording ? 'Stop Sync' : 'Voice Journal'}
                                </button>

                                <button
                                    onClick={handleSave}
                                    disabled={saving || !title || !content || isRecording}
                                    className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-emerald-500/30"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Sparkles className="w-5 h-5" />
                                    )}
                                    {saving ? 'Processing...' : 'Sync to Neural Cache'}
                                </button>
                            </div>
                        </div>

                        {/* Analysis Sidebar */}
                        <div className="space-y-6">
                            {analyzing && (
                                <GlassCard className="flex flex-col items-center text-center space-y-6 animate-pulse p-10">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <BrainCircuit className="w-8 h-8 text-emerald-600 animate-bounce" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight text-foreground">Scanning Essence</h3>
                                        <p className="text-sm text-muted-foreground font-medium mt-2">Our AI is deciphering the emotional subtext of your entry...</p>
                                    </div>
                                </GlassCard>
                            )}

                            {analysis && !analyzing && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Reflection Card */}
                                    <GlassCard className="pb-12 text-foreground relative overflow-hidden" gradientBorder="emerald">
                                        <div className="absolute top-0 right-0 p-8">
                                            <Sparkles className="w-10 h-10 text-emerald-500/20" />
                                        </div>

                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6">Neural Insight</h3>
                                        <p className="text-2xl font-black italic tracking-tight leading-snug">
                                            &quot;{analysis.ai_reflection}&quot;
                                        </p>
                                    </GlassCard>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <GlassCard className="p-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sentiment</span>
                                            <p className="text-xl font-black text-emerald-600 mt-1 capitalize truncate">{analysis.sentiment.label}</p>
                                        </GlassCard>
                                        <GlassCard className="p-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary</span>
                                            <p className="text-xl font-black text-emerald-600 mt-1 capitalize truncate">{analysis.emotions.primary}</p>
                                        </GlassCard>
                                    </div>

                                    {/* Stress Indicator */}
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
                            )}

                            {!analysis && !analyzing && (
                                <GlassCard className="border-dashed border-2 flex flex-col items-center text-center space-y-4 p-10">
                                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
                                        <Zap className="w-7 h-7 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-bold tracking-tight px-4">
                                        Write and sync your entry to receive an AI neural analysis of your emotional state.
                                    </p>
                                </GlassCard>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0"
                    >
                        {loadingEntries ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <GlassCard key={i} className="h-64 animate-pulse flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="w-1/3 h-4 bg-secondary rounded-full" />
                                        <div className="w-3/4 h-6 bg-secondary rounded-lg" />
                                        <div className="w-full h-20 bg-secondary rounded-lg" />
                                    </div>
                                    <div className="w-1/2 h-4 bg-secondary rounded-full" />
                                </GlassCard>
                            ))
                        ) : entries.length > 0 ? (
                            entries.map((entry) => (
                                <GlassCard key={entry.id} className="group hover:border-emerald-500/30 cursor-pointer flex flex-col h-full" hoverEffect={true}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(entry.entry_date)}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-foreground mb-3 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                        {entry.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium line-clamp-3 mb-6 flex-1 px-1">
                                        {entry.content}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                                            {entry.word_count} Words
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform group-hover:text-emerald-600" />
                                    </div>
                                </GlassCard>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                                    <PenTool className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground">No entries found</h3>
                                <p className="text-muted-foreground font-medium mt-2 mb-8">Start writing your first entry to populate your history.</p>
                                <button
                                    onClick={() => setView('write')}
                                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
                                >
                                    Start Writing
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Neural Void Focus Mode */}
            <FocusMode
                isOpen={focusModeOpen}
                onClose={() => setFocusModeOpen(false)}
                title={title}
                content={content}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onSubmit={handleSave}
                isSubmitting={saving}
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                transcribing={transcribing}
            />
        </div>
    );
};

export default JournalPage;
