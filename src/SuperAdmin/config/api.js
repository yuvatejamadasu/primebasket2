/**
 * API Configuration
 *
 * All data is served from /public/data/ (static JSON files).
 * These files are bundled with the Vercel deployment and available at runtime.
 */

export const API = {
  // ── Static JSON in /public/data/ ──────────────────────────────────────
  ORDERS:            "/data/orders.json",
  SELLERS:           "/data/sellers.json",
  BRANDS:            "/data/brands.json",
  STATISTICS:        "/data/statistics.json",
  STORES:            "/data/stores.json",
  PRODUCTS:          "/data/products.json",
  REVIEWS:           "/data/reviews.json",
  PROFILE:           "/data/profile.json",

  // ── Chart endpoints (all from statistics.json) ────────────────────────
  REVENUE_TREND:     "/data/statistics.json",
  SALES_BY_CATEGORY: "/data/statistics.json",
  KPI_SUMMARY:       "/data/statistics.json",
};

// Default headers for REST endpoints
export const API_HEADERS = {
  "Content-Type": "application/json",
};
