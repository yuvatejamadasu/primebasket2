import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Users,
  CreditCard,
  Star,
  Award,
  BarChart2,
  User,
  Settings,
  ChevronDown,
  Menu,
  Truck,
  X
} from 'lucide-react';

const navItems = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'Dashboard',
    to: '/dashboard',
    matches: ['/dashboard'],
  },
  {
    id: 'products',
    icon: ShoppingBag,
    label: 'Products',
    to: '/products/grid',
    matches: ['/products'],
  },
  {
    id: 'orders',
    icon: ShoppingCart,
    label: 'Orders',
    to: '/orders',
    matches: ['/orders'],
  },
  {
    id: 'order-from-hub',
    icon: ShoppingBag,
    label: 'Order From Hub',
    to: '/order-from-hub',
    matches: ['/order-from-hub'],
  },
  {
    id: 'employees',
    icon: Users,
    label: 'Employees',
    to: '/employees',
    matches: ['/employees'],
  },
  {
    id: 'sellers',
    icon: Users,
    label: 'Sellers',
    to: '/sellers',
    matches: ['/sellers'],
  },
  {
    id: 'transactions',
    icon: CreditCard,
    label: 'Transactions',
    to: '/transactions',
    matches: ['/transactions'],
  },
  {
    id: 'delivery-partners',
    icon: Truck,
    label: 'Delivery Partners',
    to: '/delivery-partners',
    matches: ['/delivery-partners'],
  },
   {
    id: 'reviews',
    icon: Star,
    label: 'Reviews',
    to: '/reviews',
    matches: ['/reviews'],
  },
  {
    id: 'brands',
    icon: Award,
    label: 'Brands',
    to: '/brands',
    matches: ['/brands'],
  },
  {
    id: 'statistics',
    icon: BarChart2,
    label: 'Statistics',
    to: '/statistics',
    matches: ['/statistics'],
  },
];

const settingsItems = [
  {
    id: 'account',
    icon: User,
    label: 'Profile',
    to: '/profile',
    matches: ['/profile'],
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    to: '/settings',
    matches: ['/settings'],
  },
];

const Sidebar = ({ minimized, onMinimize, mobileOpen, onOverlayClick, onNavigate }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (id) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (item) => {
    if (item.matches) {
      return item.matches.some((path) => location.pathname.startsWith(path));
    }
    if (item.to) return location.pathname === item.to;
    if (item.submenu) return item.submenu.some(s => location.pathname.startsWith(s.to));
    return false;
  };

  const renderItems = (items) => items.map(item => {
    const active = isActive(item);
    const isOpen = openMenus[item.id] || active;

    return (
      <li key={item.id} className={`menu-item${item.submenu ? ' has-submenu' : ''}${active ? ' active' : ''}${isOpen && item.submenu ? ' open' : ''}`}>
        <div
          className={`menu-link${active ? ' active' : ''}`}
          onClick={() => {
            if (item.submenu) {
              toggleMenu(item.id);
            } else {
              navigate(item.to);
              onNavigate && onNavigate(item.to);
              onOverlayClick && onOverlayClick();
            }
          }}
        >
          <item.icon className="icon" size={22} strokeWidth={1.5} />
          <span className="text">{item.label}</span>
          {item.submenu && (
            <ChevronDown className="submenu-arrow" size={18} />
          )}
        </div>
        {item.submenu && (
          <div className="submenu">
            {item.submenu.map((sub, i) => (
              <a
                key={i}
                href={sub.to}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(sub.to);
                  onNavigate && onNavigate(sub.to);
                  onOverlayClick && onOverlayClick();
                }}
              >
                {sub.label}
              </a>
            ))}
          </div>
        )}
      </li>
    );
  });

  return (
    <>
      {mobileOpen && (
        <div className="screen-overlay active" onClick={onOverlayClick} />
      )}
      <aside className={`sidebar${minimized ? ' minimized' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand-wrap">
            <img
              src={logo}
              alt="Prime-Basket Logo"
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />            <span className="brand-name">Prime-Basket</span>
          </div>
          <button className="minimize-btn" onClick={onMinimize} title="Toggle sidebar">
            <Menu size={24} color="#666" />
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="menu-aside">
            {renderItems(navItems)}
          </ul>
          <div className="menu-section-divider" />
          <ul className="menu-aside">
            {renderItems(settingsItems)}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
