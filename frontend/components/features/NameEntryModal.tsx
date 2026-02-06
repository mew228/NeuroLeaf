
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface NameEntryModalProps {
    onComplete: (name: string) => void;
}

const NameEntryModal: React.FC<NameEntryModalProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setName(value);
            setError('');
        } else {
            setError('Only letters are allowed in your neural signature.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length > 0) {
            onComplete(name.trim());
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md"
                    >
                        <div className="glass-card p-8 rounded-[2rem] border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-3xl font-black tracking-tight mb-2">Welcome</h2>
                                <p className="text-muted-foreground mb-8">
                                    How shall we address you in this space?
                                </p>

                                <form onSubmit={handleSubmit} className="w-full space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center text-lg font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-sans"
                                            autoFocus
                                        />
                                        {error && (
                                            <p className="absolute -bottom-6 left-0 right-0 text-xs text-red-400 font-medium">
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!name.trim()}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 mt-4"
                                    >
                                        Enter Sanctuary
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NameEntryModal;
