import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const routes = {
  '/': { label: 'Super Admin Dashboard', parent: null },

  // Hub Level
  '/hub-login': { label: 'Hub Login', parent: '/' },
  '/hub-signup': { label: 'Hub Signup', parent: '/' },
  '/hub-dashboard': { label: 'Hub Dashboard', parent: '/hub-login' },
  '/hub': { label: 'Hub Form', parent: '/hub-dashboard' },
  '/hub-admin': { label: 'Hub Admin Panel', parent: '/hub-dashboard' },

  // Store Level
  '/store-login': { label: 'Store Login', parent: '/hub-dashboard' },
  '/store-signup': { label: 'Store Signup', parent: '/hub-dashboard' },
  '/store-dashboard': { label: 'Store Dashboard', parent: '/store-login' },
  '/store': { label: 'Store Form', parent: '/store-dashboard' },
  '/store-admin': { label: 'Store Admin Panel', parent: '/store-dashboard' },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = (path) => {
    const crumbs = [];
    let currentPath = path;

    // Safety limit
    const maxDepth = 15;
    let depth = 0;

    while (currentPath && depth < maxDepth) {
      const route = routes[currentPath];
      if (route) {
        crumbs.unshift({ path: currentPath, label: route.label });
        currentPath = route.parent;
      } else {
        break;
      }
      depth++;
    }
    
    // Always start with 'Super Admin Dashboard' if not present
    if (crumbs.length === 0 || (crumbs[0].path !== '/' && !crumbs.some(c => c.path === '/'))) {
        crumbs.unshift({ path: '/', label: 'Super Admin Dashboard' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-2 overflow-hidden">
            <NavLink to="/" className="shrink-0 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:bg-indigo-700 transition-all active:scale-95">
                PB
              </div>
            </NavLink>
            
            <div className="flex flex-col ml-1 overflow-hidden">
              <span className="font-bold text-lg text-gray-900 tracking-tight leading-tight">Prime Basket</span>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-400 overflow-x-auto pb-1 scrollbar-hide">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <span className="mx-0.5 text-gray-300 shrink-0">/</span>}
                    <button
                      onClick={() => navigate(crumb.path)}
                      className={`hover:text-indigo-600 transition-colors whitespace-nowrap ${
                        index === breadcrumbs.length - 1 ? 'text-indigo-600 font-semibold underline decoration-indigo-200 underline-offset-2' : ''
                      }`}
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          
          <div className="shrink-0 hidden md:block">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Admin Portal</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
