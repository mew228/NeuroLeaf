'use client';

import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

const VaultPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20">
                <Lock className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Neural Vault</h1>
                <p className="text-muted-foreground">Secure, encrypted storage for your most sensitive reflections.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                Coming Soon
            </div>
        </div>
    );
};

export default VaultPage;
