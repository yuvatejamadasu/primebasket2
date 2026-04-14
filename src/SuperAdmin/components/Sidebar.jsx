import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  User, BarChart2,
  ChevronLeft, Menu, Shield, UserPlus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import primebasketLogoImg from '../assets/primebasket-logo.png';

const Sidebar = ({ isMinimized, setMinimized }) => {
  const { isDark } = useTheme();

  const user = { role: 'super_admin' };

  const navItems = [
    { icon: <Shield size={20} />, label: 'Super Admin', path: '/dashboard' },
    { icon: <UserPlus size={20} />, label: 'Create Admin', path: '/create-admin' },
    { icon: <BarChart2 size={20} />, label: 'Statistics', path: '/statistics' },
    { icon: <Shield size={20} />, label: 'Add Super Admin', path: '/create-super-admin' },
  ];

  const bottomItems = [
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ];

  const linkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative text-sm font-semibold
    ${isActive
      ? 'bg-brand text-white shadow-md shadow-brand/20'
      : (isDark
        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
        : 'text-slate-600 hover:bg-blue-50 hover:text-brand')}
    ${isMinimized ? 'justify-center' : ''}
  `;

  return (
    <aside className={`sidebar fixed left-0 top-0 h-screen transition-all duration-300 z-50 border-r ${isMinimized ? 'w-20 collapsed' : 'w-64'
      } ${isDark ? 'bg-[#1a1d21] border-slate-700/50' : 'bg-white border-slate-200'
      }`}>
      {/* Sidebar Header */}
      <div className={`sidebar-header h-16 flex items-center justify-between ${isMinimized ? 'px-3' : 'px-4'}`}>
        <div className="sidebar-brand flex items-center gap-2.5 px-1">
          <img
            src={primebasketLogoImg}
            alt="Prime Basket Logo"
            className="brand-logo h-8 w-auto"
            style={{ background: 'transparent' }}
          />
          {!isMinimized && (
            <span className={`brand-name text-lg font-bold whitespace-nowrap ${isDark ? 'text-white' : ''}`} style={{ color: '#1d5ba0' }}>
              Prime-Basket
            </span>
          )}
        </div>
        <button
          onClick={() => setMinimized(prev => !prev)}
          className={`menu-toggle p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
        >
          {isMinimized ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="px-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar pt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={linkClass}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            {!isMinimized && (
              <span className="flex-1">{item.label}</span>
            )}
            {isMinimized && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}

        <div className={`my-4 mx-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}></div>

        {bottomItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={linkClass}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            {!isMinimized && (
              <span className="flex-1">{item.label}</span>
            )}
            {isMinimized && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
