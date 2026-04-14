import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Moon, Sun, Maximize, Minimize, Globe, ChevronDown,
  User, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import avatarImg from '../assets/avatar.png';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import NotificationDropdown from './NotificationDropdown';
import LanguageDropdown from './LanguageDropdown';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const handleNavigate = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
        setShowNotifications(false);
        setShowLanguage(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300 ${
      isDark ? 'bg-[#1a1d21] border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-md w-full">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search term..."
            className={`w-full border rounded-lg py-2.5 pl-4 pr-10 outline-none transition-all text-sm font-bold ${
              isDark
                ? 'bg-[#2c3136] border-slate-600 text-slate-200 focus:ring-blue-500/20 focus:border-brand'
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500/20 focus:border-brand shadow-inner'
            }`}
          />
          <button className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-400 hover:text-brand-hover' : 'text-slate-400 hover:text-brand'}`}>
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className={`p-2.5 rounded-lg transition-all group ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-brand'}`} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {isDark ? <Sun size={20} className="transition-transform group-hover:rotate-90" /> : <Moon size={20} className="transition-transform group-hover:-rotate-12" />}
        </button>

        {/* Maximize */}
        <button onClick={toggleFullscreen} className={`p-2.5 rounded-lg transition-colors lg:block hidden ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-brand'}`}>
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* Language */}
        <div className="relative">
          <button onClick={() => setShowLanguage(!showLanguage)} className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-brand'}`}>
            <Globe size={20} />
            <ChevronDown size={14} className={`transition-transform opacity-50 ${showLanguage ? 'rotate-180' : ''}`} />
          </button>
          
          {showLanguage && (
            <LanguageDropdown isDark={isDark} selectedLang={selectedLanguage} setSelectedLang={setSelectedLanguage} onClose={() => setShowLanguage(false)} />
          )}
        </div>

        <div className={`h-6 w-px mx-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 cursor-pointer group focus:outline-none">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all shadow-sm">
              <img src={profile.profileImage || avatarImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block text-left">
              <p className={`text-xs font-bold leading-none ${isDark ? 'text-white' : 'text-slate-800'}`}>{profile.fullName}</p>
              <p className="text-[10px] text-slate-500 mt-1">{profile.role}</p>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'} ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className={`absolute right-0 mt-3 w-64 rounded-xl border shadow-2xl z-50 py-2 ${isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className={`px-4 py-3 mb-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{profile.fullName}</p>
                <p className="text-xs text-slate-500">{profile.email}</p>
              </div>
              <DropdownItem icon={<User size={16} />} label="Edit Profile" isDark={isDark} onClick={() => handleNavigate('/profile')} />
              <div className={`my-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}></div>
              <DropdownItem icon={<LogOut size={16} />} label="Logout" isDark={isDark} danger onClick={() => handleNavigate('/logout')} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const DropdownItem = ({ icon, label, danger, isDark, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
    danger
      ? 'text-rose-500 hover:bg-rose-500/10'
      : isDark ? 'text-slate-300 hover:bg-slate-700/50 hover:text-brand-hover' : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
  }`}>
    <span className={`${danger ? 'text-rose-500' : isDark ? 'text-slate-500' : 'text-slate-400'} transition-colors`}>{icon}</span>
    {label}
  </button>
);

export default Navbar;
