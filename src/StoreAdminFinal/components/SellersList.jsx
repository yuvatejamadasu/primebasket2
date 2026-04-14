import React, { useMemo, useState } from 'react';
import SellerRow from './SellerRow';
import Pagination from './Pagination';
import sellersData from '../data/sellersData';
import '../styles/SellersPage.css';

const SellersList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSellers = useMemo(() => {
    return sellersData.filter((seller) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        seller.name.toLowerCase().includes(query) ||
        seller.email.toLowerCase().includes(query) ||
        seller.sellerId.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all' || seller.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredSellers.length / pageSize));
  const pageItems = filteredSellers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="sellers-page">
      <div className="content-header">
        <div>
          <h2>Sellers list</h2>
          <p>Manage sellers in the dashboard theme.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary">
            <span className="material-icons" style={{ fontSize: 18 }}>add</span>
            Create new
          </button>
          <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); setStatusFilter('all'); setCurrentPage(1); }}>
            Reset filters
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body sellers-filter-row">
          <input
            type="text"
            placeholder="Search by name, email or seller id"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
            className="form-control"
          />
          <select
            value={statusFilter}
            onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}
            className="form-select"
          >
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="card mb-4">
        <div className="table-wrap">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((seller) => (
                <SellerRow key={seller.id} seller={seller} />
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                    No sellers match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default SellersList;
