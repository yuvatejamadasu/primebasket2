import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages for performance
const Login        = lazy(() => import('../pages/Login'));
const Statistics   = lazy(() => import('../pages/Statistics'));
const Profile      = lazy(() => import('../pages/Profile'));
const Settings     = lazy(() => import('../pages/Settings'));
const HelpCenter   = lazy(() => import('../pages/HelpCenter'));
const Logout       = lazy(() => import('../pages/Logout'));
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdminDashboard'));
const CreateAdmin  = lazy(() => import('../pages/CreateAdmin'));
const CreateSuperAdmin = lazy(() => import('../pages/CreateSuperAdmin'));

// Loading spinner fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={36} className="animate-spin text-blue-500" />
      <p className="text-sm font-semibold text-slate-400">Loading page...</p>
    </div>
  </div>
);

const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes without Sidebar */}
      <Route path="/login" element={wrap(Login)} />

      {/* All routes nested inside Layout – renders Sidebar + Navbar for every page */}
      <Route element={<Layout />}>
        {/* Default redirect to Login */}
        <Route index element={<Navigate to="/login" replace />} />

        {/* Main pages */}
        <Route path="/super-admin-dashboard" element={wrap(SuperAdminDashboard)} />
        <Route path="/statistics"   element={wrap(Statistics)} />
        <Route path="/create-admin" element={wrap(CreateAdmin)} />
        <Route path="/create-super-admin" element={wrap(CreateSuperAdmin)} />

        {/* Account pages */}
        <Route path="/profile"  element={wrap(Profile)} />
        <Route path="/settings" element={wrap(Settings)} />
        <Route path="/help"     element={wrap(HelpCenter)} />
        <Route path="/logout"   element={wrap(Logout)} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
