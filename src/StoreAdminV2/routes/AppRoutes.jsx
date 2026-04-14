import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages for performance
const Dashboard    = lazy(() => import('../pages/Dashboard'));
const Products     = lazy(() => import('../pages/Products'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Orders       = lazy(() => import('../pages/Orders'));
const OrderDetails = lazy(() => import('../pages/OrderDetails/OrderDetails'));
const Sellers      = lazy(() => import('../pages/Sellers'));
const SellerProfile = lazy(() => import('../pages/SellerProfile'));
const SellerAnalytics = lazy(() => import('../pages/SellerAnalytics'));
const Brands       = lazy(() => import('../pages/Brands/BrandPage'));
const BrandDetail   = lazy(() => import('../pages/Brands/BrandProductsPage'));
const Profile      = lazy(() => import('../pages/Profile'));
const Settings     = lazy(() => import('../pages/Settings'));
const Wallet       = lazy(() => import('../pages/Wallet'));
const Billing      = lazy(() => import('../pages/Billing'));
const HelpCenter   = lazy(() => import('../pages/HelpCenter'));
const OrderToHub     = lazy(() => import('../pages/OrderToHub'));
const Reviews        = lazy(() => import('../pages/Reviews'));
const Statistics     = lazy(() => import('../pages/Statistics'));
const DeliveryPartners = lazy(() => import('../pages/DeliveryPartners'));

// Employee Module
const EmployeeLayout  = lazy(() => import('../pages/Employees/EmployeeLayout'));
const EmployeesList   = lazy(() => import('../pages/Employees/EmployeesList'));
const CreateEmployee  = lazy(() => import('../pages/Employees/CreateEmployee'));
const EmployeeDetails = lazy(() => import('../pages/Employees/EmployeeDetails'));

// Loading spinner fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={36} className="animate-spin text-brand" />
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
      {/* All routes nested inside Layout – renders Sidebar + Navbar for every page */}
      <Route element={<Layout />}>
        {/* Default redirect */}
        <Route index element={<Navigate to="/store-dashboard/dashboard" replace />} />

        {/* Main pages */}
        <Route path="dashboard"    element={wrap(Dashboard)} />
        <Route path="products"     element={wrap(Products)} />
        <Route path="reviews"      element={wrap(Reviews)} />
        <Route path="order-to-hub"  element={wrap(OrderToHub)} />
        <Route path="delivery-partners" element={wrap(DeliveryPartners)} />
        <Route path="statistics"    element={wrap(Statistics)} />
        <Route path="transactions" element={wrap(Transactions)} />
        <Route path="orders"       element={wrap(Orders)} />
        <Route path="orders/:id"   element={wrap(OrderDetails)} />
        <Route path="sellers"      element={wrap(Sellers)} />
        <Route path="sellers/:id"  element={wrap(SellerProfile)} />
        <Route path="sellers/:id/analytics" element={wrap(SellerAnalytics)} />
        <Route path="sellers/*"    element={wrap(Sellers)} />
        <Route path="brands"       element={wrap(Brands)} />
        <Route path="brands/:id"   element={wrap(BrandDetail)} />

        {/* Employee Module */}
        <Route path="employees" element={wrap(EmployeeLayout)}>
          <Route index element={wrap(EmployeesList)} />
          <Route path="create" element={wrap(CreateEmployee)} />
          <Route path=":id" element={wrap(EmployeeDetails)} />
        </Route>

        {/* Account pages */}
        <Route path="profile"  element={wrap(Profile)} />
        <Route path="settings" element={wrap(Settings)} />
        <Route path="wallet"   element={wrap(Wallet)} />
        <Route path="billing"  element={wrap(Billing)} />
        <Route path="help"     element={wrap(HelpCenter)} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/store-dashboard/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
