import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../ThemeContext';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

/**
 * BACKEND_URL: Replace this with your actual backend endpoint.
 * Expected JSON format:
 * {
 *   "sales": {
 *     "labels": ["Jan", "Feb", ...],
 *     "datasets": [
 *       { "data": [8200, 9400, ...] }, // Revenue
 *       { "data": [5200, 6100, ...] }  // Orders
 *     ]
 *   },
 *   "revenueByArea": {
 *     "labels": ["US", "Europe", ...],
 *     "data": [35, 25, ...]
 *   }
 * }
 */
const BACKEND_URL = ''; 

const statsData = [
  {
    icon: 'monetization_on',
    color: 'blue',
    label: 'Revenue',
    value: '₹13,456.5',
    desc: 'Shipping fees not included',
  },
  {
    icon: 'local_shipping',
    color: 'green',
    label: 'Orders',
    value: '53,668',
    desc: 'Excluding orders in transit',
  },
  {
    icon: 'qr_code',
    color: 'yellow',
    label: 'Products',
    value: '9,856',
    desc: 'In 19 Categories',
  },
  {
    icon: 'shopping_basket',
    color: 'cyan',
    label: 'Monthly Earning',
    value: '₹6,982',
    desc: 'Based on your local time',
  },
];

const orders = [
  { id: '#SK2540', name: 'Neal Matthews', date: '07 Oct, 2021', total: '₹400', status: 'Paid', method: 'Mastercard', checked: false },
  { id: '#SK2541', name: 'Jamal Burnett', date: '07 Oct, 2021', total: '₹380', status: 'Chargeback', method: 'Visa', checked: false },
  { id: '#SK2542', name: 'Juan Mitchell', date: '06 Oct, 2021', total: '₹384', status: 'Paid', method: 'Paypal', checked: false },
  { id: '#SK2543', name: 'Barry Dick', date: '05 Oct, 2021', total: '₹412', status: 'Paid', method: 'Mastercard', checked: false },
  { id: '#SK2544', name: 'Ronald Taylor', date: '04 Oct, 2021', total: '₹404', status: 'Refund', method: 'Visa', checked: false },
  { id: '#SK2545', name: 'Jacob Hunter', date: '04 Oct, 2021', total: '₹392', status: 'Paid', method: 'Paypal', checked: false },
];

const statusBadge = (status) => {
  const map = { Paid: 'badge-success', Chargeback: 'badge-danger', Refund: 'badge-warning' };
  return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
};

const Dashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [tableOrders, setTableOrders] = useState(orders);
  const [allChecked, setAllChecked] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Status');
  const [currentPage, setCurrentPage] = useState(1);

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#94a3b8' : '#6b7280';

  const [salesData, setSalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [8200, 9400, 7800, 11200, 10400, 13800, 12100, 14200, 11600, 15800, 13200, 17400],
        borderColor: '#1d5ba0',
        backgroundColor: 'rgba(37,99,235,0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1d5ba0',
        pointRadius: 4,
        pointHoverRadius: 7,
      },
      {
        label: 'Orders',
        data: [5200, 6100, 5400, 7800, 7200, 9200, 8400, 9800, 8100, 10200, 9400, 11800],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  });

  const [donutData, setDonutData] = useState({
    labels: ['US', 'Europe', 'Asian', 'Africa', 'Other'],
    datasets: [{
      data: [35, 25, 18, 12, 10],
      backgroundColor: ['#1d5ba0', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  });

  useEffect(() => {
    if (!BACKEND_URL) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(BACKEND_URL);
        const data = response.data;
        
        if (data.sales) {
          setSalesData(prev => ({
            ...prev,
            labels: data.sales.labels || prev.labels,
            datasets: prev.datasets.map((ds, i) => ({
              ...ds,
              data: data.sales.datasets[i]?.data || ds.data
            }))
          }));
        }
        
        if (data.revenueByArea) {
          setDonutData(prev => ({
            ...prev,
            labels: data.revenueByArea.labels || prev.labels,
            datasets: [{
              ...prev.datasets[0],
              data: data.revenueByArea.data || prev.datasets[0].data
            }]
          }));
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { family: 'Nunito', size: 12 }, boxWidth: 14, padding: 16 },
      },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Nunito' } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Nunito' }, callback: v => '$' + (v/1000).toFixed(0) + 'k' },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { family: 'Nunito', size: 12 }, padding: 14, boxWidth: 12 },
      },
    },
    cutout: '65%',
  };

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    setTableOrders(o => o.map(r => ({ ...r, checked: next })));
  };

  const toggleRow = (id) => {
    setTableOrders(o => o.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const filteredOrders = tableOrders.filter(o => {
    if (filterStatus !== 'Status' && filterStatus !== 'All' && o.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      {/* Content Header */}
      <div className="content-header">
        <div>
          <h2>Dashboard</h2>
          <p>Whole data about your business here</p>
        </div>
        <button className="btn btn-primary">
          <span className="material-icons" style={{ fontSize: 18 }}>post_add</span>
          Create report
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statsData.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}>
              <span className="material-icons">{s.icon}</span>
            </div>
            <div className="stat-info">
              <h6>{s.label}</h6>
              <span className="value">{s.value}</span>
              <span className="desc">{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="row col-8-4">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <h5 className="card-title" style={{ marginBottom: 16 }}>Sale Statistics</h5>
              <div className="chart-wrap">
                <Line data={salesData} options={salesOptions} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <h5 className="card-title" style={{ marginBottom: 16 }}>Revenue By Area</h5>
              <div className="chart-wrap">
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h4 className="card-title">Latest Orders</h4>
          <div className="filter-bar">
            <select
              className="form-select"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              style={{ minWidth: 160 }}
            >
              {["All Categories","Women's Clothing","Men's Clothing","Cellphones","Computer & Office","Consumer Electronics","Jewelry & Accessories","Home & Garden"].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              style={{ width: 160 }}
            />
            <select
              className="form-select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ minWidth: 120 }}
            >
              {['Status','All','Paid','Chargeback','Refund'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 44 }}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={allChecked}
                        onChange={toggleAll}
                      />
                    </div>
                  </th>
                  <th>Order ID</th>
                  <th>Billing Name</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Payment Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o, i) => (
                  <tr key={i}>
                    <td>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={o.checked}
                          onChange={() => toggleRow(o.id)}
                        />
                      </div>
                    </td>
                    <td><Link to="/store-dashboard/orders" className="order-id">{o.id}</Link></td>
                    <td>{o.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{o.date}</td>
                    <td style={{ fontWeight: 700 }}>{o.total}</td>
                    <td>{statusBadge(o.status)}</td>
                    <td>
                      <div className="payment-method">
                        <span className="material-icons">payment</span>
                        {o.method}
                      </div>
                    </td>
                    <td>
                      <button className="btn-xs" onClick={() => navigate('/store-dashboard/orders')}>
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {[1,2,3,'...',16].map((p, i) => (
          <button
            key={i}
            className={`page-btn${p === currentPage ? ' active' : ''}${p === '...' ? '' : ''}`}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
          >
            {p}
          </button>
        ))}
        <button className="page-btn">
          <span className="material-icons" style={{ fontSize: 18 }}>chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

