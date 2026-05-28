import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/authStore';

const roleLinks = {
  admin: [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/students', icon: '👨‍🎓', label: 'Students' },
    { to: '/admin/teachers', icon: '👩‍🏫', label: 'Teachers' },
    { to: '/admin/classes', icon: '📚', label: 'Classes' },
    { to: '/admin/subjects', icon: '📖', label: 'Subjects' },
  ],
  teacher: [
    { to: '/teacher/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/teacher/classes', icon: '📚', label: 'My Classes' },
    { to: '/teacher/students', icon: '👨‍🎓', label: 'Students' },
  ],
  parent: [
    { to: '/parent/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/parent/children', icon: '👦', label: 'My Children' },
  ],
  super_admin: [
    { to: '/superadmin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/superadmin/schools', icon: '🏫', label: 'Schools' },
    { to: '/superadmin/users', icon: '👥', label: 'Users' },
  ],
};

export default function Sidebar() {
  const { role, profile, logout } = useAuth();
  const links = role ? roleLinks[role] ?? [] : [];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="url(#grad-sb)" />
          <path d="M12 28V16L20 10L28 16V28H22V22H18V28H12Z" fill="white" />
          <defs>
            <linearGradient id="grad-sb" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <span>SchoolHub</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to.endsWith('/dashboard')}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-name">{profile?.full_name || 'User'}</span>
          <span className="sidebar-user-role">{role}</span>
        </div>
        <button onClick={logout} className="sidebar-logout">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
