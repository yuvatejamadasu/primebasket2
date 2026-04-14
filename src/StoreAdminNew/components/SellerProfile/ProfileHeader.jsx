import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ExternalLink, ChevronDown, MapPin, Phone, Mail, User } from 'lucide-react';
import sellerLogo from '../../assets/seller-profile1.png';
import mapImage from '../../assets/map.png';
import './ProfileHeader.css';

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
    <div className="profile-header">
      <button className="profile-header__back" type="button" onClick={onBack}>
        <ArrowLeft size={16} />
        Go back
      </button>

      <div className="profile-header__card">
        <div className="profile-header__banner" />

        <div className="profile-header__body">
          <div className="profile-header__logo-wrap">
            <div className="profile-header__logo">
              <img src={sellerLogo} alt={`${seller.name} logo`} />
            </div>
          </div>

          <div className="profile-header__info">
            <div className="profile-header__name-row">
              <div>
                <h2 className="profile-header__name">{seller.name}</h2>
                <p className="profile-header__address">
                  <MapPin size={13} />
                  {seller.address}
                </p>
              </div>

              <div className="profile-header__actions">
                <div className="profile-header__actions-dropdown" ref={dropRef}>
                  <button
                    type="button"
                    className="profile-header__actions-btn"
                    onClick={() => setActionsOpen(!actionsOpen)}
                  >
                    Actions <ChevronDown size={14} />
                  </button>
                  {actionsOpen && (
                    <div className="profile-header__dropdown">
                      {actionItems.map((action) => (
                        <button
                          key={action}
                          className="profile-header__dropdown-item"
                          type="button"
                          onClick={() => setActionsOpen(false)}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="profile-header__view-btn">
                  View live <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-header__stats">
          <div className="profile-header__stat-col">
            <span className="profile-header__stat-label">Total sales:</span>
            <span className="profile-header__stat-value">{seller.totalSales}</span>
            <span className="profile-header__stat-label">Revenue:</span>
            <span className="profile-header__stat-value">${seller.revenue}</span>
          </div>

          <div className="profile-header__contact-col">
            <h4>Contacts</h4>
            <div className="profile-header__contact-item">
              <User size={13} /> Manager: {seller.manager}
            </div>
            <div className="profile-header__contact-item">
              <Mail size={13} /> {seller.email}
            </div>
            <div className="profile-header__contact-item">
              <Phone size={13} /> {seller.phones?.join(', ') || 'No phone available'}
            </div>
          </div>

          <div className="profile-header__address-col">
            <h4>Address</h4>
            <p>Country: {seller.country}</p>
            <p>Address: {seller.street}</p>
            <p>{seller.city}</p>
            <p>Postal code: {seller.postal}</p>
          </div>

          <div className="profile-header__map-col">
            <div className="profile-header__map">
              <img
                src={mapImage}
                alt="Store location map"
                className="profile-header__map-img"
              />
              <div className="profile-header__map-pin" />
              <div className="profile-header__map-large">Large</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
