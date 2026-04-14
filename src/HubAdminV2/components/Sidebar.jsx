import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home, ShoppingBag, ShoppingCart, Users,
  CreditCard, User, Star, Award, BarChart2,
  ChevronLeft, Menu, PlusCircle, Briefcase, Store
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo.png';
import primebasketLogoImg from '../assets/primebasket-logo.png';

export const navItems = [
  { icon: <Home size={20} />, label: 'Dashboard', path: '/hub-dashboard/dashboard' },
  { icon: <ShoppingBag size={20} />, label: 'Products', path: '/hub-dashboard/products' },
  { icon: <PlusCircle size={20} />, label: 'Add Product', path: '/hub-dashboard/add-product' },
  { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/hub-dashboard/orders' },
  { icon: <Store size={20} />, label: 'Stores', path: '/hub-dashboard/sellers' },
  { icon: <PlusCircle size={20} />, label: 'Create Admin', path: '/hub-dashboard/create-admin' },
  { icon: <CreditCard size={20} />, label: 'Transactions', path: '/hub-dashboard/transactions' },
  { icon: <Briefcase size={20} />, label: 'Employees', path: '/hub-dashboard/employees' },
  { icon: <Award size={20} />, label: 'Brands', path: '/hub-dashboard/brands' },
];

const Sidebar = ({ isMinimized, setMinimized }) => {
  const { isDark } = useTheme();

  const linkClass = ({ isActive }) => `
    flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
    ${isActive
      ? 'bg-brand text-white shadow-lg shadow-brand-light'
      : (isDark
        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
        : 'text-slate-500 hover:bg-brand-light hover:text-brand')}
    ${isMinimized ? 'justify-center' : ''}
  `;

  return (
    <aside className={`sidebar fixed left-0 top-0 h-screen transition-all duration-300 z-50 border-r ${isMinimized ? 'w-20 collapsed' : 'w-64'
      } ${isDark ? 'bg-[#1a1d21] border-slate-700/50 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
      {/* Sidebar Header */}
      <div className={`sidebar-header h-20 ${isMinimized ? 'px-0' : 'px-2'}`}>
        <Link to="/hub-dashboard/dashboard" className="sidebar-brand">
          <img src={primebasketLogoImg} alt="Prime Basket Logo" className="brand-logo" />
          <span className="brand-name">Prime-Basket</span>
        </Link>
        <button
          onClick={() => setMinimized(prev => !prev)}
          className={`menu-toggle p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
        >
          {isMinimized ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="px-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)] custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/hub-dashboard/products'}
            className={linkClass}
          >
            <span className={`transition-transform duration-200 ${!isMinimized ? 'group-hover:scale-110' : ''}`}>
              {item.icon}
            </span>
            {!isMinimized && (
              <span className="flex-1 font-bold text-sm">{item.label}</span>
            )}
            {isMinimized && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}

        <div className={`my-6 mx-3 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}></div>

        <NavLink
          to="/hub-dashboard/profile"
          className={linkClass}
        >
          <User size={20} />
          {!isMinimized && <span className="font-bold text-sm">Profile</span>}
          {isMinimized && <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">Profile</div>}
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
