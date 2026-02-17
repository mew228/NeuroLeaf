'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Sparkles, Tag, Calendar, Moon } from 'lucide-react';
import { DreamType } from '../../lib/types';
import GlassCard from '../common/GlassCard';

interface DreamEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const DreamEntryModal: React.FC<DreamEntryModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<DreamType>('normal');
    const [lucidity, setLucidity] = useState(1);
    const [tags, setTags] = useState('');

    const handleSubmit = () => {
        onSubmit({
            title,
            description,
            type,
            lucidityLevel: lucidity,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            date: new Date().toISOString(),
            clarity: 5, // Default for now
            mood: 'Neutral' // Default
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 px-4"
                    >
                        <GlassCard className="max-h-[85vh] overflow-y-auto custom-scrollbar p-0 overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur-xl z-20">
                                <div>
                                    <h2 className="text-2xl font-black text-foreground">Record Dream</h2>
                                    <p className="text-sm text-muted-foreground">Capture the fragments before they fade.</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="E.g., Flying Over Neon City"
                                        className="w-full bg-secondary/50 border border-white/5 rounded-xl p-4 text-lg font-bold focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-muted-foreground/30"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value as DreamType)}
                                            className="w-full bg-secondary/50 border border-white/5 rounded-xl p-3 font-medium focus:outline-none"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="lucid">Lucid Dream</option>
                                            <option value="nightmare">Nightmare</option>
                                            <option value="recurring">Recurring</option>
                                            <option value="prophetic">Prophetic</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                            <span>Lucidity</span>
                                            <span className="text-indigo-400">{lucidity}/10</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={lucidity}
                                            onChange={(e) => setLucidity(parseInt(e.target.value))}
                                            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={8}
                                        placeholder="Describe the setting, characters, and emotions..."
                                        className="w-full bg-secondary/50 border border-white/5 rounded-xl p-4 font-medium focus:outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder:text-muted-foreground/30 leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tags (Comma separated)</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="flying, ocean, childhood..."
                                            className="w-full bg-secondary/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-muted-foreground/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-secondary/20 flex justify-end gap-3 sticky bottom-0 backdrop-blur-xl">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!title || !description}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold show-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Entry
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DreamEntryModal;
