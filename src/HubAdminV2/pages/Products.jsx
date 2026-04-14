import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Download,
  Upload,
  Calendar,
  ArrowUp,
  ArrowDown,
  X,
  ShoppingBag,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API } from '../config/api';

// ─── Store names no longer needed as data comes from JSON ────────────────────

// ─── Custom Date Picker ──────────────────────────────────────────────────────
const DatePicker = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('18 March, 2026');
  const dropdownRef = useRef(null);
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const calendarDays = [...Array(31)].map((_, i) => i + 1);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer border ${
          isDark ? 'bg-[#212529] border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-100 shadow-sm'
        }`}
      >
        <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedDate}</span>
        <Calendar size={14} className="opacity-60" />
      </div>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-[280px] rounded-xl shadow-2xl z-50 overflow-hidden border p-4 animate-scale-in ${
          isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>March, 2026</span>
            <div className="flex gap-4"><ArrowUp size={16} className="opacity-40" /><ArrowDown size={16} className="opacity-40" /></div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map(d => <div key={d} className="text-[10px] font-bold opacity-40">{d}</div>)}
            {calendarDays.map(d => (
              <div
                key={d}
                onClick={() => { setSelectedDate(`${d} March, 2026`); setIsOpen(false); }}
                className={`py-2 text-xs font-bold rounded-lg cursor-pointer ${d === 18 ? 'bg-brand text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Product Detail Modal (Transaction-style) ─────────────────────────────────
const ProductDetailModal = ({ product, onClose, isDark }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Card */}
      <div className={`relative rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in flex flex-col border transition-all ${
        isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'
      }`}>

        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between transition-all ${
          isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-100'
        }`}>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-brand'}`}>
            <ShoppingBag size={18} /> Product Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product image + name banner */}
        <div className={`px-6 py-5 flex items-center gap-4 border-b transition-all ${
          isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50/60 border-slate-100'
        }`}>
          <div className={`w-16 h-16 rounded-xl border shadow-sm flex items-center justify-center p-2 shrink-0 transition-all ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          }`}>
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-contain ${isDark ? '' : 'mix-blend-multiply'}`}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product'; }}
            />
          </div>
          <div>
            <p className={`text-sm font-black leading-snug ${isDark ? 'text-white' : 'text-slate-800'}`}>{product.name}</p>
            <p className={`text-xs font-bold mt-1 ${isDark ? 'text-brand-lightdark' : 'text-brand'}`}>{product.netWeight || "N/A"}</p>
          </div>
        </div>

        {/* Body */}
        <div className={`p-6 space-y-4 transition-all ${isDark ? 'bg-[#2c3136]' : 'bg-slate-50/30'}`}>
          {[
            ['Product ID', `#PRD-${String(product.id).padStart(4, '0')}`],
            ['Net Weight', product.netWeight || "N/A"],
            ['Price', `$${product.price.toFixed(2)}`],
            ['Quantity', product.quantity],
            ['Date Listed', product.date],
          ].map(([label, value]) => (
            <div key={label} className={`flex justify-between items-center pb-4 border-b transition-all ${
              isDark ? 'border-slate-700/50' : 'border-slate-200/60'
            }`}>
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
              <span className={`text-sm font-bold ${
                label === 'Product ID' 
                  ? (isDark ? 'text-brand-lightdark bg-brand/10 px-3 py-1 rounded-md' : 'text-brand bg-brand-light px-3 py-1 rounded-md')
                  : (isDark ? 'text-slate-200' : 'text-slate-800')
              }`}>
                {value}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-1">
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</span>
            <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase shadow-sm border ${
              product.status === 'Active' 
                ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-emerald-100 text-emerald-600') 
                : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500')
            }`}>
              {product.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t transition-all flex justify-end ${
          isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-100'
        }`}>
          <button
            onClick={onClose}
            className="bg-brand hover:bg-brand-hover text-white text-[11px] uppercase font-bold tracking-wider px-6 py-2.5 rounded-lg transition-all active:scale-95 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Products Page ────────────────────────────────────────────────────────────
const Products = () => {
  const { isDark } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const { data } = await axios.get(API.PRODUCTS);
        
        if (data === null || data === undefined) {
          throw new Error('firebase_null');
        }

        let list;
        if (Array.isArray(data)) list = data;
        else if (data.Products) list = data.Products;
        else list = Object.entries(data).map(([id, val]) => ({ id, ...val }));

        setProducts(list);
        setLoading(false);
      } catch (err) {
        // Firebase failed OR returned null → fall back to local JSON
        try {
          const { data } = await axios.get('/data/products.json');
          const list = Array.isArray(data) ? data : (data?.Products ?? []);
          setProducts(list);
          setLoading(false);
        } catch (fallbackErr) {
          setFetchError(fallbackErr.message);
          setLoading(false);
        }
      }
    };

    getProducts();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('All category');
  const [selectedStatus, setSelectedStatus] = useState('Status');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All category' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Status' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExport = () => {
    if (filteredProducts.length === 0) return;

    // Define CSV headers
    const headers = ["Product Name", "Net Weight", "Quantity", "Price", "Status", "Date"];
    
    // Format rows
    const rows = filteredProducts.map(p => [
      `"${p.name?.replace(/"/g, '""')}"`,
      `"${(p.netWeight || "N/A").replace(/"/g, '""')}"`,
      p.quantity || 0,
      p.price.toFixed(2),
      p.status,
      p.date
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand/20 border-t-[var(--primary-color)] rounded-full animate-spin" />
          <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading products…</p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className={`flex flex-col items-center gap-3 p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Failed to load products</p>
          <p className="text-xs text-slate-400 text-center max-w-xs">{fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isDark={isDark}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Products</h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-semibold mt-1`}>
            Manage store inventory. Click any row to view full product details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExport}
            className={`flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 active:scale-95 ${
            isDark ? 'border-slate-700 text-slate-300 hover:bg-brand hover:text-white hover:border-brand' : 'border-slate-200 text-slate-600 bg-white hover:bg-brand hover:text-white hover:border-brand shadow-sm'
          }`}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`p-4 rounded-xl border transition-all duration-500 hover:shadow-lg ${
        isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search products or stores…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold outline-none transition-all ${
                isDark ? 'bg-[#212529] border-slate-600 text-slate-200 focus:border-brand' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-brand shadow-inner'
              }`}
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="md:col-span-8 flex flex-wrap md:flex-nowrap items-center gap-3 justify-end">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`border rounded-lg px-4 py-2 text-xs font-bold outline-none transition-all min-w-[140px] ${
              isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <option>All category</option>
              {[...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <DatePicker isDark={isDark} />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`border rounded-lg px-4 py-2 text-xs font-bold outline-none transition-all min-w-[120px] ${
              isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <option>Status</option>
              <option>Active</option>
              <option>Hidden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={`rounded-xl border transition-all duration-500 hover:shadow-lg overflow-hidden ${
        isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isDark ? 'bg-slate-800/30' : 'bg-slate-50/50 text-slate-500'}>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider w-12 text-center">
                  <input type="checkbox" className="rounded-sm accent-brand" />
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider">Net Weight</th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-right pr-8">Details</th>
              </tr>
            </thead>
            <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`group/row transition-all duration-200 cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/80' : 'hover:bg-brand-light/40'
                  }`}
                >
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded-sm accent-brand" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl p-1.5 flex items-center justify-center transition-transform group-hover/row:scale-110 border ${
                        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'
                      }`}>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product'; }}
                        />
                      </div>
                      <span className={`text-xs font-bold leading-tight max-w-[200px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-xs font-bold ${isDark ? 'text-white' : 'text-brand'}`}>
                    {p.netWeight || "N/A"}
                  </td>
                  <td className={`px-6 py-4 text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {p.quantity || 0}
                  </td>
                  <td className={`px-6 py-4 text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter transition-all ${
                      p.status === 'Active' 
                        ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-600') 
                        : (isDark ? 'bg-slate-700/50 text-slate-400 border border-slate-600' : 'bg-slate-100 text-slate-500')
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-[11px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {p.date}
                  </td>
                  <td className="px-6 py-4 text-right pr-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                      className="bg-brand hover:bg-brand-hover text-white text-[11px] uppercase font-bold tracking-wider px-5 py-2 rounded-lg transition-all active:scale-95 shadow-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No products found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
