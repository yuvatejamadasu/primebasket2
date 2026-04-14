import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, Calendar, Download, EyeOff, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsData } from '../data/mockData';
import '../styles/ProductsTable.css';

/* ── Product data with store names, categories, prices, status, dates ── */
const STORE_NAMES = [
  'GreenLeaf Mart', 'FreshBite Store', 'DailyNeeds Hub', 'QuickCart Plus',
  'OrganicBasket Co', 'SmartGrocer', 'UrbanPantry', 'PrimePick Store',
];

const PRODUCT_NAMES = [
  'Seeds of Change Organic Quinoa',
  'All Natural Italian-Style Chicken',
  'Gortons Beer Battered Fish Fillets',
  'Foster Farms Crispy Buffalo',
  'Blue Diamond Almonds Salted',
  'Chobani Vanilla Greek Yogurt',
  'Canada Dry Ginger Ale 2L',
  'Haagen-Dazs Caramel Cone Ice',
  'Lays Chips Classic',
  'Amul Ice Cream Tub',
  'Tropicana Orange Juice 1L',
  'Nestle KitKat Chocolate Bar',
  'Maggi 2-Minute Noodles Pack',
  'Britannia Good Day Cookies',
  'Cadbury Dairy Milk Silk',
  'Parle-G Gold Biscuits',
  'Haldiram Aloo Bhujia',
  'Tata Salt Iodized 1kg',
  'Fortune Sunflower Oil 1L',
  'Amul Butter 500g',
];

const CATEGORIES_LIST = [
  'Groceries', 'Snacks', 'Beverages', 'Dairy',
  'Frozen Foods', 'Bakery', 'Spices', 'Vegetables',
];

const PRICES = [
  34.50, 196.99, 76.99, 18.00, 76.99, 18.00, 76.99,
  100.99, 76.00, 120.00, 55.00, 45.00, 12.00, 35.00,
  90.00, 22.00, 65.00, 25.00, 150.00, 250.00,
];

const STOCK_QUANTITIES = [
  145, 89, 0, 320, 5, 0, 12, 3, 0, 200,
  8, 0, 450, 2, 0, 67, 4, 0, 34, 6,
];

const getStatus = (stock) => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 10) return 'Low Quantity';
  return 'Active';
};

const enrichedProducts = productsData.slice(0, 20).map((p, i) => {
  const stock = STOCK_QUANTITIES[i % STOCK_QUANTITIES.length];
  return {
    ...p,
    name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
    storeName: STORE_NAMES[i % STORE_NAMES.length],
    category: CATEGORIES_LIST[i % CATEGORIES_LIST.length],
    price: PRICES[i % PRICES.length],
    stock,
    status: getStatus(stock),
    date: '02.11.2021',
  };
});

const ALL_CATEGORIES = ['All', ...new Set(enrichedProducts.map(p => p.category))];

export default function ProductsGrid() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showInvisible, setShowInvisible] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(2); // March = 2 (0-indexed)
  const [calYear, setCalYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 18));
  const calRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) setCalOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    return enrichedProducts.filter((product) => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase()) &&
          !product.storeName.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'All' && product.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && product.status !== statusFilter) return false;
      if (showInvisible && product.status === 'Active') return false;
      return true;
    });
  }, [search, categoryFilter, statusFilter, showInvisible]);

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setSelectedProducts(next ? filteredProducts.map(p => p.id) : []);
  };

  const toggleSelect = (id) => {
    setSelectedProducts(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  };

  return (
    <div className="products-table-page">
      <div className="content-header">
        <div>
          <h2>Products</h2>
          <p>Manage store inventory. Click any row to view full product details.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Download size={16} /> Export
          </button>
          <button
            className={`btn ${showInvisible ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowInvisible(!showInvisible)}
          >
            {showInvisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {showInvisible ? 'Show All' : 'Invisible'}
          </button>
        </div>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="ptp-filter-bar">
        <div className="ptp-search-box">
          <Search size={18} className="ptp-search-icon" />
          <input
            type="text"
            placeholder="Search products or stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ptp-filter-group">
          <select
            className="ptp-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {ALL_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All category' : cat}
              </option>
            ))}
          </select>

          <div className="ptp-date-picker" ref={calRef}>
            <div className="ptp-date-btn" onClick={() => setCalOpen(!calOpen)}>
              <span>{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <Calendar size={15} />
            </div>
            {calOpen && (
              <div className="ptp-cal-dropdown">
                <div className="ptp-cal-header">
                  <button type="button" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span className="ptp-cal-title">
                    {new Date(calYear, calMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="ptp-cal-days-header">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="ptp-cal-grid">
                  {(() => {
                    const firstDay = new Date(calYear, calMonth, 1).getDay();
                    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                    const cells = [];
                    for (let i = 0; i < firstDay; i++) cells.push(<span key={`e${i}`} className="ptp-cal-empty" />);
                    for (let d = 1; d <= daysInMonth; d++) {
                      const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === calMonth && selectedDate.getFullYear() === calYear;
                      cells.push(
                        <button
                          key={d}
                          type="button"
                          className={`ptp-cal-day ${isSelected ? 'selected' : ''}`}
                          onClick={() => { setSelectedDate(new Date(calYear, calMonth, d)); setCalOpen(false); }}
                        >
                          {d}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>
              </div>
            )}
          </div>

          <select
            className="ptp-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Active">Active</option>
            <option value="Low Quantity">Low Quantity</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* ── Products Table ── */}
      <div className="card products-table-card">
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>PRODUCT</th>
                <th>STORE NAME</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th className="col-details">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={selectedProducts.includes(product.id) ? 'row-selected' : ''}
                >
                  <td className="col-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb-img">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/44?text=P';
                          }}
                        />
                      </div>
                      <span className="product-name-text">{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="store-link">{product.storeName}</span>
                  </td>
                  <td>
                    <span className="price-text">${product.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="stock-text">{product.stock}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${product.status === 'Active' ? 'status-active' : product.status === 'Low Quantity' ? 'status-low' : 'status-oos'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">{product.date}</span>
                  </td>
                  <td className="col-details">
                    <button className="btn-details">DETAILS</button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-state">
                    No products found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
