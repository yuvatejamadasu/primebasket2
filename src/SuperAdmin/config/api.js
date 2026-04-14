/**
 * API Configuration
 *
 * ORDERS, SELLERS, BRANDS, STATISTICS → served from /public/data/ (static JSON).
 *   db.json has empty arrays for these, so we fetch directly from /data/*.json.
 *
 * PRODUCTS  → json-server (localhost:4000)
 * REVIEWS   → json-server (localhost:4000)
 * PROFILE   → json-server (localhost:4000) — persisted via PUT on edit
 */

// Backend API base URL from environment variable
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://prime-basket-mx8g.vercel.app/api';

// API endpoints
const PRODUCTS_BASE  = `${BACKEND_URL}/products`;
const REVIEWS_BASE   = `${BACKEND_URL}/reviews`;
const PROFILE_BASE   = `${BACKEND_URL}/profile`;

export const API = {
  // ── Static JSON or Backend Endpoints ──────────────────────────────────
  ORDERS:     "/data/orders.json",
  SELLERS:    "/data/sellers.json",
  BRANDS:     "/data/brands.json",
  STATISTICS: BACKEND_URL ? `${BACKEND_URL}/statistics` : "/data/statistics.json",
  STORES:     "/data/stores.json",

  // ── Endpoints for Dynamic Graphs/Charts ───────────────────────────────
  REVENUE_TREND:     BACKEND_URL ? `${BACKEND_URL}/charts/revenue`  : "/data/statistics.json",
  SALES_BY_CATEGORY: BACKEND_URL ? `${BACKEND_URL}/charts/category` : "/data/statistics.json",
  KPI_SUMMARY:       BACKEND_URL ? `${BACKEND_URL}/charts/kpi`      : "/data/statistics.json",

  // ── json-server endpoints ─────────────────────────────────────────────
  PRODUCTS: `${PRODUCTS_BASE}`,
  REVIEWS:  `${REVIEWS_BASE}`,
  PROFILE:  `${PROFILE_BASE}`,
};

// Default headers for REST endpoints
export const API_HEADERS = {
  "Content-Type": "application/json",
  // "Authorization": `Bearer ${your_token_here}`,
};
