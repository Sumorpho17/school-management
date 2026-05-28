import { useAuth } from '../../store/authStore';

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Welcome, {profile?.full_name || 'Administrator'}</h2>
      </div>
      <div className="page-content">
        <div className="dashboard-grid">
          {[
            { icon: '👨‍🎓', label: 'Students', value: '—' },
            { icon: '👩‍🏫', label: 'Teachers', value: '—' },
            { icon: '📚', label: 'Classes', value: '—' },
            { icon: '💰', label: 'Pending Fees', value: '—' },
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
          Full admin panel coming soon. Use the sidebar to manage students, teachers, classes, and subjects.
        </p>
      </div>
    </div>
  );
}
