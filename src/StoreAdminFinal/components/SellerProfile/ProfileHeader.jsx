import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ExternalLink, ChevronDown, MapPin, Phone, Mail, User } from 'lucide-react';
import sellerLogo from '../../assets/seller-profile1.png';
import mapImage from '../../assets/map.png';
const actionItems = ['Edit Profile', 'Delete Seller', 'Block Seller', 'View Reports'];

export default function ProfileHeader({ seller, onBack }) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="pt-0 px-0 pb-0">
      <button 
        className="inline-flex items-center gap-[6px] text-[var(--primary)] text-[14px] font-[600] mb-4 no-underline transition-opacity duration-200 hover:opacity-75 cursor-pointer bg-none border-none" 
        type="button" 
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Go back
      </button>

      <div className="bg-[var(--card-bg)] rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow)]">
        <div className="h-40 bg-linear-to-br from-[#f5c842] to-[#f0a500]" />

        <div className="flex px-6 pt-0 -mt-[50px] relative max-[480px]:flex-col max-[480px]:gap-3 max-[480px]:-mt-[30px]">
          <div className="shrink-0">
            <div className="w-[120px] h-[120px] bg-white rounded-[var(--radius)] shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center border-[3px] border-white overflow-hidden">
              <img src={sellerLogo} alt={`${seller.name} logo`} className="w-full h-full object-contain p-2" />
            </div>
          </div>

          <div className="flex-1 pt-[12px] pr-0 pb-4 pl-5 max-[480px]:p-[0_0_12px]">
            <div className="flex items-start justify-between gap-4 max-[768px]:flex-col max-[768px]:gap-3">
              <div>
                <h2 className="text-[22px] font-[800] text-[var(--text-primary)] m-0 mb-1 leading-[1.2] max-[768px]:text-[18px]">{seller.name}</h2>
                <p className="flex items-center gap-1 text-[13px] text-[var(--text-secondary)] mt-[2px]">
                  <MapPin size={13} />
                  {seller.address}
                </p>
              </div>

              <div className="flex gap-3 items-center shrink-0 max-[768px]:w-full max-[768px]:justify-start">
                <div className="relative" ref={dropRef}>
                  <button
                    type="button"
                    className="flex items-center gap-[6px] p-[9px_16px] border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] text-[14px] font-[600] cursor-pointer transition-colors duration-200 hover:bg-[var(--hover-bg)]"
                    onClick={() => setActionsOpen(!actionsOpen)}
                  >
                    Actions <ChevronDown size={14} />
                  </button>
                  {actionsOpen && (
                    <div className="absolute top-[calc(100%+4px)] right-0 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-md)] min-w-[150px] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1">
                      {actionItems.map((action) => (
                        <button
                          key={action}
                          className="block w-full p-[10px_16px] text-[13px] text-[var(--text-primary)] font-sans text-left bg-none border-none cursor-pointer transition-colors duration-150 hover:bg-[var(--hover-bg)] hover:text-[var(--primary)]"
                          type="button"
                          onClick={() => setActionsOpen(false)}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="flex items-center gap-2 p-[9px_20px] bg-[var(--primary)] text-white rounded-lg text-[14px] font-[700] cursor-pointer transition-colors duration-200 border-none hover:bg-[var(--primary-hover)]">
                  View live <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr_1fr_280px] gap-8 p-[20px_24px_24px] border-t border-[var(--border)] mt-2 max-[1100px]:grid-cols-[auto_1fr_1fr] max-[768px]:grid-cols-2 max-[768px]:gap-5 max-[480px]:grid-cols-1">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[13px] text-[var(--text-secondary)] font-[500]">Total sales:</span>
            <span className="text-[18px] font-[800] text-[var(--primary)] mb-[6px]">{seller.totalSales}</span>
            <span className="text-[13px] text-[var(--text-secondary)] font-[500]">Revenue:</span>
            <span className="text-[18px] font-[800] text-[var(--primary)] mb-[6px]">${seller.revenue}</span>
          </div>

          <div className="profile-header__contact-col">
            <h4 className="text-[14px] font-[700] mb-2 text-[var(--text-primary)]">Contacts</h4>
            <div className="flex items-center gap-[6px] text-[13px] text-[var(--text-secondary)] mb-1">
              <User size={13} /> Manager: {seller.manager}
            </div>
            <div className="flex items-center gap-[6px] text-[13px] text-[var(--text-secondary)] mb-1">
              <Mail size={13} /> {seller.email}
            </div>
            <div className="flex items-center gap-[6px] text-[13px] text-[var(--text-secondary)] mb-1">
              <Phone size={13} /> {seller.phones?.join(', ') || 'No phone available'}
            </div>
          </div>

          <div className="profile-header__address-col">
            <h4 className="text-[14px] font-[700] mb-2 text-[var(--text-primary)]">Address</h4>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">Country: {seller.country}</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">Address: {seller.street}</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">{seller.city}</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">Postal code: {seller.postal}</p>
          </div>

          <div className="max-[1100px]:hidden">
            <div className="w-full h-[130px] rounded-[10px] overflow-hidden relative">
              <img
                src={mapImage}
                alt="Store location map"
                className="block w-full h-full object-cover object-center"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#e53e3e] rounded-full shadow-[0_0_0_6px_rgba(229,62,62,0.3)] pointer-events-none" />
              <div className="absolute bottom-2 right-2 bg-[var(--primary)] text-white text-[11px] font-[700] p-[3px_8px] rounded-[4px] pointer-events-none">Large</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
