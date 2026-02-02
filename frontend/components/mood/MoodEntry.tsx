'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Send, Smile, Angry, Meh, Frown, Laugh, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';

const moods = [
    { score: 1, emoji: '😢', label: 'Sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50' },
    { score: 2, emoji: '😠', label: 'Angry', icon: Angry, color: 'text-red-500', bg: 'bg-red-50' },
    { score: 3, emoji: '😐', label: 'Neutral', icon: Meh, color: 'text-slate-500', bg: 'bg-slate-50' },
    { score: 4, emoji: '😊', label: 'Good', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { score: 5, emoji: '🥳', label: 'Amazing', icon: Laugh, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

const MoodEntry = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = async () => {
        if (!selectedMood) return;

        setIsSubmitting(true);
        const mood = moods.find(m => m.score === selectedMood);

        try {
            await api.post('/mood/entry', {
                mood_score: selectedMood,
                mood_emoji: mood?.emoji,
                mood_label: mood?.label.toLowerCase(),
                notes,
                entry_date: new Date().toISOString().split('T')[0]
            });
            setIsDone(true);
            setTimeout(() => {
                setIsDone(false);
                setSelectedMood(null);
                setNotes('');
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err) {
            console.error('Failed to save mood', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-emerald-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Check-in Complete</h3>
                <p className="text-emerald-600 mt-1">Your mood has been recorded. Take care!</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Smile className="text-indigo-600 w-6 h-6" />
                Daily Check-in
            </h2>

            <div className="grid grid-cols-5 gap-3 mb-8">
                {moods.map((m) => (
                    <button
                        key={m.score}
                        onClick={() => setSelectedMood(m.score)}
                        className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300",
                            selectedMood === m.score
                                ? cn(m.bg, "ring-2 ring-indigo-500 shadow-md transform scale-105")
                                : "hover:bg-slate-50"
                        )}
                    >
                        <span className="text-2xl mb-1">{m.emoji}</span>
                        <span className={cn("text-[10px] uppercase font-extrabold tracking-widest", selectedMood === m.score ? m.color : "text-slate-400")}>
                            {m.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Add a note (Optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How are you really feeling today?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                />

                <button
                    disabled={!selectedMood || isSubmitting}
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Record Mood
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MoodEntry;
