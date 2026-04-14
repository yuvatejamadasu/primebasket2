import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HubLogin from "./Pages/HubLogin";
import HubForm from "./Pages/HubForm";
import StoreLogin from "./Pages/StoreLogin";
import StoreDashboard from "./Pages/StoreDashboard";
import StoreForm from "./Pages/StoreForm";
import HubSignup from "./Pages/HubSignup";
import StoreSignup from "./Pages/StoreSignup";
import ResetPassword from "./Pages/ResetPassword";
import Navbar from "./Components/Navbar";
import "./App.css";

// Super Admin Layout
import SuperAdminWrapper from "./SuperAdmin/SuperAdminWrapper";
import SuperAdminDashboard from "./SuperAdmin/pages/SuperAdminDashboard";
import Statistics from "./SuperAdmin/pages/Statistics";
import Profile from "./SuperAdmin/pages/Profile";
import Settings from "./SuperAdmin/pages/Settings";
import CreateAdmin from "./SuperAdmin/pages/CreateAdmin";
import CreateSuperAdmin from "./SuperAdmin/pages/CreateSuperAdmin";
import Login from "./SuperAdmin/pages/Login";
import Logout from "./SuperAdmin/pages/Logout";
import HelpCenter from "./SuperAdmin/pages/HelpCenter";
import { Navigate } from "react-router-dom";
import { ThemeProvider } from "./SuperAdmin/context/ThemeContext";

import HubAdminRoutes from "./HubAdminV2/routes/AppRoutes";
import { ThemeProvider as HubThemeProvider } from "./HubAdminV2/context/ThemeContext";
import { ReviewsProvider as HubReviewsProvider } from "./HubAdminV2/context/ReviewsContext";
import { ProfileProvider as HubProfileProvider } from "./HubAdminV2/context/ProfileContext";

import StoreAdminRoutesV2 from "./StoreAdminV2/routes/AppRoutes";
import { ThemeProvider as StoreThemeProvider } from "./StoreAdminV2/context/ThemeContext";
import { ReviewsProvider as StoreReviewsProvider } from "./StoreAdminV2/context/ReviewsContext";
import { ProfileProvider as StoreProfileProvider } from "./StoreAdminV2/context/ProfileContext";

function App() {
  const location = useLocation();
  const superAdminRoutes = ['/', '/dashboard', '/statistics', '/profile', '/settings', '/create-admin', '/create-super-admin', '/help', '/logout'];
  const isSuperAdminRoute = superAdminRoutes.includes(location.pathname);
  const isAuthenticated = localStorage.getItem('superAdminAuth') === 'true';

  if (location.pathname.startsWith('/hub-dashboard')) {
    return (
      <HubThemeProvider>
        <HubReviewsProvider>
          <HubProfileProvider>
            <Routes>
              <Route path="/hub-dashboard/*" element={<HubAdminRoutes />} />
            </Routes>
          </HubProfileProvider>
        </HubReviewsProvider>
      </HubThemeProvider>
    );
  }

  if (location.pathname.startsWith('/store-dashboard')) {
    return (
      <StoreThemeProvider>
        <StoreReviewsProvider>
          <StoreProfileProvider>
            <Routes>
              <Route path="/store-dashboard/*" element={<StoreAdminRoutesV2 />} />
            </Routes>
          </StoreProfileProvider>
        </StoreReviewsProvider>
      </StoreThemeProvider>
    );
  }

  if (location.pathname === '/login') {
    return (
      <ThemeProvider>
        <Routes>
          // This check now ensures session-aware redirection
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        </Routes>
      </ThemeProvider>
    );
  }

   if (isSuperAdminRoute) {
     return (
       <ThemeProvider>
         <Routes>
            // This check now ensures session-aware redirection
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route element={<SuperAdminWrapper />}>
               <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
               <Route path="/dashboard" element={isAuthenticated ? <SuperAdminDashboard /> : <Navigate to="/login" />} />
           <Route path="/statistics" element={isAuthenticated ? <Statistics /> : <Navigate to="/login" />} />
           <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
           <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
           <Route path="/create-admin" element={isAuthenticated ? <HubSignup /> : <Navigate to="/login" />} />
           <Route path="/create-super-admin" element={isAuthenticated ? <CreateSuperAdmin /> : <Navigate to="/login" />} />
           <Route path="/help" element={isAuthenticated ? <HelpCenter /> : <Navigate to="/login" />} />
           <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </ThemeProvider>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/hub-login" element={<HubLogin />} />
            <Route path="/hub" element={<HubForm />} />
            <Route path="/store-login" element={<StoreLogin />} />
            <Route path="/store-dashboard" element={<StoreDashboard />} />
            <Route path="/store" element={<StoreForm />} />
            <Route path="/hub-signup" element={<HubSignup />} />
            <Route path="/store-signup" element={<StoreSignup />} />
            <Route path="/store-admin" element={<div className="text-center py-20"><h1 className="text-3xl font-bold">Store Admin Panel</h1><p className="text-gray-500 mt-4">Coming Soon</p></div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
