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
    Sparkles
} from 'lucide-react';
import { soundEngine } from '../../lib/soundEngine';

const SanctuaryPage = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [audioActive, setAudioActive] = useState(false);
    const [selectedSound, setSelectedSound] = useState('rain');
    const [volume, setVolume] = useState(0.5);

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
            soundEngine.stop();
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

    const toggleAudio = useCallback(() => {
        if (audioActive) {
            soundEngine.stop();
            setAudioActive(false);
        } else {
            soundEngine.play(selectedSound);
            setAudioActive(true);
        }
    }, [audioActive, selectedSound]);

    const handleSoundSelect = (id: string) => {
        setSelectedSound(id);
        if (audioActive) {
            soundEngine.play(id);
        }
    };

    useEffect(() => {
        soundEngine.setVolume(volume);
    }, [volume]);

    // Cleanup on unmount
    useEffect(() => {
        return () => soundEngine.stop();
    }, []);

    const soundscapes = [
        { id: 'rain', name: 'Rainfall', icon: CloudRain, color: 'from-blue-500/20 to-indigo-500/20' },
        { id: 'wind', name: 'Ethereal Wind', icon: Wind, color: 'from-teal-500/20 to-emerald-500/20' },
        { id: 'forest', name: 'Neural Forest', icon: Trees, color: 'from-emerald-500/20 to-green-500/20' },
        { id: 'night', name: 'Binaural Night', icon: Moon, color: 'from-purple-500/20 to-slate-500/20' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header section */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-widest border border-emerald-500/20"
                >
                    <Sparkles className="w-3 h-3" />
                    Deep Focus Sanctuary
                </motion.div>
                <h1 className="text-5xl font-black tracking-tighter">Quiet your mind.</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Combine intervals of deep work with immersive binaural soundscapes designed for neuro-optimization.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Timer Section */}
                <div className="relative">
                    {/* Breathing Visualizer */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: [0.1, 0.3, 0.1],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[100px] -z-10"
                            />
                        )}
                    </AnimatePresence>

                    <div className="glass rounded-[4rem] aspect-square flex flex-col items-center justify-center border border-emerald-500/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/10">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(timeLeft / (25 * 60)) * 100}%` }}
                            />
                        </div>

                        <span className="text-8xl font-black tracking-tighter tabular-nums mb-8">
                            {formatTime(timeLeft)}
                        </span>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTimer}
                                className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                            >
                                {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 text-muted-foreground hover:text-foreground"
                            >
                                <RotateCcw className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Audio Controls Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Volume2 className="w-5 h-5 text-emerald-500" />
                                Ambient Mix
                            </h3>
                            <button
                                onClick={toggleAudio}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    audioActive
                                        ? "bg-emerald-500 text-white"
                                        : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {audioActive ? 'Active' : 'Muted'}
                            </button>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {soundscapes.map((sound) => {
                            const Icon = sound.icon;
                            const isSelected = selectedSound === sound.id;

                            return (
                                <button
                                    key={sound.id}
                                    onClick={() => handleSoundSelect(sound.id)}
                                    className={cn(
                                        "p-6 rounded-3xl border transition-all text-left space-y-3 relative overflow-hidden group active:scale-95",
                                        isSelected
                                            ? "border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/5"
                                            : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07]"
                                    )}
                                >
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isSelected ? "bg-emerald-500 text-white" : "bg-white/5 text-muted-foreground")}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{sound.name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                                            {sound.id === 'night' ? 'Binaural' : 'Pure Noise'}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simplified cn helper
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default SanctuaryPage;
