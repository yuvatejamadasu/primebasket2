import React from 'react';
import { Check } from 'lucide-react';

const languages = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'HI', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ES', name: 'Spanish', flag: '🇪🇸' }
];

const LanguageDropdown = ({ isDark, selectedLang, setSelectedLang, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div className={`absolute right-0 mt-3 w-48 rounded-xl border shadow-2xl z-50 py-2 transform origin-top-right transition-all animate-scale-in ${
        isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-100'
      }`}>
        <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Select Language
          </p>
        </div>
        
        {languages.map((lang) => {
          const isActive = selectedLang === lang.name;
          return (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang.name);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all ${
                isActive 
                  ? (isDark ? 'bg-brand/10 text-brand outline-none border-l-2 border-brand' : 'bg-brand/5 text-brand outline-none border-l-2 border-brand')
                  : (isDark ? 'text-slate-300 hover:bg-slate-700 border-l-2 border-transparent' : 'text-slate-600 hover:bg-slate-50 border-l-2 border-transparent hover:text-brand')
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {isActive && <Check size={16} className="text-brand" />}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default LanguageDropdown;
