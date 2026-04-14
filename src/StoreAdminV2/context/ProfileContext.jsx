import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile, updateProfile as apiUpdateProfile } from '../services/apiService';

const ProfileContext = createContext();

const DEFAULT_PROFILE = {
  fullName: 'Admin User',
  email: 'admin@primebasket.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  role: 'Store Administrative',
  website: 'https://primebasket.com',
  bio: 'Responsible for overseeing platform operations, seller management, and product approvals across all regions.',
  profileImage: '',
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile]     = useState(DEFAULT_PROFILE);
  const [loading, setLoading]     = useState(true);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving]   = useState(false);

  // ── Boot: load from localStorage cache first, then refresh from API ──
  useEffect(() => {
    const cached = localStorage.getItem('profileData');
    if (cached) {
      try {
        setProfile(JSON.parse(cached));
      } catch (_) { /* ignore bad cache */ }
    }

    getProfile().then(({ data, error }) => {
      if (data) {
        const merged = { ...DEFAULT_PROFILE, ...data };
        setProfile(merged);
        localStorage.setItem('profileData', JSON.stringify(merged));
      }
      // If API fails we keep whatever was in cache / default — no crash
      setLoading(false);
    });
  }, []);

  // ── updateProfile: PUT to json-server, then update local state + cache ──
  const updateProfile = useCallback(async (updatedData) => {
    setIsSaving(true);
    setSaveError(null);

    const { data, error } = await apiUpdateProfile(updatedData);

    if (error) {
      // Server unreachable — persist locally so data isn't lost
      console.warn('[ProfileContext] API save failed, persisting locally:', error);
      setSaveError('Server unavailable — changes saved locally only.');
      setProfile(updatedData);
      localStorage.setItem('profileData', JSON.stringify(updatedData));
    } else {
      const saved = { ...DEFAULT_PROFILE, ...data };
      setProfile(saved);
      localStorage.setItem('profileData', JSON.stringify(saved));
      setSaveError(null);
    }

    setIsSaving(false);
    return { error };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, isSaving, saveError, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
