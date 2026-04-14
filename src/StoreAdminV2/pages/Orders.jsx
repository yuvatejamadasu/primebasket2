import React, { useState, useRef, useEffect } from 'react';
import {
  Search, ChevronDown, Calendar, ChevronLeft, ChevronRight,
  MoreHorizontal, ArrowUp, ArrowDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import DataState from '../components/DataState';
import { API } from '../config/api';

// ─── Date Picker (identical to Products/OrderToHub) ────────────────────────
const DatePicker = ({ isDark, label = '18 March, 2026' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(label);
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
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer border ${
          isDark ? 'bg-[#212529] border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-100 shadow-sm'
        }`}
      >
        <Calendar size={14} className="opacity-60" />
        <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedDate}</span>
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
              <div key={d} onClick={() => { setSelectedDate(`${d} March, 2026`); setIsOpen(false); }}
                className={`py-2 text-xs font-bold rounded-lg cursor-pointer ${d === 18 ? 'bg-brand text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >{d}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Status Badge ────────────────────────────────────────────────────────────
const getStatusStyle = (status, isDark) => {
  switch (status) {
    case 'Delivered':
    case 'Received':
      return isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600';
    case 'Pending':
      return isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600';
    case 'Processing':
      return isDark ? 'bg-brand/10 text-brand-lightdark' : 'bg-blue-50 text-blue-600';
    case 'Cancelled':
      return isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600';
    default:
      return isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500';
  }
};

const mapStatus = (status) => {
  if (status === 'Delivered') return 'Received';
  return status;
};

const ORDERS_PER_PAGE = 10;

// ─── Orders Page ─────────────────────────────────────────────────────────────
const Orders = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // ── Data fetching ──────────────────────────────────────────────────────
  const { data: ordersData, loading, error } = useFetch(API.ORDERS, '/data/orders.json');
  const allOrders = Array.isArray(ordersData) ? ordersData : (ordersData?.orders ?? ordersData?.Orders ?? []);

  // ── Toolbar state ──────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [perPage, setPerPage] = useState(ORDERS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Sidebar filter state ───────────────────────────────────────────────
  const [filterOrderId, setFilterOrderId] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterTotal, setFilterTotal] = useState('');
  const [filterDateAdded, setFilterDateAdded] = useState('');
  const [filterDateModified, setFilterDateModified] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('All');
  const [appliedFilters, setAppliedFilters] = useState({});

  const statuses = ['Status', 'Received', 'Pending', 'Processing', 'Cancelled'];

  // ── Apply sidebar filters ──────────────────────────────────────────────
  const handleApplyFilter = () => {
    setAppliedFilters({
      orderId: filterOrderId.trim(),
      customer: filterCustomer.trim().toLowerCase(),
      total: filterTotal.trim(),
      dateAdded: filterDateAdded.trim().toLowerCase(),
      dateModified: filterDateModified.trim().toLowerCase(),
      orderStatus: filterOrderStatus,
    });
    setCurrentPage(1);
  };

  // ── Filtering logic ────────────────────────────────────────────────────
  const filtered = allOrders.filter(o => {
    const mapped = mapStatus(o.status);
    // Toolbar filters
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.storeName.toLowerCase().includes(search.toLowerCase());
    const matchToolbarStatus = statusFilter === 'Status' || mapped === statusFilter;

    // Sidebar filters
    const af = appliedFilters;
    const matchFilterId = !af.orderId || o.id.toLowerCase().includes(af.orderId.toLowerCase());
    const matchFilterCustomer = !af.customer || o.storeName.toLowerCase().includes(af.customer);
    const matchFilterTotal = !af.total || (o.total || '').replace('$', '').includes(af.total.replace('$', ''));
    const matchFilterDate = !af.dateAdded || (o.date || '').toLowerCase().includes(af.dateAdded);
    const matchFilterStatus = !af.orderStatus || af.orderStatus === 'All' || mapped === af.orderStatus;

    return matchSearch && matchToolbarStatus && matchFilterId && matchFilterCustomer && matchFilterTotal && matchFilterDate && matchFilterStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, perPage]);

  // ── Shared input class ─────────────────────────────────────────────────
  const inputClass = `w-full border rounded-lg py-2 px-3 text-xs font-bold outline-none transition-all ${
    isDark ? 'bg-[#212529] border-slate-600 text-slate-200 placeholder:text-slate-600 focus:border-brand' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-brand'
  }`;

  return (
    <DataState loading={loading} error={error}>
    <div className="space-y-8 pb-8 animate-fade-in">
      {/* ─── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-brand'}`}>Order List</h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-semibold mt-1`}>
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* ─── Main Content (Table + Filter Sidebar) ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* ─── Left: Table Card ────────────────────────────────────────── */}
        <div className={`xl:col-span-8 rounded-xl border overflow-hidden transition-all duration-500 hover:shadow-lg ${
          isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>

          {/* ─── Toolbar ───────────────────────────────────────────────── */}
          <div className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b ${
            isDark ? 'border-slate-700/50' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or ID.."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-48 border rounded-lg py-2 pl-9 pr-3 text-xs font-bold outline-none transition-all ${
                    isDark ? 'bg-[#212529] border-slate-600 text-slate-200 focus:border-brand placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-brand placeholder:text-slate-400 shadow-inner'
                  }`}
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Status Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`border rounded-lg px-3 py-2 text-xs font-bold outline-none transition-all min-w-[100px] ${
                  isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Show N */}
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className={`border rounded-lg px-3 py-2 text-xs font-bold outline-none transition-all min-w-[90px] ${
                  isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <option value={10}>Show 10</option>
                <option value={20}>Show 20</option>
                <option value={50}>Show 50</option>
              </select>

              {/* Date Picker */}
              <DatePicker isDark={isDark} label="All Dates" />
            </div>

            {/* Results count */}
            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
              isDark ? 'bg-brand/10 text-brand-lightdark' : 'bg-brand-light text-brand'
            }`}>
              {filtered.length} results
            </span>
          </div>

          {/* ─── Table ─────────────────────────────────────────────────── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isDark ? 'bg-slate-800/30' : 'bg-slate-50/50 text-slate-500'}>
                  {['ID', 'Customer Name', 'Price', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className={`px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider ${
                      isDark ? 'text-slate-400' : ''
                    } ${h === 'Action' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                {current.length > 0 ? current.map(order => {
                  const displayStatus = mapStatus(order.status);
                  const idNum = order.id.replace('#ORD-', '');
                  return (
                    <tr key={order.id} className={`group/row transition-all duration-200 ${
                      isDark ? 'hover:bg-slate-800/80' : 'hover:bg-brand-light/40'
                    }`}>
                      <td className={`px-6 py-4 text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                        {idNum}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {order.storeName}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {order.total}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight ${getStatusStyle(displayStatus, isDark)}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {order.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={() => navigate(`/store-dashboard/orders/${order.id.replace('#', '')}`)}
                            className={`text-[11px] uppercase font-bold tracking-wider px-4 py-1.5 rounded-lg transition-all active:scale-95 border ${
                              isDark ? 'border-slate-600 text-slate-300 hover:bg-brand hover:text-white hover:border-brand' : 'border-slate-200 text-slate-600 hover:bg-brand hover:text-white hover:border-brand'
                            }`}
                          >
                            Detail
                          </button>
                          <button className={`p-1.5 rounded-lg transition-colors ${
                            isDark ? 'text-slate-500 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}>
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <p className={`text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No orders found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination ────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-6 py-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setCurrentPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === n ? 'bg-brand text-white shadow-lg shadow-brand-light' : (isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Filter Sidebar ───────────────────────────────────── */}
        <div className="xl:col-span-4 sticky top-4">
          <div className={`rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
            isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
          }`}>

            {/* Header */}
            <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <h5 className={`text-base font-bold ${isDark ? 'text-white' : 'text-brand'}`}>Filter by</h5>
            </div>

            {/* Filter Fields */}
            <div className="p-6 space-y-5">
              {/* Order ID */}
              <div>
                <label className={`block text-[11px] font-bold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Order ID</label>
                <input type="text" placeholder="Type here" value={filterOrderId} onChange={e => setFilterOrderId(e.target.value)} className={inputClass} />
              </div>

              {/* Customer */}
              <div>
                <label className={`block text-[11px] font-bold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Customer</label>
                <input type="text" placeholder="Type here" value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)} className={inputClass} />
              </div>

              {/* Total */}
              <div>
                <label className={`block text-[11px] font-bold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total</label>
                <input type="text" placeholder="Type here" value={filterTotal} onChange={e => setFilterTotal(e.target.value)} className={inputClass} />
              </div>

              {/* Date Added */}
              <div>
                <label className={`block text-[11px] font-bold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date Added</label>
                <input type="text" placeholder="Type here" value={filterDateAdded} onChange={e => setFilterDateAdded(e.target.value)} className={inputClass} />
              </div>

              {/* Date Modified */}
              <div>
                <label className={`block text-[11px] font-bold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date Modified</label>
                <input type="text" placeholder="Type here" value={filterDateModified} onChange={e => setFilterDateModified(e.target.value)} className={inputClass} />
              </div>

              {/* Order Status */}
              <div>
                <label className={`block text-[11px] font-bold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Order Status</label>
                <select
                  value={filterOrderStatus}
                  onChange={(e) => setFilterOrderStatus(e.target.value)}
                  className={`w-full border rounded-lg py-2 px-3 text-xs font-bold outline-none transition-all ${
                    isDark ? 'bg-[#212529] border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <option value="All">All</option>
                  <option value="Received">Received</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Apply Button */}
            <div className={`px-6 py-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <button
                onClick={handleApplyFilter}
                className="w-full py-3 rounded-xl font-bold text-sm bg-brand hover:bg-brand-hover text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-light active:scale-[0.98]"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
    </DataState>
  );
};

export default Orders;
