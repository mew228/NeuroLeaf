'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import GlassCard from '../../components/common/GlassCard';
import { useToast } from '../../context/ToastContext';

const MOODS = [
    { score: 1, emoji: '😫', label: 'Overwhelmed' },
    { score: 2, emoji: '😢', label: 'Sad' },
    { score: 3, emoji: '😓', label: 'Anxious' },
    { score: 4, emoji: '😕', label: 'Confused' },
    { score: 5, emoji: '😐', label: 'Neutral' },
    { score: 6, emoji: '😌', label: 'Calm' },
    { score: 7, emoji: '🙂', label: 'Good' },
    { score: 8, emoji: '😄', label: 'Happy' },
    { score: 9, emoji: '😁', label: 'Energetic' },
    { score: 10, emoji: '🤩', label: 'Amazing' },
];

const MoodCheckIn = () => {
    const { showToast } = useToast();
    const [score, setScore] = useState(5);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const currentMood = MOODS.find(m => m.score === score) || MOODS[4];

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await api.post('/mood/entry', {
                mood_score: score,
                mood_label: currentMood.label,
                mood_emoji: currentMood.emoji,
                notes,
                entry_date: new Date().toISOString().split('T')[0]
            });
            setSubmitted(true);
            showToast('Mood logged successfully', 'success');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Failed to log mood', err);
            showToast('Failed to log mood', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-24 lg:pb-0">
            {/* Header */}
            <div className="text-center space-y-3">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-foreground tracking-tight"
                >
                    How are you, <span className="text-gradient">really?</span>
                </motion.h1>
                <p className="text-muted-foreground font-medium">Take a moment to check in with yourself.</p>
            </div>

            {!submitted ? (
                <GlassCard className="space-y-10 p-8" hoverEffect={false}>
                    {/* Emoji Display */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <motion.div
                            key={score}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center text-8xl shadow-inner border border-border"
                        >
                            {currentMood.emoji}
                        </motion.div>
                        <p className="text-2xl font-black text-foreground">{currentMood.label}</p>
                    </div>

                    {/* Slider */}
                    <div className="space-y-4 px-4">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                            className="w-full h-4 bg-secondary rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all"
                        />
                        <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <span>Unpleasant</span>
                            <span>Neutral</span>
                            <span>Pleasant</span>
                        </div>
                    </div>

                    {/* Notes Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What&apos;s influencing your mood today?"
                            className="w-full bg-secondary/50 border border-border rounded-2xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none font-medium placeholder:text-muted-foreground/50 transition-all"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Log Mood</span>
                                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </GlassCard>
            ) : (
                <GlassCard className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Logged Successfully!</h2>
                        <p className="text-muted-foreground font-medium mt-2">Returning to dashboard...</p>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};

export default MoodCheckIn;
