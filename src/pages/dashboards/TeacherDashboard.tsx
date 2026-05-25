import { useAuth } from '../../store/authStore';

export default function TeacherDashboard() {
    const { profile, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <h1>📖 Teacher Dashboard</h1>
                    <span className="role-badge role-teacher">Teacher</span>
                </div>
                <div className="dashboard-user">
                    <span>Welcome, {profile?.full_name || 'Teacher'}</span>
                    <button onClick={logout} className="btn-logout">
                        Sign Out
                    </button>
                </div>
            </header>
            <main className="dashboard-main">
                <div className="dashboard-grid">
                    {[
                        { icon: '📅', label: 'My Classes', value: '—' },
                        { icon: '✅', label: 'Attendance Today', value: '—' },
                        { icon: '📝', label: 'Pending Grades', value: '—' },
                        { icon: '📊', label: 'Avg Performance', value: '—' },
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
                    Full teacher panel coming soon. This is a placeholder dashboard.
                </p>
            </main>
        </div>
    );
}
