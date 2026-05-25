import { useAuth } from '../../store/authStore';

export default function ParentDashboard() {
    const { profile, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <h1>👪 Parent Dashboard</h1>
                    <span className="role-badge role-parent">Parent</span>
                </div>
                <div className="dashboard-user">
                    <span>Welcome, {profile?.full_name || 'Parent'}</span>
                    <button onClick={logout} className="btn-logout">
                        Sign Out
                    </button>
                </div>
            </header>
            <main className="dashboard-main">
                <div className="dashboard-grid">
                    {[
                        { icon: '👦', label: 'My Children', value: '—' },
                        { icon: '📊', label: 'Report Cards', value: '—' },
                        { icon: '💰', label: 'Fee Status', value: '—' },
                        { icon: '📅', label: 'Upcoming Events', value: '—' },
                    ].map((item) => (
                        <div key={item.label} className="stat-card">
                            <span className="stat-icon">{item.icon}</span>
                            <div>
                                <p className="stat-value">{item.value}</p>
                                <p className="stat-label">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="placeholder-text">
                    Full parent portal coming soon. This is a placeholder dashboard.
                </p>
            </main>
        </div>
    );
}
