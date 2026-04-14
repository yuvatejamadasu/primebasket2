import React, { useMemo, useState } from 'react';
import { productList, productCategories } from '../data/productPagesData';
import { 
  Search, Download, Upload, Filter, Calendar, ChevronDown, 
  MoreVertical, FileText, Trash2, Edit 
} from 'lucide-react';

export default function ProductList() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'All' && product.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && product.status !== statusFilter) return false;
      return true;
    });
  }, [search, categoryFilter, statusFilter]);

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setSelectedProducts(next ? filteredProducts.map((product) => product.id) : []);
  };

  const toggleSelect = (id) => {
    setSelectedProducts((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="products-page">
      <div className="content-header">
        <div>
          <h2>Products</h2>
          <p>Manage store inventory. Click any row to view full product details.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Download size={18} strokeWidth={1.5} />
            EXPORT
          </button>
          <button className="btn btn-outline">
            <Upload size={18} strokeWidth={1.5} />
            IMPORT
          </button>
        </div>
      </div>

      <div className="card filter-card">
        <div className="card-body">
          <div className="filter-row">
            <div className="search-input-wrap main-search">
              <Search size={20} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search products or stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {productCategories.map((option) => (
                <option key={option} value={option}>{option === 'All' ? 'All category' : option}</option>
              ))}
            </select>

            <div className="cal-trigger-btn">
              <span>18 March, 2026</span>
              <Calendar size={18} color="#94a3b8" />
            </div>

            <select className="form-select status-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">Status</option>
              <option value="Active">Active</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ borderRadius: 20, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 44, textAlign: 'center' }}>
                  <input type="checkbox" className="form-check-input" checked={selectAll} onChange={toggleSelectAll} />
                </th>
                <th>PRODUCT</th>
                <th>STORE NAME</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th style={{ textAlign: 'right', paddingRight: 24 }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb" style={{ backgroundImage: `url(https://via.placeholder.com/44?text=${product.name.charAt(0)})` }} />
                      <span className="product-name-text">{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="store-name-text">{product.storeName || 'FreshBite Store'}</span>
                  </td>
                  <td>
                    <span className="price-text">{product.price}</span>
                  </td>
                  <td>
                    <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">02.11.2021</span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: 24 }}>
                    <button className="btn-details">DETAILS</button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                    No products found
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

