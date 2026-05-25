import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import type { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

type Profile = Tables<'profiles'>;
type UserRole = Profile['role'];

interface AuthState {
    user: User | null;
    profile: Profile | null;
    role: UserRole | null;
    schoolId: string | null;
    isLoading: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    logout: () => Promise<void>;
    getProfile: () => Promise<Profile | null>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        role: null,
        schoolId: null,
        isLoading: true,
    });

    const getProfile = useCallback(async (): Promise<Profile | null> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error.message);
            return null;
        }

        return data;
    }, []);

    const fetchAndSetProfile = useCallback(
        async (user: User) => {
            const profile = await getProfile();
            setState({
                user,
                profile,
                role: profile?.role ?? null,
                schoolId: profile?.school_id ?? null,
                isLoading: false,
            });
        },
        [getProfile]
    );

    // Listen for auth state changes (handles session restore on app load)
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchAndSetProfile(session.user);
            } else {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        });

        // Listen for ongoing changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                await fetchAndSetProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
                setState({
                    user: null,
                    profile: null,
                    role: null,
                    schoolId: null,
                    isLoading: false,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchAndSetProfile]);

    const login = async (
        email: string,
        password: string
    ): Promise<{ error: AuthError | null }> => {
        setState((prev) => ({ ...prev, isLoading: true }));

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setState((prev) => ({ ...prev, isLoading: false }));
            return { error };
        }

        // Profile will be fetched by onAuthStateChange listener
        return { error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const resetPassword = async (
        email: string
    ): Promise<{ error: AuthError | null }> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error };
    };

    return (
        <AuthContext.Provider
            value={{ ...state, login, logout, getProfile, resetPassword }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function getRoleDashboardPath(role: UserRole | null): string {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'teacher':
            return '/teacher/dashboard';
        case 'parent':
            return '/parent/dashboard';
        case 'super_admin':
            return '/superadmin/dashboard';
        default:
            return '/login';
    }
}
