import api from '../../utils/api';

const LOCAL_PROFILE_URL = '/data/profile.json';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safe fetch wrapper using axios — returns { data } or { error } */
const safeFetch = async (config) => {
  try {
    const response = await api(config);
    return { data: response.data };
  } catch (err) {
    return { error: err.response?.data?.message || err.message || 'Unknown error' };
  }
};

// ─── Profile API ──────────────────────────────────────────────────────────────

/**
 * GET profile from static /data/profile.json.
 */
export const getProfile = async () => {
  return await safeFetch({ url: LOCAL_PROFILE_URL });
};

/**
 * PUT /profile — no-op in static mode (Vercel).
 */
export const updateProfile = async (profileData) => {
  console.info('[apiService] Running in static mode — profile changes are session-only.');
  return { data: profileData };
};

/**
 * PATCH /profile — no-op in static mode (Vercel).
 */
export const patchProfile = async (partial) => {
  console.info('[apiService] Running in static mode — profile changes are session-only.');
  return { data: partial };
};
