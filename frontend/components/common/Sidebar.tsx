'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    BookOpen,
    LifeBuoy,
    LogOut,
    Leaf,
    Smile,
    Wind,
    Sparkles,
    Trees,
    Lock,
    Activity
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const groups = [
        {
            title: 'Platform',
            items: [
                { label: 'Neural Hub', href: '/dashboard', icon: Home },
                { label: 'Cognitive Lab', href: '/cognitive-lab', icon: BookOpen },
                { label: 'Neural Metrics', href: '/analytics', icon: Activity },
                { label: 'Growth Feed', href: '/growth', icon: Leaf },
            ]
        },
        {
            title: 'Wellness',
            items: [
                { label: 'Sanctuary', href: '/sanctuary', icon: Wind },
                { label: 'Thought Journal', href: '/journal', icon: Smile },
                { label: 'Dream Log', href: '/dreams', icon: Sparkles },
                { label: 'Neural Forest', href: '/forest', icon: Trees },
            ]
        },
        {
            title: 'System',
            items: [
                { label: 'Neural Vault', href: '/vault', icon: Lock },
                { label: 'Emergency Support', href: '/crisis', icon: LifeBuoy },
            ]
        }
    ];

    if (!user) return null;

    return (
        <div className="h-full flex flex-col border-r border-emerald-500/10 bg-background/50 backdrop-blur-xl shrink-0 scroll-container overflow-y-auto">
            {/* Branding */}
            <div className="p-4 border-b border-emerald-500/10 mb-2 sticky top-0 bg-background/95 backdrop-blur z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                        <Image src="/logo.png" alt="NeuroLeaf Logo" fill className="object-cover" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">NeuroLeaf</span>
                </div>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 px-3 py-2 space-y-6">
                {groups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        <h3 className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-2">
                            {group.title}
                        </h3>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                            : "text-muted-foreground hover:bg-emerald-500/5 hover:text-foreground border border-transparent"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-emerald-500" : "opacity-50")} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Footer / User */}
            <div className="p-3 border-t border-emerald-500/10 mt-auto bg-background/95 backdrop-blur sticky bottom-0 z-10 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs border border-emerald-500/20">
                            {user?.full_name?.charAt(0) || 'G'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold leading-tight">{user?.full_name}</span>
                            <span className="text-[9px] text-muted-foreground">Guest Mode</span>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="p-2 hover:bg-emerald-500/10 rounded-lg text-muted-foreground hover:text-emerald-500 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
