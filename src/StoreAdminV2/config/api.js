/**
 * API Configuration
 *
 * ORDERS, SELLERS, BRANDS, STATISTICS → served from /public/data/ (static JSON).
 *   db.json has empty arrays for these, so we fetch directly from /data/*.json.
 *
 * PRODUCTS  → Backend API (VITE_API_URL)
 * REVIEWS   → Backend API (VITE_API_URL)
 * PROFILE   → Backend API (VITE_API_URL) — persisted via PUT on edit
 */

// Backend API base URL from environment
const BASE_URL = import.meta.env.VITE_API_URL || 'https://prime-basket-mx8g.vercel.app/api';
const PRODUCTS_BASE  = `${BASE_URL}/products`;
const REVIEWS_BASE   = `${BASE_URL}/reviews`;
const PROFILE_BASE   = `${BASE_URL}/profile`;

export const API = {
  // ── Static JSON in /public/data/ ──────────────────────────────────────
  ORDERS:     "/data/orders.json",
  SELLERS:    "/data/sellers.json",
  BRANDS:     "/data/brands.json",
  STATISTICS: "/data/statistics.json",
  STORES:     "/data/stores.json",
  DELIVERY_PARTNERS: "/data/delivery_partners.json",

  // ── json-server (db.json) ─────────────────────────────────────────────
  PRODUCTS: `${PRODUCTS_BASE}/products.json`,
  REVIEWS:  `${REVIEWS_BASE}`,
  PROFILE:  `${PROFILE_BASE}`,
};

// Default headers for REST endpoints
export const API_HEADERS = {
  "Content-Type": "application/json",
  // "Authorization": `Bearer ${your_token_here}`,
};
