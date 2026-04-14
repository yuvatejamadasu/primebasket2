import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  X,
  ShoppingBag,
  CheckCircle2,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { productsData } from '../data/mockData';
import AddButton from '../components/OrderFromHub/AddButton';
import QuantitySelector from '../components/OrderFromHub/QuantitySelector';
import CartPanel from '../components/OrderFromHub/CartPanel';
import '../styles/OrderFromHub.css';

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
    <div className="relative hub-datepicker" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="hub-datepicker-trigger"
      >
        <span className="hub-date-text">{selectedDate}</span>
        <Calendar size={14} className="icon" />
      </div>

      {isOpen && (
        <div className="hub-datepicker-dropdown">
          <div className="hub-calendar-header">
            <span className="month-year">March, 2026</span>
            <div className="nav-icons"><ArrowUp size={16} /><ArrowDown size={16} /></div>
          </div>
          <div className="hub-calendar-grid">
            {days.map(d => <div key={d} className="day-name">{d}</div>)}
            {calendarDays.map(d => (
              <div
                key={d}
                onClick={() => { setSelectedDate(`${d} March, 2026`); setIsOpen(false); }}
                className={`day-cell ${d === 18 ? 'selected' : ''}`}
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

// ─── Product Detail Modal ─────────────────────────────────────────────────────
const ProductDetailModal = ({ product, onClose, isDark }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="hub-modal-overlay">
      <div className="hub-modal-backdrop" onClick={onClose} />
      <div className="hub-modal-card">
        {/* Header */}
        <div className="hub-modal-header">
          <h3 className="hub-modal-title">
            <ShoppingBag size={18} /> Product Details
          </h3>
          <button onClick={onClose} className="hub-modal-close">
            <X size={20} />
          </button>
        </div>

        {/* Product Info Banner */}
        <div className="hub-modal-banner">
          <div className="product-thumb">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product'; opacity: 0.5 }}
            />
          </div>
          <div>
            <p className="product-name">{product.name}</p>
          </div>
        </div>

        {/* Body */}
        <div className="hub-modal-body">
          {[
            ['Product ID', `#HUB-${String(product.id).padStart(4, '0')}`],
            ['Available Stock', product.quantity || 120],
            ['Restock Date', product.date || '07 April 2026'],
          ].map(([label, value]) => (
            <div key={label} className="detail-row">
              <span className="detail-label">{label}</span>
              <span className={`detail-value ${label === 'Product ID' ? 'badge-id' : ''}`}>
                {value}
              </span>
            </div>
          ))}

          <div className="detail-row status-row">
            <span className="detail-label">Category</span>
            <span className="badge badge-success">
              {product.category || 'General'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="hub-modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};

const CATEGORIES = [
  'Vegetables',
  'Groceries',
  'Beverages',
  'Snacks',
  'Dairy',
  'Bakery',
  'Spices',
  'Frozen Foods',
];

const getCategory = (productName) => {
  const name = (productName || '').toLowerCase();
  if (name.includes('water') || name.includes('tea') || name.includes('coffee') || name.includes('juice') || name.includes('can') || name.includes('drink')) return 'Beverages';
  if (name.includes('crumble') || name.includes('sweet') || name.includes('pop') || name.includes('chip') || name.includes('crunch') || name.includes('gelato') || name.includes('fruit')) return 'Snacks';
  if (name.includes('muffin') || name.includes('bread') || name.includes('cake') || name.includes('granola')) return 'Bakery';
  if (name.includes('coconut') || name.includes('flake') || name.includes('pesto') || name.includes('italian')) return 'Groceries';
  if (name.includes('honey') || name.includes('jam') || name.includes('berry') || name.includes('rose')) return 'Dairy';
  if (name.includes('herb') || name.includes('blend') || name.includes('mix') || name.includes('powder') || name.includes('pouch') || name.includes('spice')) return 'Spices';
  // Cycle remaining through categories
  return CATEGORIES[Math.abs(name.length) % CATEGORIES.length];
};

const getNetWtOptions = (productName) => {
  const name = (productName || '').toLowerCase();
  if (name.includes('water') || name.includes('can') || name.includes('tea') || name.includes('drink') || name.includes('coffee') || name.includes('beverage')) {
    return ['250 ml', '500 ml', '1 lt', '2 lt'];
  }
  if (name.includes('powder') || name.includes('pouch') || name.includes('mix') || name.includes('blend')) {
    return ['1 pack', '2 packs', '5 packs', '1 unit'];
  }
  return ['200 gms', '400 gms', '500 gms', '1 kg', '2 kg', '5 kg'];
};

// ─── Order From Hub Page ────────────────────────────────────────────────────────────
const OrderFromHub = () => {
  const { isDark } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  
  // Cart & UI State
  const [cart, setCart] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [itemNetWt, setItemNetWt] = useState({});
  const [justAdded, setJustAdded] = useState(new Set());
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const hubs = ['Central Hub', 'Regional Hub North', 'Regional Hub West', 'Metro Depot'];
    const enrichedProducts = productsData.slice(0, 20).map((p, index) => ({
      ...p,
      storeName: hubs[index % hubs.length],
      category: getCategory(p.name),
      date: `${(index % 28) + 1} March, 2026`,
      quantity: Math.floor(Math.random() * 500) + 50
    }));
    
    setProducts(enrichedProducts);
    
    // Initialize default quantities and net weights
    const initialQtys = {};
    const initialNetWts = {};
    enrichedProducts.forEach(p => { 
      initialQtys[p.id] = 1; 
      initialNetWts[p.id] = getNetWtOptions(p.name)[0];
    });
    setItemQuantities(initialQtys);
    setItemNetWt(initialNetWts);
  }, []);

  const handleAddToCart = (product) => {
    const selectedQty = itemQuantities[product.id] || 1;
    const selectedNetWt = itemNetWt[product.id] || getNetWtOptions(product.name)[0];
    const cartId = `${product.id}-${selectedNetWt}`;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartId === cartId);
      if (existingItem) {
        return prevCart.map(item => 
          item.cartId === cartId 
            ? { ...item, quantity: item.quantity + selectedQty }
            : item
        );
      }
      return [...prevCart, { 
        id: product.id, 
        cartId: cartId,
        name: product.name,
        netWt: selectedNetWt,
        quantity: selectedQty 
      }];
    });

    // Feedback logic
    setJustAdded(prev => new Set(prev).add(product.id));
    setHighlightedRow(product.id);
    setToast(`${product.name} added to cart!`);

    setTimeout(() => {
      setJustAdded(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);

    setTimeout(() => setHighlightedRow(null), 1000);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateItemQuantity = (productId, qty) => {
    setItemQuantities(prev => ({ ...prev, [productId]: parseInt(qty, 10) }));
  };

  const totalAddedItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="order-hub-page-container">
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isDark={isDark}
        />
      )}

      {/* Page Header */}
      <div className="content-header">
        <div>
          <h2>Order From Hub</h2>
          <p>Browse central inventory and request restocks for your store.</p>
        </div>
        <div className="header-actions">
          <div className="cart-counter-badge">
            <ShoppingCart size={16} />
            <span>Items Added: <strong>{totalAddedItems}</strong></span>
          </div>
          <button className="btn btn-outline">
            <Download size={14} /> Export List
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card filter-card">
        <div className="card-body">
          <div className="hub-toolbar">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search hub inventory…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="filters-right">
              <select className="form-select">
                <option>All hubs</option>
                <option>Central Hub</option>
                <option>Regional Hub North</option>
                <option>Regional Hub West</option>
              </select>
              <DatePicker isDark={isDark} />
              <select 
                className="form-select status-select" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table & Cart Layout */}
      <div className="row col-8-4 hub-main-layout">
        <div className="hub-table-section">
          <div className="card table-card overflow-hidden">
            <div className="table-wrap">
              <table className="hub-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input type="checkbox" className="custom-checkbox" />
                    </th>
                    <th>Product</th>
                    <th>Net Wt</th>
                    <th>Quantity</th>
                    <th className="text-right">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`hub-table-row ${highlightedRow === p.id ? 'row-glow' : ''}`}
                    >
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="custom-checkbox" />
                      </td>
                      <td>
                        <div className="product-info-cell">
                          <div className="product-img-wrap">
                            <img
                              src={p.image}
                              alt={p.name}
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product'; opacity: 0.5 }}
                            />
                          </div>
                          <span className="product-name-text">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="net-wt-cell" onClick={(e) => e.stopPropagation()}>
                        <select 
                          className="form-select" 
                          value={itemNetWt[p.id] || ''} 
                          onChange={(e) => setItemNetWt(prev => ({...prev, [p.id]: e.target.value}))}
                          style={{ minWidth: '100px' }}
                        >
                          {getNetWtOptions(p.name).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <QuantitySelector
                          value={itemQuantities[p.id] || 1}
                          onChange={(qty) => updateItemQuantity(p.id, qty)}
                          disabled={justAdded.has(p.id)}
                        />
                      </td>
                      <td className="text-right">
                        <div className="action-cell" onClick={(e) => e.stopPropagation()}>
                          <AddButton
                            onClick={() => handleAddToCart(p)}
                            isAdded={justAdded.has(p.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No products found in hub inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Cart */}
        <CartPanel
          items={cart}
          onRemove={handleRemoveFromCart}
          onProceed={() => { setCart([]); setToast('Order Placed Successfully!'); setTimeout(() => setToast(null), 3000); }}
          totalItems={totalAddedItems}
        />
      </div>


      {/* Toast Notification */}
      {toast && (
        <div className="hub-toast-container">
          <div className="hub-toast">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFromHub;
