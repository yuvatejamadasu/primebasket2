import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, DollarSign, Smartphone, CreditCard, X } from 'lucide-react';
import transactionsData from '../data/transactions.json';
import '../styles/Transactions.css';

const getMethodIcon = (method) => {
  switch (method) {
    case 'PayPal': return <DollarSign size={14} className="transaction-method-icon" />;
    case 'UPI': return <Smartphone size={14} className="transaction-method-icon" />;
    case 'Visa': return <CreditCard size={14} className="transaction-method-icon" />;
    default: return null;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'status-badge status-pending';
    case 'Failed':
      return 'status-badge status-failed';
    case 'Paid':
      return 'status-badge status-paid';
    default:
      return 'status-badge status-default';
  }
};

const TransactionModal = ({ data, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Transaction Details</h3>
          <button onClick={onClose} className="modal-close-button">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <span className="modal-label">Transaction ID</span>
            <span className="modal-value">{data.id}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Customer Name</span>
            <span className="modal-value">{data.customer}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Date & Time</span>
            <span className="modal-value secondary">{data.date} · {data.time}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Payment Method</span>
            <span className="modal-value">{data.method}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Amount</span>
            <span className="modal-value">{data.amount}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Status</span>
            <span className={getStatusClass(data.status)}>{data.status}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [selectedMethod, setSelectedMethod] = useState('All Methods');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const dropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  useEffect(() => {
    setTransactions(transactionsData);
    setLoading(false);
  }, []);

  const methods = ['All Methods', 'PayPal', 'UPI', 'Visa'];
  const statuses = ['Status', 'Paid', 'Pending', 'Failed'];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesMethod = selectedMethod === 'All Methods' || transaction.method === selectedMethod;
    const matchesStatus = statusFilter === 'Status' || transaction.status === statusFilter;
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMethod && matchesStatus && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMethod, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
      </div>

      <div className="transactions-card">
        <div className="transactions-controls">
          <div className="transactions-search-wrapper">
            <Search size={18} className="transactions-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="transactions-search-input"
            />
          </div>

          <div className="action-group">
            <div className="dropdown-wrapper" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="dropdown-button"
              >
                {statusFilter}
                <ChevronDown size={16} />
              </button>

              {isStatusDropdownOpen && (
                <div className="dropdown-menu">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`dropdown-option ${statusFilter === status ? 'active' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-button"
              >
                {selectedMethod}
                <ChevronDown size={16} />
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {methods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method);
                        setIsDropdownOpen(false);
                      }}
                      className={`dropdown-option ${selectedMethod === method ? 'active' : ''}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer Name</th>
                <th>Date & Time</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((tx, idx) => (
                  <tr key={idx} className="transactions-row">
                    <td className="transaction-id">{tx.id}</td>
                    <td>
                      <div className="transaction-customer">
                        <div className="customer-avatar">{tx.customer.charAt(0)}</div>
                        <span className="customer-name">{tx.customer}</span>
                      </div>
                    </td>
                    <td>
                      <div className="transaction-meta">
                        <span className="transaction-date">{tx.date}</span>
                        <span className="transaction-time">{tx.time}</span>
                      </div>
                    </td>
                    <td>
                      <div className="transaction-method">
                        {getMethodIcon(tx.method)}
                        <span>{tx.method}</span>
                      </div>
                    </td>
                    <td>
                      <span className="transaction-amount">{tx.amount}</span>
                    </td>
                    <td>
                      <span className={getStatusClass(tx.status)}>{tx.status}</span>
                    </td>
                    <td>
                      <button type="button" className="details-button" onClick={() => openTransactionDetails(tx)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    {loading ? 'Loading transactions...' : error ? `Error: ${error}` : 'No transactions found displaying your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length > 0 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredTransactions.length)} of {filteredTransactions.length} entries
            </span>
            <div className="pagination-list">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setCurrentPage(number)}
                  className={`pagination-button page-number ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="pagination-button"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TransactionModal data={selectedTransaction} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Transactions;
