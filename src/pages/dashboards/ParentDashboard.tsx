import { useAuth } from '../../store/authStore';

export default function ParentDashboard() {
  const { profile } = useAuth();

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Welcome, {profile?.full_name || 'Parent'}</h2>
      </div>
      <div className="page-content">
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
          Full parent portal coming soon.
        </p>
      </div>
    </div>
  );
}
