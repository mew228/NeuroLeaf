'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InsightOrbProps {
    intensity?: 'low' | 'medium' | 'high';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const INTENSITY_CONFIG = {
    low: {
        glowOpacity: 0.3,
        pulseScale: 1.1,
        color: 'emerald',
    },
    medium: {
        glowOpacity: 0.5,
        pulseScale: 1.2,
        color: 'emerald',
    },
    high: {
        glowOpacity: 0.7,
        pulseScale: 1.3,
        color: 'teal',
    },
};

const SIZE_CONFIG = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
};

const InsightOrb: React.FC<InsightOrbProps> = ({
    intensity = 'medium',
    size = 'md',
    className = '',
}) => {
    const config = INTENSITY_CONFIG[intensity];
    const sizeClass = SIZE_CONFIG[size];

    return (
        <div className={`relative ${sizeClass} ${className}`}>
            {/* Outer glow */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background: `radial-gradient(circle, rgba(16, 185, 129, ${config.glowOpacity}) 0%, transparent 70%)`,
                }}
                animate={{
                    scale: [1, config.pulseScale, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Middle ring */}
            <motion.div
                className="absolute inset-1 rounded-full border border-emerald-500/30"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                }}
            />

            {/* Core orb */}
            <motion.div
                className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400/80 to-teal-500/60"
                style={{
                    boxShadow: `0 0 15px rgba(16, 185, 129, ${config.glowOpacity})`,
                    willChange: 'transform, opacity',
                }}
                animate={{
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Floating animation wrapper */}
            <motion.div
                className="absolute inset-0"
                style={{ willChange: 'transform' }}
                animate={{
                    y: [-2, 2, -2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {/* Sparkle particles for high intensity */}
                {intensity === 'high' && (
                    <>
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-emerald-300 rounded-full"
                                style={{
                                    top: `${20 + i * 25}%`,
                                    left: `${10 + i * 30}%`,
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    y: [-10, -20],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.7,
                                    ease: "easeOut",
                                }}
                            />
                        ))}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default InsightOrb;
