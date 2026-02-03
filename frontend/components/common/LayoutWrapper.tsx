'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, BarChart2, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import AuraBackground from '../features/AuraBackground';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false, speed: 400 });

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        NProgress.done();
        return () => {
            NProgress.start();
        };
    }, [pathname]);

    const isAuthPage = false; // Always show layout components

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <AuraBackground mood="calm">
            <div className="flex min-h-screen relative selection:bg-emerald-500 selection:text-white">

                {!isAuthPage && mounted && user && (
                    <div className="hidden lg:block w-72 h-screen sticky top-0 z-10">
                        <Sidebar />
                    </div>
                )}

                <main className="flex-1 flex flex-col min-w-0 relative z-10">
                    <div className="flex-1 px-4 py-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full pb-28 lg:pb-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile Bottom Navigation - Enhanced */}
                    {!isAuthPage && mounted && user && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
                        >
                            <div className="mx-4 mb-4">
                                <nav className="glass py-2 px-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-emerald-900/20 border border-emerald-500/10 relative">
                                    {/* Left Side */}
                                    <div className="flex items-center gap-6">
                                        <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
                                            <div className={`p-2.5 rounded-2xl transition-all ${pathname === '/dashboard' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                                <Home className="w-6 h-6" />
                                            </div>
                                        </Link>
                                        <Link href="/analytics" className="flex flex-col items-center gap-1 group">
                                            <div className={`p-2.5 rounded-2xl transition-all ${pathname === '/analytics' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                                <BarChart2 className="w-6 h-6" />
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Center FAB */}
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                                        <Link href="/mood">
                                            <motion.div
                                                whileTap={{ scale: 0.9 }}
                                                className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 border-4 border-background"
                                            >
                                                <div className="w-6 h-6 text-white font-bold text-2xl flex items-center justify-center pb-1">+</div>
                                            </motion.div>
                                        </Link>
                                    </div>

                                    {/* Right Side */}
                                    <div className="flex items-center gap-6">
                                        <Link href="/journal" className="flex flex-col items-center gap-1 group">
                                            <div className={`p-2.5 rounded-2xl transition-all ${pathname === '/journal' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                        </Link>
                                        <Link href="/crisis" className="flex flex-col items-center gap-1 group">
                                            <div className={`p-2.5 rounded-2xl transition-all ${pathname === '/crisis' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                                <LifeBuoy className="w-6 h-6" />
                                            </div>
                                        </Link>
                                    </div>
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </AuraBackground>
    );
};

export default LayoutWrapper;
