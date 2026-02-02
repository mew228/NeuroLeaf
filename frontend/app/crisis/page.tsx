'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { CrisisResource } from '../../lib/types';

const CrisisPage = () => {
    const [resources, setResources] = useState<CrisisResource[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get('/crisis/resources').catch(() => ({ data: { resources: [] } }));
                setResources(res.data?.resources || []);
            } catch (err) {
                console.error('Failed to fetch resources', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-24 lg:pb-0">
            {/* Header */}
            <div className="px-2">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-rose-200 dark:border-rose-500/20">
                        <AlertCircle className="w-3 h-3" />
                        Immediate Support
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-foreground">
                        Safe <span className="text-rose-500">Space.</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mt-4 font-medium max-w-xl">
                        If you&apos;re overwhelmed, you&apos;re in a safe place. Connect with compassionate professionals who want to help.
                    </p>
                </motion.div>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-6 px-2">
                {resources.length > 0 ? (
                    resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-8 rounded-3xl premium-shadow relative overflow-hidden group border-l-4 border-l-rose-500"
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center dark:bg-rose-500/10 dark:text-rose-400">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-foreground tracking-tight">{resource.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available 24/7</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground font-medium flex-1 leading-relaxed mb-8">
                                    {resource.description}
                                </p>

                                <a
                                    href={`tel:${resource.phone}`}
                                    className="flex items-center justify-center w-full py-4 bg-foreground text-background hover:bg-rose-500 hover:text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-md group/btn"
                                >
                                    Call Now
                                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-lg text-xs font-bold">
                                        {resource.phone}
                                    </span>
                                </a>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    [1, 2].map((i) => (
                        <div key={i} className="glass-card p-8 rounded-3xl h-[250px] animate-pulse flex flex-col justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-secondary rounded-xl" />
                                <div className="space-y-2">
                                    <div className="w-32 h-5 bg-secondary rounded-lg" />
                                    <div className="w-20 h-3 bg-secondary rounded-lg" />
                                </div>
                            </div>
                            <div className="w-full h-12 bg-secondary rounded-xl" />
                        </div>
                    ))
                )}
            </div>

            {/* Reassurance Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-2 p-8 bg-secondary/30 border border-border rounded-3xl text-center relative overflow-hidden"
            >
                <h3 className="text-xl font-black text-foreground mb-3 tracking-tighter">You are valued.</h3>
                <p className="text-muted-foreground font-medium text-base max-w-2xl mx-auto italic">
                    &quot;Courage doesn&apos;t always roar. Sometimes courage is the quiet voice at the end of the day saying, &apos;I will try again tomorrow.&apos;&quot;
                </p>
            </motion.div>
        </div>
    );
};

export default CrisisPage;
