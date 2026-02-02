'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, Shield, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  const features = [
    { icon: Sparkles, title: "Neural Analysis", desc: "Non-clinical, supportive insights derived from deep pattern recognition of your journaling." },
    { icon: Shield, title: "Sovereign Data", desc: "Your emotional data is encrypted and completely under your control. Zero compromise." },
    { icon: Heart, title: "Mood Cartography", desc: "Visualize your emotional journey with interactive, high-fidelity daily check-ins." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[50%] bg-teal-500/10 rounded-full blur-[80px]" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground">NeuroLeaf</span>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl font-bold text-sm hover:bg-white/80 transition-all text-foreground"
        >
          Sign In
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 max-w-5xl mx-auto w-full py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Next Gen Mental Clarity</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tight leading-[0.9]">
            Your mind, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">fully understood.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            The ethical AI companion for daily emotional awareness. Track your mood, journal thoughts, and unlock neural insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/register"
              className="px-10 py-5 bg-foreground text-background rounded-[2rem] font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="grid md:grid-cols-3 gap-6 mt-32 w-full"
        >
          {features.map((f, i) => (
            <div key={i} className="glass-card p-8 rounded-[3rem] text-left hover:border-emerald-500/30 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/10">
                <f.icon className="text-emerald-600 dark:text-emerald-400 w-8 h-8" />
              </div>
              <h3 className="font-black text-2xl text-foreground mb-3 tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="py-12 text-center relative z-10">
        <p className="text-muted-foreground/60 text-sm font-bold uppercase tracking-widest">
          © 2026 NeuroLeaf AI. Ethical by Design.
        </p>
      </footer>
    </div>
  );
}
