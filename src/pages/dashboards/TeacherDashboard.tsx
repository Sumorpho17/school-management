import { useAuth } from '../../store/authStore';

export default function TeacherDashboard() {
  const { profile } = useAuth();

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Welcome, {profile?.full_name || 'Teacher'}</h2>
      </div>
      <div className="page-content">
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
          Full teacher panel coming soon.
        </p>
      </div>
    </div>
  );
}
