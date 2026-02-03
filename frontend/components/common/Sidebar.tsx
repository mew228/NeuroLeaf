'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    BookOpen,
    BarChart2,
    LifeBuoy,
    LogOut,
    Leaf,
    Smile
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Journal', href: '/journal', icon: BookOpen },
        { label: 'Check In', href: '/mood', icon: Smile },
        { label: 'Mood Trend', href: '/analytics', icon: BarChart2 },
        { label: 'Crisis Help', href: '/crisis', icon: LifeBuoy },
    ];

    if (!user) return null;

    return (
        <div className="h-screen py-6 pl-6 pr-2 transition-all duration-500">
            <div className="glass h-full w-full rounded-[2.5rem] flex flex-col shadow-2xl shadow-emerald-900/5 overflow-hidden relative">
                {/* Branding */}
                <div className="px-8 py-10">
                    <div className="flex items-center gap-4 group cursor-default">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                            <Leaf className="text-white w-7 h-7" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-foreground group-hover:translate-x-1 transition-transform duration-500">NeuroLeaf</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative",
                                    isActive
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                        : "text-muted-foreground hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "opacity-70 group-hover:opacity-100")} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebarActive"
                                        className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-6 mt-auto">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl p-5 border border-emerald-500/5 flex flex-col gap-4">
                        <div className="flex items-center gap-4 px-1">
                            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-sm shadow-inner overflow-hidden border border-emerald-500/10">
                                {user?.full_name?.[0]}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black truncate text-foreground leading-tight">{user.full_name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Global Guest</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
