import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';
import type { AppDispatch, RootState } from './store/store';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Assessments from './pages/Assessments';
import Appointments from './pages/Appointments';
import Labs from './pages/Labs';
import Questionnaires from './pages/Questionnaires';
import Recommendations from './pages/Recommendations';
import Notifications from './pages/Notifications';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import LiverImageAnalysis from './pages/LiverImageAnalysis';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminQuestionnaires from './pages/Admin/QuestionnairesNew';
import CreateQuestionnaire from './pages/Admin/CreateQuestionnaire';
import AdminRecommendations from './pages/Admin/Recommendations';
import AdminNotifications from './pages/Admin/Notifications';
import AdminUsers from './pages/Admin/Users';
import AdminReports from './pages/Admin/Reports';

// Component bảo vệ route chỉ cho admin
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Public landing */}
      <Route path="/landing" element={<Landing />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <Landing />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/assessments"
        element={isAuthenticated ? <Sidebar><Assessments /></Sidebar> : <Navigate to="/login" />}
      />
      <Route
        path="/appointments"
        element={isAuthenticated ? <Sidebar><Appointments /></Sidebar> : <Navigate to="/login" />}
      />
      <Route
        path="/labs"
        element={isAuthenticated ? <Sidebar><Labs /></Sidebar> : <Navigate to="/login" />}
      />
      <Route
        path="/questionnaires"
        element={isAuthenticated ? <Sidebar><Questionnaires /></Sidebar> : <Navigate to="/login" />}
      />
      <Route
        path="/recommendations"
        element={isAuthenticated ? <Sidebar><Recommendations /></Sidebar> : <Navigate to="/login" />}
      />
      <Route
        path="/notifications"
        element={isAuthenticated ? <Sidebar><Notifications /></Sidebar> : <Navigate to="/login" />}
      />
      <Route
        path="/projects"
        element={isAuthenticated ? <Sidebar><Projects /></Sidebar> : <Navigate to="/login" />}
      />
          <Route
            path="/tasks"
            element={isAuthenticated ? <Sidebar><Tasks /></Sidebar> : <Navigate to="/login" />}
          />
          <Route
            path="/liver-analysis"
            element={isAuthenticated ? <Sidebar><LiverImageAnalysis /></Sidebar> : <Navigate to="/login" />}
          />

      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <Sidebar><AdminDashboard /></Sidebar>
        </AdminRoute>
      } />
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <Sidebar><AdminDashboard /></Sidebar>
        </AdminRoute>
      } />
          <Route path="/admin/questionnaires" element={
            <AdminRoute>
              <Sidebar><AdminQuestionnaires /></Sidebar>
            </AdminRoute>
          } />
          <Route path="/admin/questionnaires/create" element={
            <AdminRoute>
              <Sidebar><CreateQuestionnaire /></Sidebar>
            </AdminRoute>
          } />
      <Route path="/admin/recommendations" element={
        <AdminRoute>
          <Sidebar><AdminRecommendations /></Sidebar>
        </AdminRoute>
      } />
      <Route path="/admin/notifications" element={
        <AdminRoute>
          <Sidebar><AdminNotifications /></Sidebar>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <Sidebar><AdminUsers /></Sidebar>
        </AdminRoute>
      } />
      <Route path="/admin/reports" element={
        <AdminRoute>
          <Sidebar><AdminReports /></Sidebar>
        </AdminRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App; 