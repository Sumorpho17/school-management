import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="landing-brand">
                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                        <rect width="40" height="40" rx="10" fill="url(#grad-nav)" />
                        <path d="M12 28V16L20 10L28 16V28H22V22H18V28H12Z" fill="white" />
                        <defs>
                            <linearGradient id="grad-nav" x1="0" y1="0" x2="40" y2="40">
                                <stop stopColor="#6366f1" />
                                <stop offset="1" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span>SchoolHub</span>
                </div>
                <Link to="/login" className="btn-nav-login">
                    Sign In
                </Link>
            </nav>

            <main className="landing-hero">
                <div className="hero-content">
                    <h1>
                        Modern School Management,{' '}
                        <span className="gradient-text">Simplified</span>
                    </h1>
                    <p className="hero-subtitle">
                        A powerful multi-tenant platform for managing students, teachers,
                        schedules, grades, and more — all in one place.
                    </p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn-hero-primary">
                            Get Started →
                        </Link>
                    </div>
                </div>

                <div className="hero-features">
                    {[
                        {
                            icon: '👨‍🎓',
                            title: 'Student Management',
                            desc: 'Track enrollment, attendance, and academic progress.',
                        },
                        {
                            icon: '📊',
                            title: 'Grade & Reports',
                            desc: 'Automated grading, report cards, and analytics.',
                        },
                        {
                            icon: '📅',
                            title: 'Timetable & Scheduling',
                            desc: 'Smart scheduling for classes, exams, and events.',
                        },
                        {
                            icon: '💰',
                            title: 'Fee Management',
                            desc: 'Track payments, generate receipts, and send reminders.',
                        },
                    ].map((f) => (
                        <div key={f.title} className="feature-card">
                            <span className="feature-icon">{f.icon}</span>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="landing-footer">
                <p>© 2026 SchoolHub. All rights reserved.</p>
            </footer>
        </div>
    );
}
