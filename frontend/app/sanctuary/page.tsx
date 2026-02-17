'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    RotateCcw,
    Wind,
    CloudRain,
    Moon,
    Trees,
    Volume2,
    Sparkles,
    Timer,
    PenTool,
    Waves,
    Music,
    Maximize2
} from 'lucide-react';
import BreathingGuide from '../../components/features/BreathingGuide';
import FocusMode from '../../components/features/FocusMode';
import { soundEngine as engine } from '../../lib/soundEngine';

type Tab = 'focus' | 'breath';

const SanctuaryPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('focus');
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [selectedSound, setSelectedSound] = useState('rain');
    const [volume, setVolume] = useState(0.5);
    const [audioActive, setAudioActive] = useState(false);

    // Focus Mode State
    const [focusTitle, setFocusTitle] = useState('');
    const [focusContent, setFocusContent] = useState('');

    // Timer Logic
    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setAudioActive(false);
            engine.stop();
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    // Audio Logic
    const toggleAudio = useCallback(() => {
        if (audioActive) {
            engine.stop();
            setAudioActive(false);
        } else {
            engine.play(selectedSound);
            setAudioActive(true);
        }
    }, [audioActive, selectedSound]);

    const handleSoundSelect = (id: string) => {
        setSelectedSound(id);
        if (audioActive) {
            engine.play(id);
        }
    };

    useEffect(() => {
        engine.setVolume(volume);
    }, [volume]);

    useEffect(() => {
        return () => engine.stop();
    }, []);

    const soundscapes = [
        { id: 'rain', name: 'Rainfall', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { id: 'wind', name: 'Ethereal Wind', icon: Wind, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
        { id: 'forest', name: 'Neural Forest', icon: Trees, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
        { id: 'night', name: 'Binaural Night', icon: Moon, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    ];

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
                        Wellness Hub
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Sanctuary</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-md">
                        Your digital space for mental clarity, focus, and decompression.
                    </p>
                </div>

                {/* Mode Switcher */}
                <div className="p-1.5 bg-secondary/50 backdrop-blur-md rounded-2xl flex items-center gap-1 border border-white/5">
                    {[
                        { id: 'focus', icon: Timer, label: 'Deep Focus' },
                        { id: 'breath', icon: Waves, label: 'Breathwork' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={cn(
                                "px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all relative overflow-hidden",
                                activeTab === tab.id
                                    ? "text-emerald-50 text-shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
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
                {activeTab === 'focus' ? (
                    <motion.div
                        key="focus"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Left Column: Timer */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="glass-card rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border-emerald-500/10">
                                {/* Ambient Background */}
                                <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/20 blur-[100px] rounded-full" />
                                </div>

                                {/* Circular Progress */}
                                <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            className="stroke-emerald-950/30 fill-none"
                                            strokeWidth="3"
                                        />
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            className="stroke-emerald-500 fill-none transition-all duration-1000 ease-linear"
                                            strokeWidth="3"
                                            strokeDasharray="283%" // Approx circumference
                                            strokeDashoffset={`${283 - (timeLeft / (25 * 60)) * 283}%`}
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums mb-4 text-emerald-50">
                                            {formatTime(timeLeft)}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={toggleTimer}
                                                className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 active:scale-95 hover:scale-105"
                                            >
                                                {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
                                            </button>
                                            <button
                                                onClick={resetTimer}
                                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 text-muted-foreground hover:text-emerald-400"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Controls & Extras */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Deep Work Launcher */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsFocusModeOpen(true)}
                                className="w-full p-6 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-500/20 text-left hover:border-emerald-500/40 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                                        <PenTool className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-emerald-100">Enter The Void</h3>
                                            <Maximize2 className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400" />
                                        </div>
                                        <p className="text-sm text-emerald-100/60 mt-1">Distraction-free writing environment with ambient particles.</p>
                                    </div>
                                </div>
                            </motion.button>

                            {/* Soundscapes */}
                            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <Volume2 className="w-5 h-5 text-emerald-500" />
                                        Soundscape Mixer
                                    </h3>
                                    <button
                                        onClick={toggleAudio}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                            audioActive
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                                : "bg-white/5 border border-white/10 text-muted-foreground"
                                        )}
                                    >
                                        {audioActive ? 'On Air' : 'Muted'}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {soundscapes.map((sound) => {
                                        const Icon = sound.icon;
                                        const isSelected = selectedSound === sound.id;

                                        return (
                                            <button
                                                key={sound.id}
                                                onClick={() => handleSoundSelect(sound.id)}
                                                className={cn(
                                                    "w-full p-4 rounded-2xl border transition-all flex items-center gap-4 relative overflow-hidden group",
                                                    isSelected
                                                        ? `${sound.bg} shadow-lg`
                                                        : "border-white/5 bg-white/5 hover:bg-white/[0.07]"
                                                )}
                                            >
                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isSelected ? "bg-white/10" : "bg-white/5")}>
                                                    <Icon className={cn("w-5 h-5", isSelected ? sound.color : "text-muted-foreground")} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className={cn("font-bold text-sm", isSelected ? "text-white" : "text-muted-foreground")}>{sound.name}</div>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute right-4 flex gap-0.5 items-end h-3">
                                                        {[...Array(3)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={cn("w-1 rounded-full animate-music", sound.color.replace('text', 'bg'))}
                                                                style={{
                                                                    height: '100%',
                                                                    animationDelay: `${i * 0.15}s`
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                        <Volume2 className="w-3 h-3" />
                                        <span>Master Volume</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="breath"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-xl mx-auto py-12"
                    >
                        <BreathingGuide />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <FocusMode
                isOpen={isFocusModeOpen}
                onClose={() => setIsFocusModeOpen(false)}
                title={focusTitle}
                content={focusContent}
                onTitleChange={setFocusTitle}
                onContentChange={setFocusContent}
                onSubmit={() => {
                    // Handle submission logic
                    setIsFocusModeOpen(false);
                }}
            />
        </div>
    );
};

// Simplified cn helper
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default SanctuaryPage;
