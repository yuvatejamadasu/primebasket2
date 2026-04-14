import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  ShoppingCart,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Plus,
  X,
  Box,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API } from '../config/api';

// ─── Custom Date Picker (identical to Products.jsx) ──────────────────────────
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

// ─── Order To Hub Page ────────────────────────────────────────────────────────
const OrderToHub = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Category-based Net Weight options ────────────────────────────────────
  const CATEGORY_WEIGHTS = {
    'Grains & Seeds':     ['200 gms', '500 gms', '1 kg', '2 kg', '5 kg'],
    'Meat & Poultry':     ['250 gms', '500 gms', '1 kg', '2 kg'],
    'Seafood':            ['250 gms', '500 gms', '1 kg'],
    'Nuts & Dry Fruits':  ['100 gms', '200 gms', '500 gms', '1 kg'],
    'Dairy':              ['100 gms', '200 gms', '500 gms', '1 kg'],
    'Beverages':          ['250 ml', '500 ml', '1 L', '2 L'],
    'Frozen Desserts':    ['100 ml', '250 ml', '500 ml', '1 L'],
    'Snacks':             ['25 gms', '50 gms', '100 gms', '200 gms'],
    'General':            ['1 pack', '200 gms', '500 gms', '1 kg'],
  };

  const detectCategory = (name) => {
    const n = (name || '').toLowerCase();
    if (/quinoa|rice|oats|wheat|seeds|grain|cereal|millet/.test(n))       return 'Grains & Seeds';
    if (/chicken|turkey|buffalo|mutton|lamb|pork|meat|poultry/.test(n))   return 'Meat & Poultry';
    if (/fish|shrimp|prawn|crab|seafood|salmon|tuna|fillet/.test(n))      return 'Seafood';
    if (/almond|cashew|walnut|pistachio|peanut|nut|raisin|dry fruit/.test(n)) return 'Nuts & Dry Fruits';
    if (/yogurt|yoghurt|cheese|butter|milk|paneer|curd|dairy/.test(n))   return 'Dairy';
    if (/ale|cola|soda|juice|water|drink|beverage|tea|coffee/.test(n))    return 'Beverages';
    if (/ice cream|gelato|sorbet|frozen|kulfi|popsicle/.test(n))          return 'Frozen Desserts';
    if (/chips|nachos|popcorn|snack|crisp|cracker|cookie|biscuit|lays/.test(n)) return 'Snacks';
    return 'General';
  };

  const getWeightOptions = (name) => {
    const category = detectCategory(name);
    return CATEGORY_WEIGHTS[category];
  };

  // ── Selected weights state (per-product) ────────────────────────────────
  const [selectedWeights, setSelectedWeights] = useState({});

  const getSelectedWeight = (product) => {
    if (selectedWeights[product.id]) return selectedWeights[product.id];
    const options = getWeightOptions(product.name);
    return options[0];
  };

  const setSelectedWeight = (id, weight) => {
    setSelectedWeights(prev => ({ ...prev, [id]: weight }));
  };

  // ── Fetch products (same pattern as Products.jsx) ───────────────────────
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

  const handleExport = () => {
    const headers = ['Product ID', 'Name', 'Category', 'Net Weight Options'];
    const csvRows = products.map(p => [
      `PRD-${String(p.id).padStart(4, '0')}`,
      p.name,
      detectCategory(p.name),
      getWeightOptions(p.name).join(' | ')
    ].map(v => `"${v}"`).join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hub_inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || detectCategory(p.name) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ── Add to cart ─────────────────────────────────────────────────────────
  const addToCart = (product) => {
    const weight = getSelectedWeight(product);
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.weight === weight);
      if (existing) return prev; // already in summary, user can adjust qty there
      return [...prev, { id: product.id, name: product.name, image: product.image, weight, quantity: 0, category: detectCategory(product.name) }];
    });
  };

  // ── Update quantity in cart ─────────────────────────────────────────────
  const updateCartQuantity = (idx, val) => {
    const num = parseInt(val);
    setCartItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, quantity: isNaN(num) ? '' : Math.max(0, num) } : item
    ));
  };

  // ── Remove from cart ────────────────────────────────────────────────────
  const removeFromCart = (idx) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Proceed to order (clears cart) ──────────────────────────────────────
  const handleProceedToOrder = () => {
    if (cartItems.length === 0) return;
    setCartItems([]);
    alert("Order details is send to hub dashboard");
  };

  const totalItemsAdded = cartItems.length;

  // ── Loading state (identical to Products.jsx) ───────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand/20 border-t-[var(--primary-color)] rounded-full animate-spin" />
          <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading inventory…</p>
        </div>
      </div>
    );
  }

  // ── Error state (identical to Products.jsx) ─────────────────────────────
  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className={`flex flex-col items-center gap-3 p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Failed to load inventory</p>
          <p className="text-xs text-slate-400 text-center max-w-xs">{fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      {/* ─── Page Header (identical structure to Products.jsx) ──────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Order To Hub</h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-semibold mt-1`}>
            Browse central inventory and request restocks for your store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 ${
            isDark ? 'border-slate-700 text-slate-300 bg-[#2c3136]' : 'border-slate-200 text-brand bg-white shadow-sm'
          }`}>
            <ShoppingCart size={14} />
            Items Added: {totalItemsAdded}
          </div>
          <button 
            onClick={() => handleExport()}
            className={`flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 active:scale-95 ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-brand hover:text-white hover:border-brand' : 'border-slate-200 text-slate-600 bg-white hover:bg-brand hover:text-white hover:border-brand shadow-sm'
            }`}
          >
            <Download size={14} /> Export List
          </button>
        </div>
      </div>

      {/* ─── Filter Bar (identical to Products.jsx) ────────────────────── */}
      <div className={`p-4 rounded-xl border transition-all duration-500 hover:shadow-lg ${
        isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search hub inventory…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold outline-none transition-all ${
                isDark ? 'bg-[#212529] border-slate-600 text-slate-200 focus:border-brand' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-brand shadow-inner'
              }`}
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="md:col-span-8 flex flex-wrap md:flex-nowrap items-center gap-3 justify-end">
            <select className={`border rounded-lg px-4 py-2 text-xs font-bold outline-none transition-all min-w-[140px] ${
              isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <option>All hubs</option>
              <option>North Hub</option>
              <option>South Hub</option>
            </select>
            <DatePicker isDark={isDark} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`border rounded-lg px-4 py-2 text-xs font-bold outline-none transition-all min-w-[160px] ${
              isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <option>All Categories</option>
              <option>Grains & Seeds</option>
              <option>Meat & Poultry</option>
              <option>Seafood</option>
              <option>Nuts & Dry Fruits</option>
              <option>Dairy</option>
              <option>Beverages</option>
              <option>Frozen Desserts</option>
              <option>Snacks</option>
              <option>General</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Main Content (Table + Order Summary) ──────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* ─── Product Table (exact Products.jsx table styling) ─────────── */}
        <div className={`xl:col-span-8 rounded-xl border transition-all duration-500 hover:shadow-lg overflow-hidden ${
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
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider">Net Wt</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-right pr-8">Order</th>
                </tr>
              </thead>
              <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={`group/row transition-all duration-200 ${
                      isDark ? 'hover:bg-slate-800/80' : 'hover:bg-brand-light/40'
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
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
                    <td className="px-6 py-4">
                      <select
                        value={getSelectedWeight(p)}
                        onChange={(e) => setSelectedWeight(p.id, e.target.value)}
                        className={`border rounded-lg px-3 py-1.5 text-xs font-bold outline-none transition-all min-w-[100px] ${
                          isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {getWeightOptions(p.name).map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-brand hover:bg-brand-hover text-white text-[11px] uppercase font-bold tracking-wider px-5 py-2 rounded-lg transition-all active:scale-95 shadow-sm inline-flex items-center gap-1.5"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <p className={`text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No products found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Order Summary Sidebar (Dashboard card style) ────────────── */}
        <div className="xl:col-span-4 sticky top-4">
          <div className={`rounded-xl border transition-all duration-300 hover:shadow-xl overflow-hidden ${
            isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* Summary Header */}
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${
              isDark ? 'border-slate-700/50' : 'border-slate-100'
            }`}>
              <ShoppingCart size={18} className="text-brand" />
              <h5 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Order Summary</h5>
            </div>

            {/* Cart Items or Empty State */}
            <div className="p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-brand-light'}`}>
                    <Box size={32} className="text-brand opacity-50" />
                  </div>
                  <h6 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No items added yet</h6>
                  <p className={`text-xs font-medium mt-2 max-w-[200px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Start adding products to create your restock order
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        isDark ? 'bg-slate-800/40 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {/* Product info row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg p-1 flex items-center justify-center border shrink-0 ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                          }`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=P'; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold leading-tight truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.name}</p>
                            <p className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.weight}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                            isDark ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                          }`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {/* Quantity row */}
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-dashed" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Qty</span>
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(idx, e.target.value)}
                          className={`w-16 border rounded-lg py-1 text-center text-xs font-bold outline-none transition-all ${
                            isDark ? 'bg-[#212529] border-slate-600 text-slate-200 focus:border-brand' : 'bg-white border-slate-200 text-slate-800 focus:border-brand'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Proceed Button */}
            <div className={`px-6 py-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <button
                onClick={handleProceedToOrder}
                disabled={cartItems.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  cartItems.length > 0
                    ? 'bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand-light active:scale-[0.98]'
                    : (isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed')
                }`}
              >
                Proceed to Order <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderToHub;
