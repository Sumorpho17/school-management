import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleDashboardPath } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { sanitizeInput } from '../../core/security/sanitizer';
import { isValidEmail } from '../../core/security/validator';
import { checkRateLimit } from '../../core/security/rateLimiter';
import { logger } from '../../core/security/logger';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, resetPassword, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
        const sanitizedPassword = sanitizeInput(password);

        if (!sanitizedEmail || !sanitizedPassword) {
            setError('Please enter both email and password.');
            setSubmitting(false);
            return;
        }

        if (!isValidEmail(sanitizedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        const ipKey = `login:${sanitizedEmail}`;
        if (!checkRateLimit(ipKey, 5, 60_000)) {
            logger.warn('Login rate limit reached', { email: sanitizedEmail });
            setError('Too many login attempts. Please try again in a minute.');
            return;
        }

        setSubmitting(true);

        const { error: authError } = await login(sanitizedEmail, sanitizedPassword);

        if (authError) {
            switch (authError.message) {
                case 'Invalid login credentials':
                    setError('Invalid email or password. Please try again.');
                    break;
                case 'Email not confirmed':
                    setError('Please verify your email address before logging in.');
                    break;
                default:
                    setError('Authentication failed. Please try again.');
            }
            setSubmitting(false);
            return;
        }

        // Fetch the profile directly to determine role for redirect
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const dashboardPath = getRoleDashboardPath(profile?.role ?? null);
            navigate(dashboardPath, { replace: true });
        }

        setSubmitting(false);
    };

    const handleForgotPassword = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();

        if (!sanitizedEmail) {
            setError('Please enter your email address.');
            return;
        }

        if (!isValidEmail(sanitizedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        const rlKey = `reset:${sanitizedEmail}`;
        if (!checkRateLimit(rlKey, 3, 300_000)) {
            setError('Too many reset requests. Please try again in 5 minutes.');
            return;
        }

        setResetLoading(true);

        const { error: resetError } = await resetPassword(sanitizedEmail);
        setResetLoading(false);

        if (resetError) {
            setError('Unable to send reset link. Please try again later.');
            logger.warn('Password reset email failed', { code: resetError.code });
        } else {
            setMessage('Password reset link sent! Check your email inbox.');
            setShowForgotPassword(false);
        }
    };

    const isBusy = isLoading || submitting;

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="10" fill="url(#grad)" />
                            <path
                                d="M12 28V16L20 10L28 16V28H22V22H18V28H12Z"
                                fill="white"
                            />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1>Welcome Back</h1>
                    <p className="login-subtitle">
                        Sign in to your school management portal
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {message}
                    </div>
                )}

                {showForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="login-form">
                        <div className="form-group">
                            <label htmlFor="reset-email">Email Address</label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@school.edu"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={resetLoading}
                        >
                            {resetLoading ? <span className="spinner" /> : 'Send Reset Link'}
                        </button>
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => {
                                setShowForgotPassword(false);
                                setError(null);
                            }}
                        >
                            ← Back to Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@school.edu"
                                autoComplete="email"
                                maxLength={254}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                maxLength={128}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isBusy}
                        >
                            {isBusy ? <span className="spinner" /> : 'Sign In'}
                        </button>
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => {
                                setShowForgotPassword(true);
                                setError(null);
                                setMessage(null);
                            }}
                        >
                            Forgot your password?
                        </button>
                    </form>
                )}

                <div className="login-footer">
                    <p>
                        Powered by <strong>SchoolHub</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
