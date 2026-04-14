import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import { 
  Menu, Search, Bell, Moon, Sun, Maximize, Globe, ChevronDown, Check,
  User, Settings, Wallet, FileText, HelpCircle, LogOut 
} from 'lucide-react';

const Header = ({ onMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'EN', flag: ' ', label: 'English' });

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { title: 'New order received', time: '2 minutes ago' },
    { title: 'Payment confirmed #SK2540', time: '15 minutes ago' },
    { title: 'New user registered', time: '1 hour ago' },
  ];

  const languages = [
    { code: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'KE', flag: 'ke', label: 'Kenya' },
    { code: 'FR', flag: '🇫🇷', label: 'French' },
    { code: 'DE', flag: '🇩🇪', label: 'German' },
    { code: 'HI', flag: '🇮🇳', label: 'Hindi' },
  ];

  return (
    <header className="main-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <button className="mobile-menu-btn" onClick={onMobileMenu}>
          <Menu size={20} />
        </button>
        <div className="header-search">
          <div className="search-input-wrap">
            <input
              type="text"
              placeholder="Search term..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <button className="search-btn">
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="header-nav">
        {/* Notifications */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <button className="nav-btn" onClick={() => { setNotifOpen(o => !o); setUserOpen(false); }} title="Notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          {notifOpen && (
            <div className="dropdown-menu notif-panel">
              <div style={{ padding: '4px 12px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                <strong style={{ fontSize: 13.5 }}>Notifications</strong>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="notif-item">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button className="nav-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Fullscreen */}
        <button
          className="nav-btn"
          title="Fullscreen"
          onClick={() => {
             if (!document.fullscreenElement) document.documentElement.requestFullscreen();
             else document.exitFullscreen();
          }}
        >
          <Maximize size={20} />
        </button>

        {/* Language Dropdown */}
        <div className="dropdown-wrapper" ref={langRef}>
          <button
            className="nav-btn lang-btn"
            onClick={() => { setLangOpen(o => !o); setNotifOpen(false); setUserOpen(false); }}
            title="Select Language"
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6 }}
          >
            <Globe size={20} />
            <ChevronDown size={14} style={{ marginLeft: 2 }} color="var(--text-muted)" />
          </button>
          {langOpen && (
            <div className="dropdown-menu" style={{ minWidth: 160 }}>
              <div style={{ padding: '4px 12px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                <strong style={{ fontSize: 13.5 }}>Language</strong>
              </div>
              {languages.map((lang, i) => (
                <button
                  key={i}
                  className={`dropdown-item ${selectedLang.code === lang.code ? 'active' : ''}`}
                  onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span style={{ fontSize: 18 }}>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {selectedLang.code === lang.code && (
                    <Check size={16} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }}></div>

        {/* User Profile */}
        <div className="dropdown-wrapper" ref={userRef}>
          <div className="user-profile-trigger" onClick={() => { setUserOpen(o => !o); setNotifOpen(false); }}>
            <div className="user-avatar" style={{ backgroundImage: `url(https://i.pravatar.cc/150?u=a042581f4e29026704d)`, backgroundSize: 'cover' }} />
            <div className="user-info-text">
              <span className="user-name">Admin </span>
              {/* <span className="user-role">Super Administrator</span> */}
            </div>
            <ChevronDown size={14} style={{ marginLeft: 4 }} color="var(--text-muted)" />
          </div>
          {userOpen && (
            <div className="dropdown-menu dropdown-menu-right" style={{ minWidth: 200, right: 0 }}>
              <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.name || 'Admin User'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email || 'admin@primebasket.com'}</div>
              </div>
              {[ 
                { icon: User, label: 'Edit Profile', to: '/account/general' },
                { icon: Settings, label: 'Account Settings', to: '/settings/general' },
                { icon: Wallet, label: 'Wallet' },
                { icon: FileText, label: 'Billing' },
                { icon: HelpCircle, label: 'Help Center' },
              ].map((item, i) => (
                <button
                  key={i}
                  className="dropdown-item"
                  onClick={() => {
                    setUserOpen(false);
                    if (item.to) {
                      navigate(item.to);
                    }
                  }}
                >
                  <item.icon size={16} color="var(--text-muted)" />
                  {item.label}
                </button>
              ))}
              <div className="dropdown-divider" />
              <button
                className="dropdown-item danger"
                onClick={() => {
                  setUserOpen(false);
                  logout();
                  navigate('/login', { replace: true });
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
