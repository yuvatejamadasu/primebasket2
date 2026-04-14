import React, { useMemo, useState } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

const normalizeSeller = (seller, sellerData) => ({
  id: seller?.id ?? sellerData.id,
  sellerId: seller?.sellerId || sellerData.sellerId || `#${seller?.id ?? sellerData.id}`,
  name: seller?.name || sellerData.name,
  email: seller?.email || sellerData.email,
  status: seller?.status || sellerData.status || 'Active',
  registered: seller?.registered || sellerData.registered || '',
  address: seller?.address || sellerData.address,
  phones: seller?.phones || sellerData.phones,
  totalSales: seller?.totalSales ?? sellerData.totalSales,
  revenue: seller?.revenue ?? sellerData.revenue,
  manager: seller?.manager || sellerData.manager,
  country: seller?.country || sellerData.country,
  street: seller?.street || sellerData.street,
  city: seller?.city || sellerData.city,
  postal: seller?.postal || sellerData.postal,
});

function HomeRedirect({ useAuth }) {
  const { user } = useAuth();

  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

function LoginRoute({ Login, useAuth }) {
  const { user } = useAuth();
  const location = useLocation();
  const from = typeof location.state?.from === 'string' ? location.state.from : '/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <Login />;
}

function RequireAuth({ useAuth }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return <Outlet />;
}

function DashboardLayout({ Header, Sidebar }) {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        minimized={sidebarMinimized}
        onMinimize={() => setSidebarMinimized((current) => !current)}
        mobileOpen={mobileOpen}
        onOverlayClick={() => setMobileOpen(false)}
        onNavigate={() => setMobileOpen(false)}
      />
      <div className={`main-content${sidebarMinimized ? ' sidebar-minimized' : ''}`}>
        <Header onMobileMenu={() => setMobileOpen(true)} />
        <div className="content-area">
          <Outlet />
        </div>
        <footer className="main-footer">
          <span>&copy; {new Date().getFullYear()} Prime-Basket Dashboard. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}



function SellerDetailRoute({ SellerDetailPage, productsData, sellerData, sellersData }) {
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const currentSeller = useMemo(() => {
    const matchedSeller = sellersData.find((seller) => String(seller.id) === sellerId);
    return matchedSeller ? normalizeSeller(matchedSeller, sellerData) : null;
  }, [sellerData, sellerId, sellersData]);

  if (!currentSeller) {
    return <Navigate to="/sellers" replace />;
  }

  return (
    <SellerDetailPage
      seller={currentSeller}
      products={productsData}
      onBack={() => navigate('/sellers')}
    />
  );
}

function OrderDetailRoute({ OrderDetailPage, ordersData }) {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const order = useMemo(
    () => ordersData.find((entry) => String(entry.id) === orderId) || null,
    [orderId, ordersData]
  );

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return <OrderDetailPage order={order} onBack={() => navigate('/orders')} />;
}

export default function AppRoutes({
  BrandPage,
  Categories,
  CreateEmployee,
  Dashboard,
  DeliveryPartners,
  DeliveryPartnerProfile,
  EmployeeDetails,
  EmployeeLayout,
  Employees,
  Header,
  Login,
  OrderFromHub,
  OrderDetailPage,
  Orders,
  ordersData,
  Profile,
  ProductList,
  Products,
  productsData,
  ProductsGrid,
  Reviews,
  SellerDetailPage,
  sellerData,
  Sellers,
  sellersData,
  Settings,
  Sidebar,
  Statistics,
  Transactions,
  useAuth,
}) {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect useAuth={useAuth} />} />
      <Route path="/login" element={<LoginRoute Login={Login} useAuth={useAuth} />} />

      <Route element={<RequireAuth useAuth={useAuth} />}>
        <Route element={<DashboardLayout Header={Header} Sidebar={Sidebar} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Navigate to="/products/grid" replace />} />
          <Route path="products/grid" element={<ProductsGrid />} />
          <Route path="products/categories" element={<Categories />} />
          <Route path="products/list" element={<ProductList />} />
          <Route path="products/overview" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-from-hub" element={<OrderFromHub />} />
          <Route
            path="orders/:orderId"
            element={<OrderDetailRoute OrderDetailPage={OrderDetailPage} ordersData={ordersData} />}
          />
          <Route path="delivery-partners" element={<DeliveryPartners />} />
          <Route path="delivery-partners/:partnerId" element={<DeliveryPartnerProfile />} />
          <Route path="sellers" element={<Sellers />} />
          <Route
            path="sellers/:sellerId"
            element={
              <SellerDetailRoute
                SellerDetailPage={SellerDetailPage}
                productsData={productsData}
                sellerData={sellerData}
                sellersData={sellersData}
              />
            }
          />
          <Route path="employees" element={<EmployeeLayout />}>
            <Route index element={<Employees />} />
            <Route path="create" element={<CreateEmployee />} />
            <Route path=":employeeId" element={<EmployeeDetails />} />
          </Route>
          <Route path="transactions" element={<Transactions />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="brands" element={<BrandPage />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Navigate to="/profile" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<HomeRedirect useAuth={useAuth} />} />
    </Routes>
  );
}
