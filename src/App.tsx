import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RequireAuth from './components/auth/RequireAuth';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import SchoolSetup from './pages/onboarding/SchoolSetup';
import StudentList from './pages/students/StudentList';
import TeacherList from './pages/teachers/TeacherList';
import ClassList from './pages/classes/ClassList';
import SubjectList from './pages/subjects/SubjectList';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/onboarding',
    element: <RequireAuth allowedRoles={['admin']} />,
    children: [
      { path: 'school-setup', element: <SchoolSetup /> },
    ],
  },
  {
    path: '/admin',
    element: <RequireAuth allowedRoles={['admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'students', element: <StudentList /> },
          { path: 'teachers', element: <TeacherList /> },
          { path: 'classes', element: <ClassList /> },
          { path: 'subjects', element: <SubjectList /> },
          { path: '*', element: <AdminDashboard /> },
        ],
      },
    ],
  },
  {
    path: '/teacher',
    element: <RequireAuth allowedRoles={['teacher']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <TeacherDashboard /> },
          { path: '*', element: <TeacherDashboard /> },
        ],
      },
    ],
  },
  {
    path: '/parent',
    element: <RequireAuth allowedRoles={['parent']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <ParentDashboard /> },
          { path: '*', element: <ParentDashboard /> },
        ],
      },
    ],
  },
  {
    path: '/superadmin',
    element: <RequireAuth allowedRoles={['super_admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <SuperAdminDashboard /> },
          { path: '*', element: <SuperAdminDashboard /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
