'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Brain, Zap, Fingerprint, Activity } from 'lucide-react';

const NeuralTree = () => {
    // Neural Network Nodes Data
    const nodes = [
        { id: 'core', x: 50, y: 50, label: 'Core Processor', unlocked: true, icon: Brain, color: '#10b981' }, // Center
        { id: 'focus', x: 20, y: 30, label: 'Deep Focus', unlocked: true, icon: Zap, color: '#3b82f6' }, // Top Left
        { id: 'resilience', x: 80, y: 30, label: 'Resilience', unlocked: true, icon: Activity, color: '#ef4444' }, // Top Right
        { id: 'clarity', x: 20, y: 70, label: 'Clarity', unlocked: false, icon: Sparkles, color: '#a855f7' }, // Bottom Left
        { id: 'flow', x: 80, y: 70, label: 'Flow State', unlocked: false, icon: Fingerprint, color: '#f59e0b' }, // Bottom Right
    ];

    // Connections between nodes
    const connections = [
        { from: 'core', to: 'focus', active: true },
        { from: 'core', to: 'resilience', active: true },
        { from: 'core', to: 'clarity', active: false },
        { from: 'core', to: 'flow', active: false },
        { from: 'focus', to: 'clarity', active: false },
        { from: 'resilience', to: 'flow', active: false },
    ];

    return (
        <div className="relative w-full h-[500px] md:h-full bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 overflow-hidden flex items-center justify-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />

            {/* Neural Tree SVG Layer */}
            <div className="absolute inset-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    {connections.map((conn, index) => {
                        const startNode = nodes.find(n => n.id === conn.from);
                        const endNode = nodes.find(n => n.id === conn.to);
                        if (!startNode || !endNode) return null;

                        return (
                            <g key={index}>
                                {/* Connection Line */}
                                <motion.line
                                    x1={startNode.x}
                                    y1={startNode.y}
                                    x2={endNode.x}
                                    y2={endNode.y}
                                    stroke={conn.active ? '#10b981' : '#1f2937'}
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: conn.active ? 1 : 0.3 }}
                                    transition={{ duration: 1.5, delay: index * 0.2 }}
                                />

                                {/* Data Packet Animation */}
                                {conn.active && (
                                    <circle r="0.8" fill="#34d399">
                                        <animateMotion
                                            dur={`${2 + Math.random()}s`}
                                            repeatCount="indefinite"
                                            path={`M${startNode.x},${startNode.y} L${endNode.x},${endNode.y}`}
                                        />
                                    </circle>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Interactive Nodes Layer (HTML Overlay for accessibility/interaction) */}
                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + (Math.random() * 0.5) }}
                        whileHover={{ scale: 1.1 }}
                    >
                        {/* Node Container */}
                        <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${node.unlocked
                                ? 'bg-black shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                : 'bg-gray-900/50 border-gray-800'
                            }`}
                            style={{ borderColor: node.unlocked ? node.color : '#374151' }}
                        >
                            <node.icon
                                className={`w-5 h-5 md:w-8 md:h-8 transition-colors duration-300 ${node.unlocked ? 'text-white' : 'text-gray-600'
                                    }`}
                                style={{ color: node.unlocked ? node.color : undefined }}
                            />
                        </div>

                        {/* Label Tooltip */}
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="px-2 py-1 rounded bg-black/80 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                {node.label}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 z-20">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Neural Level 12</span>
                </div>
                <div className="w-24 h-1 bg-emerald-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
            </div>
        </div>
    );
};

export default NeuralTree;
