'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize, Type, Mic, StopCircle } from 'lucide-react';

interface FocusModeProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    onTitleChange: (value: string) => void;
    onContentChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    isRecording?: boolean;
    onStartRecording?: () => void;
    onStopRecording?: () => void;
    transcribing?: boolean;
}

const FocusMode: React.FC<FocusModeProps> = ({
    isOpen,
    onClose,
    title,
    content,
    onTitleChange,
    onContentChange,
    onSubmit,
    isSubmitting = false,
    isRecording = false,
    onStartRecording,
    onStopRecording,
    transcribing = false,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Keyboard shortcut to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            onSubmit();
        }
    }, [onClose, onSubmit]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            // Focus textarea when opening
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const wordCount = content.match(/\S+/g)?.length || 0;
    const charCount = content.length;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/95 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Ambient particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-emerald-500/20 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [-20, 20, -20],
                                    x: [-10, 10, -10],
                                    opacity: [0.2, 0.5, 0.2],
                                }}
                                transition={{
                                    duration: 5 + Math.random() * 5,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="relative w-full max-w-4xl mx-4 md:mx-8"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <Maximize className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="font-black text-lg text-foreground">The Neural Void</h2>
                                    <p className="text-xs text-muted-foreground">Deep focus writing mode</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Editor */}
                        <div className="glass-card rounded-[2rem] overflow-hidden">
                            <input
                                type="text"
                                placeholder="Title your thoughts..."
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                                className="w-full bg-transparent px-8 pt-8 pb-4 text-3xl md:text-4xl font-black tracking-tight border-none focus:outline-none placeholder:text-muted-foreground/30 text-foreground"
                            />

                            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mx-8" />

                            <textarea
                                ref={textareaRef}
                                placeholder="Let your mind wander into the void..."
                                value={content}
                                onChange={(e) => onContentChange(e.target.value)}
                                className="w-full bg-transparent px-8 py-6 text-lg md:text-xl font-medium leading-relaxed border-none focus:outline-none resize-none placeholder:text-muted-foreground/30 text-foreground/80 min-h-[300px] md:min-h-[400px]"
                            />

                            {/* Footer */}
                            <div className="px-8 py-4 bg-emerald-950/20 flex items-center justify-between border-t border-white/5">
                                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <Type className="w-3 h-3" />
                                        {charCount} chars
                                    </span>
                                    <span>{wordCount} words</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={isRecording ? onStopRecording : onStartRecording}
                                        className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 text-muted-foreground hover:text-emerald-400'}`}
                                    >
                                        {transcribing ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : isRecording ? (
                                            <StopCircle className="w-4 h-4" />
                                        ) : (
                                            <Mic className="w-4 h-4" />
                                        )}
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onSubmit}
                                        disabled={isSubmitting || !content.trim()}
                                        className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isSubmitting ? 'Syncing...' : 'Neural Sync'}
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Keyboard hints */}
                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground/50">
                            <span>ESC to exit</span>
                            <span>•</span>
                            <span>Ctrl+Enter to submit</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FocusMode;
