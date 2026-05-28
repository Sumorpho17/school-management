import { useAuth } from '../../store/authStore';

export default function SuperAdminDashboard() {
  const { profile } = useAuth();

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Welcome, {profile?.full_name || 'Super Admin'}</h2>
      </div>
      <div className="page-content">
        <div className="dashboard-grid">
          {[
            { icon: '🏫', label: 'Schools', value: '—' },
            { icon: '👥', label: 'Total Users', value: '—' },
            { icon: '📈', label: 'Active Plans', value: '—' },
            { icon: '🔧', label: 'System Health', value: '—' },
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
          Full super admin panel coming soon.
        </p>
      </div>
    </div>
  );
}
