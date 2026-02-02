'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type MoodAura = 'calm' | 'happy' | 'stressed' | 'neutral';

interface AuraBackgroundProps {
    mood?: MoodAura;
    children: React.ReactNode;
}

const AURA_CONFIGS: Record<MoodAura, { gradients: string[]; colors: string[] }> = {
    calm: {
        gradients: [
            'radial-gradient(circle at 10% 10%, hsla(158, 95%, 55%, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 90% 90%, hsla(180, 95%, 55%, 0.06) 0%, transparent 50%)',
        ],
        colors: ['emerald', 'teal'],
    },
    happy: {
        gradients: [
            'radial-gradient(circle at 10% 10%, hsla(45, 95%, 55%, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 90% 90%, hsla(158, 95%, 55%, 0.06) 0%, transparent 50%)',
        ],
        colors: ['amber', 'emerald'],
    },
    stressed: {
        gradients: [
            'radial-gradient(circle at 10% 10%, hsla(260, 70%, 50%, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 90% 90%, hsla(280, 70%, 45%, 0.06) 0%, transparent 50%)',
        ],
        colors: ['violet', 'indigo'],
    },
    neutral: {
        gradients: [
            'radial-gradient(circle at 10% 10%, hsla(210, 40%, 50%, 0.06) 0%, transparent 50%)',
            'radial-gradient(circle at 90% 90%, hsla(200, 40%, 45%, 0.04) 0%, transparent 50%)',
        ],
        colors: ['slate', 'blue'],
    },
};

const AuraBackground: React.FC<AuraBackgroundProps> = React.memo(({ mood = 'calm', children }) => {
    const config = useMemo(() => AURA_CONFIGS[mood], [mood]);

    return (
        <div className="relative">
            {/* Base background */}
            <div className="fixed inset-0 z-0 bg-background" />

            {/* Dynamic aura layers - Combined for performance */}
            <motion.div
                key={mood}
                className="fixed inset-0 z-0 pointer-events-none opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{
                    backgroundImage: config.gradients.join(', '),
                    willChange: 'opacity',
                    transform: 'translateZ(0)',
                }}
            />

            {/* Simplified floating orb effect */}
            <motion.div
                className="fixed -top-20 -left-20 w-64 h-64 md:w-[30rem] md:h-[30rem] lg:w-[40rem] lg:h-[40rem] rounded-full pointer-events-none z-0 opacity-[0.03]"
                style={{
                    background: `radial-gradient(circle, hsla(158, 95%, 55%, 1) 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Grid overlay */}
            <div className="fixed inset-0 z-0 bg-grid opacity-[0.01] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
});

AuraBackground.displayName = 'AuraBackground';

export default AuraBackground;
