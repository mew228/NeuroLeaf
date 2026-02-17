'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    Maximize2,
    Mic,
    StopCircle,
    Search,
    BookOpen,
    Filter,
    BarChart3
} from 'lucide-react';
import api from '../../lib/api';
import { AIAnalysis, JournalEntry } from '../../lib/types';
import GlassCard from '../../components/common/GlassCard';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import FocusMode from '../../components/features/FocusMode';
import EmotionChart from '../../components/features/EmotionChart';

// Stats Calculation Helper
const calculateStats = (entries: JournalEntry[]) => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((acc, curr) => acc + (curr.word_count || 0), 0);

    // Calculate emotion distribution
    const emotionCounts: Record<string, number> = {};
    entries.forEach(entry => {
        // Assuming entry has an 'emotion' field or we derive it from analysis if available
        // If not available in list, we might need to rely on what's there. 
        // For now, let's mock or use a placeholder if the data isn't directly on the list object
        // The API response for list might normally not contain full analysis.
        // If it does, we use it. If not, we skip this part.
    });

    return { totalEntries, totalWords };
};

type View = 'write' | 'history';

const JournalPage = () => {
    const { showToast } = useToast();
    const [view, setView] = useState<View>('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(false);
    const [focusModeOpen, setFocusModeOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredEntries = useMemo(() => {
        return entries.filter(entry =>
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [entries, searchQuery]);

    const stats = useMemo(() => calculateStats(entries), [entries]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-2 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"
                    >
                        <Sparkles className="w-3 h-3" />
                        Thought Processor
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                        Neural Journal
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-md">
                        Capture your thoughts, analyze your emotions, and track your mental journey.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="p-1.5 bg-secondary/50 backdrop-blur-md rounded-2xl flex items-center gap-1 border border-white/5">
                    {[
                        { id: 'write', icon: PenTool, label: 'Write' },
                        { id: 'history', icon: BookOpen, label: 'History' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id as View)}
                            className={cn(
                                "px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all relative overflow-hidden",
                                view === tab.id
                                    ? "text-emerald-50 text-shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {view === tab.id && (
                                <motion.div
                                    layoutId="activeView"
                                    className="absolute inset-0 bg-emerald-500 shadow-lg shadow-emerald-500/25"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'write' ? (
                    <motion.div
                        key="write"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid lg:grid-cols-12 gap-8 items-start"
                    >
                        {/* Editor Area */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="glass-card p-1 rounded-[2.5rem] overflow-hidden group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-500 relative bg-gradient-to-br from-white/5 to-white/0">
                                <input
                                    type="text"
                                    placeholder="Title your entry..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-transparent p-8 pb-4 text-3xl font-black tracking-tight border-none focus:outline-none placeholder:text-muted-foreground/30 text-foreground"
                                />
                                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent mx-8" />
                                <textarea
                                    placeholder="What's on your mind today?"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={16}
                                    className="w-full bg-transparent p-8 text-lg md:text-xl font-medium leading-relaxed border-none focus:outline-none resize-none placeholder:text-muted-foreground/30 text-foreground/80 focus:ring-0 custom-scrollbar"
                                />

                                {/* Status Bar */}
                                <div className="px-8 py-4 bg-emerald-950/20 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                                    <div className="flex items-center gap-6">
                                        <span>{content.length} Chars</span>
                                        <span>{content.match(/\S+/g)?.length || 0} Words</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-500/70">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Auto-Sync Ready
                                    </div>
                                </div>
                            </div>

                            {/* Actions Toolbar */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        disabled={transcribing || saving}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg border ${isRecording
                                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'
                                            : 'bg-secondary/50 text-muted-foreground hover:text-emerald-400 border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                                            }`}
                                    >
                                        {transcribing ? (
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : isRecording ? (
                                            <StopCircle className="w-5 h-5 animate-pulse" />
                                        ) : (
                                            <Mic className="w-5 h-5" />
                                        )}
                                        <span className="md:hidden lg:inline">{transcribing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Voice Note'}</span>
                                    </button>

                                    <button
                                        onClick={() => setFocusModeOpen(true)}
                                        className="p-4 rounded-2xl bg-secondary/50 text-muted-foreground hover:text-emerald-400 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all active:scale-95"
                                        title="Enter Focus Mode"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={saving || !title || !content || isRecording}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <BrainCircuit className="w-5 h-5" />
                                    )}
                                    {saving ? 'Analyzing...' : 'Save & Analyze'}
                                </button>
                            </div>
                        </div>

                        {/* Analysis Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <AnimatePresence mode="wait">
                                {analyzing ? (
                                    <GlassCard className="flex flex-col items-center text-center space-y-6 animate-pulse p-12 border-emerald-500/30">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                            <BrainCircuit className="w-12 h-12 text-emerald-500 relative z-10 animate-bounce" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight text-foreground">Scanning Essence</h3>
                                            <p className="text-sm text-muted-foreground font-medium mt-2">
                                                Decoding emotional patterns and extracting insights...
                                            </p>
                                        </div>
                                    </GlassCard>
                                ) : analysis ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Insight Card */}
                                        <GlassCard className="p-8 relative overflow-hidden" gradientBorder="emerald">
                                            <div className="absolute top-0 right-0 p-6 opacity-50">
                                                <Sparkles className="w-12 h-12 text-emerald-500/10" />
                                            </div>

                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                                    <Zap className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Core Insight</span>
                                            </div>

                                            <p className="text-xl font-bold italic leading-relaxed text-foreground/90">
                                                &quot;{analysis.ai_reflection}&quot;
                                            </p>
                                        </GlassCard>

                                        {/* Metrics Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <GlassCard className="p-5 flex flex-col justify-between h-32 hover-effect">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mood</span>
                                                <div>
                                                    <div className="text-2xl font-black text-emerald-500 mb-1 capitalize truncate">{analysis.sentiment.label}</div>
                                                    <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.abs(analysis.sentiment.score * 100)}%` }} />
                                                    </div>
                                                </div>
                                            </GlassCard>

                                            <GlassCard className="p-5 flex flex-col justify-between h-32 hover-effect">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Emotion</span>
                                                <div className="text-2xl font-black text-emerald-500 capitalize truncate">{analysis.emotions.primary}</div>
                                            </GlassCard>
                                        </div>

                                        {/* Stress Level */}
                                        <GlassCard className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${analysis.stress.level === 'low' ? 'bg-emerald-500' : analysis.stress.level === 'medium' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                                <span className="text-sm font-bold capitalize">{analysis.stress.level} Stress</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {analysis.stress.level === 'low' ? 'Optimal' : 'Elevated'}
                                            </span>
                                        </GlassCard>

                                        {analysis.crisis_detected && (
                                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-start gap-4">
                                                <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-rose-500 text-sm">Action Required</h4>
                                                    <p className="text-xs text-rose-400 mt-1 leading-relaxed">
                                                        We've detected signs of distress. Please consider reaching out to a professional or trusted contact.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <GlassCard className="h-full min-h-[400px] border-dashed border-2 flex flex-col items-center justify-center text-center p-12 space-y-6 opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="w-20 h-20 bg-emerald-500/5 rounded-full flex items-center justify-center">
                                            <BrainCircuit className="w-10 h-10 text-emerald-500/30" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">Awaiting Input</h3>
                                            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                                                Your journal entry will be analyzed for sentiment, emotion, and stress indicators.
                                            </p>
                                        </div>
                                    </GlassCard>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Search & Stats Bar */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search entries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-secondary/30 border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:bg-secondary/50 focus:border-emerald-500/30 transition-all font-medium"
                                />
                            </div>
                            <div className="flex gap-4">
                                <GlassCard className="flex-1 p-4 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">Total Entries</span>
                                    <span className="text-xl font-black text-emerald-500">{stats.totalEntries}</span>
                                </GlassCard>
                                <GlassCard className="flex-1 p-4 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">Words</span>
                                    <span className="text-xl font-black text-emerald-500">{stats.totalWords}</span>
                                </GlassCard>
                            </div>
                        </div>

                        {/* Recent Entries Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loadingEntries ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <GlassCard key={i} className="h-64 animate-pulse p-6">
                                        <div className="space-y-4 h-full flex flex-col">
                                            <div className="w-1/3 h-4 bg-emerald-500/10 rounded-full" />
                                            <div className="w-3/4 h-8 bg-emerald-500/10 rounded-lg" />
                                            <div className="flex-1 bg-emerald-500/5 rounded-xl" />
                                        </div>
                                    </GlassCard>
                                ))
                            ) : filteredEntries.length > 0 ? (
                                filteredEntries.map((entry) => (
                                    <GlassCard key={entry.id} className="group cursor-pointer flex flex-col h-full min-h-[280px]" hoverEffect={true} gradientBorder="emerald">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(entry.entry_date)}
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                                        </div>

                                        <h3 className="text-xl font-black text-foreground mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                            {entry.title}
                                        </h3>

                                        <p className="text-muted-foreground text-sm font-medium leading-relaxed line-clamp-4 mb-6 flex-1">
                                            {entry.content}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                            <span className="text-xs font-bold text-muted-foreground">
                                                {entry.word_count || 0} words
                                            </span>
                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                                Read Entry <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-secondary to-transparent rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground mb-2">No entries found</h3>
                                    <p className="text-muted-foreground">
                                        {searchQuery ? "Try adjusting your search terms." : "Start writing to populate your journal."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Focus Mode Overlay */}
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

// Simplified cn helper
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default JournalPage;
