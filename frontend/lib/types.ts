export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    created_at: string;
    is_active: boolean;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface MoodEntry {
    id: string;
    mood_score: number;
    mood_emoji: string;
    mood_label: string;
    notes: string;
    entry_date: string;
    created_at: string;
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    word_count: number;
    entry_date: string;
    created_at: string;
    updated_at: string;
    has_analysis: boolean;
}

export interface AIAnalysis {
    journal_id: string;
    sentiment: {
        score: number;
        label: string;
    };
    emotions: {
        primary: string;
        scores: Record<string, number>;
    };
    stress: {
        level: string;
        keywords: string[];
    };
    ai_reflection: string;
    crisis_detected: boolean;
    processed_at: string;
}

export interface CrisisResource {
    name: string;
    phone: string;
    description: string;
    region?: string;
}

export type DreamType = 'lucid' | 'nightmare' | 'recurring' | 'prophetic' | 'normal';

export interface DreamEntry {
    id: string;
    title: string;
    description: string;
    date: string;
    mood: string;
    clarity: number; // 1-10
    lucidityLevel: number; // 1-10
    type: DreamType;
    tags: string[];
    symbols: Array<{
        name: string;
        meaning: string;
    }>;
    interpretation?: string;
    imageUrl?: string;
    audioUrl?: string; // For voice notes
    created_at: string;
}
