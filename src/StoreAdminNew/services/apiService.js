/**
 * apiService.js — Reusable API service for Hub Admin Dashboard
 *
 * Profile endpoints target json-server at http://localhost:4000.
 * All functions return { data, error } so callers can handle both
 * success and failure without try/catch boilerplate.
 */

import axios from 'axios';

const JSON_SERVER_BASE = import.meta.env.VITE_API_URL || 'https://prime-basket-mx8g.vercel.app/api';
const LOCAL_PROFILE_URL = '/data/profile.json';

// ─── Helpers ────────────────────────────────────────────────────────────────

const headers = { 'Content-Type': 'application/json' };

/** Safe fetch wrapper — returns { data } or { error } */
const safeFetch = async (url, options = {}) => {
  try {
    const res = await axios({
      url,
      method: options.method || 'GET',
      headers: options.headers || headers,
      data: options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined,
    });
    return { data: res.data };
  } catch (err) {
    return { error: err.response?.data?.message || err.message || 'Unknown error' };
  }
};

// ─── Profile API ─────────────────────────────────────────────────────────────

/**
 * GET /profile/1 from json-server.
 * Falls back to /data/profile.json if json-server is unavailable.
 */
export const getProfile = async () => {
  // Try json-server first
  const result = await safeFetch(`${JSON_SERVER_BASE}/profile/1`);
  if (!result.error) return result;

  // Fallback: static public JSON
  console.warn('[apiService] json-server unreachable, falling back to /data/profile.json');
  const fallback = await safeFetch(LOCAL_PROFILE_URL);
  return fallback;
};

/**
 * PUT /profile/1 — persist updated profile to json-server.
 * json-server writes the change to its source db.json automatically.
 *
 * @param {Object} profileData — full profile object to persist
 */
export const updateProfile = async (profileData) => {
  const result = await safeFetch(`${JSON_SERVER_BASE}/profile/1`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(profileData),
  });

  if (result.error) {
    console.warn('[apiService] PUT /profile/1 failed:', result.error);
  }

  return result;
};

/**
 * PATCH /profile/1 — partial update (only changed fields).
 *
 * @param {Object} partial — subset of profile fields to update
 */
export const patchProfile = async (partial) => {
  const result = await safeFetch(`${JSON_SERVER_BASE}/profile/1`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(partial),
  });

  if (result.error) {
    console.warn('[apiService] PATCH /profile/1 failed:', result.error);
  }

  return result;
};
