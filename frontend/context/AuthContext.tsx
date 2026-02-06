'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '../lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    sessionID: string | null;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    updateName: (name: string) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('nl_user');
            if (stored) return JSON.parse(stored);

            const storedName = localStorage.getItem('nl_gn');
            if (storedName) {
                return {
                    id: 'g-' + Math.random().toString(36).substr(2, 9),
                    email: 'user@neuroleaf.app',
                    full_name: storedName,
                    created_at: new Date().toISOString(),
                    is_active: true
                };
            }
        }
        return null;
    });

    const [sessionID, setSessionID] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('nl_sid') || 'active_session';
        }
        return 'active_session';
    });

    const [isLoading] = useState(false);
    const router = useRouter();

    const login = (authData: AuthResponse) => {
        setUser(authData.user);
        setSessionID(authData.access_token);
        localStorage.setItem('nl_user', JSON.stringify(authData.user));
        localStorage.setItem('nl_sid', authData.access_token);
        router.push('/dashboard');
    };

    const logout = useCallback(() => {
        setUser(null);
        setSessionID(null);
        localStorage.removeItem('nl_user');
        localStorage.removeItem('nl_sid');
        localStorage.removeItem('nl_gn');
        router.push('/');
    }, [router]);

    const updateName = (name: string) => {
        const guestUser: User = {
            id: user?.id || 'g-' + Math.random().toString(36).substr(2, 9),
            email: user?.email || 'user@neuroleaf.app',
            full_name: name,
            created_at: user?.created_at || new Date().toISOString(),
            is_active: true
        };
        setUser(guestUser);
        localStorage.setItem('nl_gn', name);
        localStorage.setItem('nl_user', JSON.stringify(guestUser));
    };

    return (
        <AuthContext.Provider value={{ user, sessionID, login, logout, updateName, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
