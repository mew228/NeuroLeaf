'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    delay?: number;
    gradientBorder?: 'emerald' | 'teal' | 'rose' | 'none';
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    hoverEffect = false,
    delay = 0,
    gradientBorder = 'none'
}) => {
    const borderColors = {
        emerald: 'border-l-4 border-l-emerald-500',
        teal: 'border-l-4 border-l-teal-500',
        rose: 'border-l-4 border-l-rose-500',
        none: ''
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            whileHover={hoverEffect ? { y: -6, transition: { duration: 0.3 } } : undefined}
            className={cn(
                "glass-card p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-300",
                borderColors[gradientBorder],
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
