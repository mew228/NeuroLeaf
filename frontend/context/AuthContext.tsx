'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '../lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('neuroleaf_user');
            if (stored) return JSON.parse(stored);
        }
        // Default to a guest user if none exists
        return {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'guest@neuroleaf.com',
            full_name: 'Guest User',
            created_at: new Date().toISOString(),
            is_active: true
        };
    });
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('neuroleaf_token') || 'guest-token';
        }
        return 'guest-token';
    });
    const [isLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Validation could go here if needed
    }, []);

    const login = (authData: AuthResponse) => {
        setUser(authData.user);
        setToken(authData.access_token);
        localStorage.setItem('neuroleaf_user', JSON.stringify(authData.user));
        localStorage.setItem('neuroleaf_token', authData.access_token);
        router.push('/dashboard');
    };

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('neuroleaf_user');
        localStorage.removeItem('neuroleaf_token');
        // Stay on current page or go back to dashboard
        router.push('/dashboard');
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
