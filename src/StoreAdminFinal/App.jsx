import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { ProfileProvider } from './context/ProfileContext';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './ThemeContext';
import Header from './components/Header';
import OrderDetailPage from './components/OrderDetails/OrderDetailPage';
import Sidebar from './components/Sidebar';
import { ordersData } from './data/ordersData';
import sellersData from './data/sellersData';
import { productsData, sellerData } from './data/mockData';
import BrandPage from './pages/BrandPage';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import DeliveryPartners from './pages/DeliveryPartners';
import DeliveryPartnerProfile from './pages/DeliveryPartnerProfile';
import Employees from './pages/Employees';
import Login from './pages/Login';
import OrderFromHub from './pages/OrderFromHub';
import CreateEmployee from './pages/employees/CreateEmployee';
import EmployeeDetails from './pages/employees/EmployeeDetails';
import EmployeeLayout from './pages/employees/EmployeeLayout';
import { Statistics } from './pages/OtherPages';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';
import Products from './pages/Products';
import ProductsGrid from './pages/ProductsGrid';
import Reviews from './pages/Reviews';
import SellerDetailPage from './pages/SellerDetailPage';
import Sellers from './pages/Sellers';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import './styles/main.css';


function App() {
  const routeDependencies = {
    Header,
    Sidebar,
    OrderDetailPage,
    SellerDetailPage,
    Dashboard,
    DeliveryPartners,
    DeliveryPartnerProfile,
    Login,
    OrderFromHub,
    ProductsGrid,
    Categories,
    ProductList,
    Products,
    Orders,
    Profile,
    Sellers,
    Employees,
    EmployeeLayout,
    CreateEmployee,
    EmployeeDetails,
    Transactions,
    Reviews,
    BrandPage,
    Statistics,
    Settings,
    useAuth,
    ordersData,
    sellersData,
    sellerData,
    productsData,
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <ReviewsProvider>
          <ProfileProvider>
            <AppRoutes {...routeDependencies} />
          </ProfileProvider>
        </ReviewsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
