import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../ThemeContext';
import '../styles/DeliveryPartner.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);


const deliveryStats = [
  { icon: 'payments', color: 'blue', label: 'Total Earnings', value: '₹84,250', desc: 'Total payouts this month', trend: '+12.5%', trendUp: true },
  { icon: 'task_alt', color: 'green', label: 'Delivered', value: '1,245', desc: 'Successfully completed', trend: '+8.2%', trendUp: true },
  { icon: 'pending_actions', color: 'yellow', label: 'Pending', value: '42', desc: 'Awaiting delivery', trend: '-3.1%', trendUp: false },
  { icon: 'support_agent', color: 'cyan', label: 'Open Queries', value: '7', desc: 'Customer complaints', trend: '-18%', trendUp: false },
];

const deliveryOrders = [
  { orderId: '#ORD-4521', customer: 'Priya Sharma', product: 'Basmati Rice 5kg', location: 'Koramangala, Bangalore', date: '07 Apr 2026', deliveryDate: '07 Apr 2026', status: 'Delivered', amount: '₹450', partner: 'Arjun Kumar', rating: 5, feedback: 'Very fast delivery, well packed!' },
  { orderId: '#ORD-4518', customer: 'Amit Patel', product: 'Organic Honey 500g', location: 'Andheri West, Mumbai', date: '07 Apr 2026', deliveryDate: '—', status: 'Pending', amount: '₹320', partner: 'Suresh Raina', rating: null, feedback: null },
  { orderId: '#ORD-4515', customer: 'Neha Gupta', product: 'Mixed Dry Fruits 1kg', location: 'Saket, New Delhi', date: '06 Apr 2026', deliveryDate: '07 Apr 2026', status: 'Delivered', amount: '₹780', partner: 'Vikram Singh', rating: 4, feedback: 'Good delivery but slightly delayed.' },
  { orderId: '#ORD-4512', customer: 'Rajesh Kumar', product: 'Cold Press Oil 1L', location: 'Banjara Hills, Hyderabad', date: '06 Apr 2026', deliveryDate: '—', status: 'In Transit', amount: '₹540', partner: 'Rahul Dravid', rating: null, feedback: null },
  { orderId: '#ORD-4509', customer: 'Sunita Devi', product: 'Saffron 2g Pack', location: 'Salt Lake, Kolkata', date: '06 Apr 2026', deliveryDate: '06 Apr 2026', status: 'Delivered', amount: '₹1,200', partner: 'Arjun Kumar', rating: 5, feedback: 'Excellent packaging and on-time delivery!' },
  { orderId: '#ORD-4507', customer: 'Vikash Yadav', product: 'Almond Butter 350g', location: 'Whitefield, Bangalore', date: '05 Apr 2026', deliveryDate: '06 Apr 2026', status: 'Delivered', amount: '₹420', partner: 'Mahesh Babu', rating: 3, feedback: 'Delivery was late by a day.' },
  { orderId: '#ORD-4505', customer: 'Ananya Roy', product: 'Green Tea 100 bags', location: 'Jubilee Hills, Hyderabad', date: '05 Apr 2026', deliveryDate: '—', status: 'Pending', amount: '₹290', partner: 'Suresh Raina', rating: null, feedback: null },
  { orderId: '#ORD-4502', customer: 'Manoj Tiwari', product: 'Quinoa 500g', location: 'Gomti Nagar, Lucknow', date: '05 Apr 2026', deliveryDate: '05 Apr 2026', status: 'Delivered', amount: '₹350', partner: 'Vikram Singh', rating: 4, feedback: 'Neatly delivered. Satisfied.' },
  { orderId: '#ORD-4499', customer: 'Kavita Joshi', product: 'Chia Seeds 250g', location: 'Viman Nagar, Pune', date: '04 Apr 2026', deliveryDate: '—', status: 'Failed', amount: '₹180', partner: 'Mahesh Babu', rating: 1, feedback: 'Wrong address attempted, returned.' },
  { orderId: '#ORD-4496', customer: 'Deepak Verma', product: 'Jaggery Powder 1kg', location: 'Aundh, Pune', date: '04 Apr 2026', deliveryDate: '04 Apr 2026', status: 'Delivered', amount: '₹220', partner: 'Rahul Dravid', rating: 5, feedback: 'Perfect! Delivered before expected time.' },
];

const locationData = [
  { city: 'Bangalore', delivered: 312, pending: 8, failed: 3, total: 323 },
  { city: 'Mumbai', delivered: 278, pending: 12, failed: 5, total: 295 },
  { city: 'New Delhi', delivered: 245, pending: 6, failed: 2, total: 253 },
  { city: 'Hyderabad', delivered: 198, pending: 9, failed: 4, total: 211 },
  { city: 'Pune', delivered: 112, pending: 4, failed: 1, total: 117 },
  { city: 'Kolkata', delivered: 67, pending: 2, failed: 1, total: 70 },
  { city: 'Lucknow', delivered: 33, pending: 1, failed: 0, total: 34 },
];

const customerQueries = [
  { id: 'QRY-101', orderId: '#ORD-4499', customer: 'Kavita Joshi', issue: 'Wrong address attempted — delivery failed', status: 'Open', priority: 'High', date: '04 Apr 2026', assignedTo: 'Mahesh Babu' },
  { id: 'QRY-099', orderId: '#ORD-4507', customer: 'Vikash Yadav', issue: 'Delivery was delayed by one day', status: 'In Progress', priority: 'Medium', date: '06 Apr 2026', assignedTo: 'Mahesh Babu' },
  { id: 'QRY-097', orderId: '#ORD-4515', customer: 'Neha Gupta', issue: 'Package was slightly damaged on arrival', status: 'Resolved', priority: 'Low', date: '07 Apr 2026', assignedTo: 'Vikram Singh' },
  { id: 'QRY-095', orderId: '#ORD-4512', customer: 'Rajesh Kumar', issue: 'Tracking not updating — still shows in transit', status: 'Open', priority: 'High', date: '07 Apr 2026', assignedTo: 'Rahul Dravid' },
  { id: 'QRY-093', orderId: '#ORD-4505', customer: 'Ananya Roy', issue: 'Estimated delivery date passed', status: 'Open', priority: 'Medium', date: '07 Apr 2026', assignedTo: 'Suresh Raina' },
  { id: 'QRY-091', orderId: '#ORD-4481', customer: 'Ravi Shankar', issue: 'Received wrong item in the package', status: 'Resolved', priority: 'High', date: '03 Apr 2026', assignedTo: 'Arjun Kumar' },
  { id: 'QRY-089', orderId: '#ORD-4470', customer: 'Meena Kumari', issue: 'Delivery partner was rude during handoff', status: 'In Progress', priority: 'High', date: '02 Apr 2026', assignedTo: 'Suresh Raina' },
];

const customerFeedback = [
  { customer: 'Priya Sharma', orderId: '#ORD-4521', rating: 5, comment: 'Very fast delivery, well packed! The delivery partner was polite and professional.', date: '07 Apr 2026', partner: 'Arjun Kumar' },
  { customer: 'Deepak Verma', orderId: '#ORD-4496', rating: 5, comment: 'Perfect! Delivered before expected time. Will order again.', date: '04 Apr 2026', partner: 'Rahul Dravid' },
  { customer: 'Sunita Devi', orderId: '#ORD-4509', rating: 5, comment: 'Excellent packaging and on-time delivery! Very happy with the service.', date: '06 Apr 2026', partner: 'Arjun Kumar' },
  { customer: 'Neha Gupta', orderId: '#ORD-4515', rating: 4, comment: 'Good delivery but slightly delayed. The package had a minor dent.', date: '07 Apr 2026', partner: 'Vikram Singh' },
  { customer: 'Manoj Tiwari', orderId: '#ORD-4502', rating: 4, comment: 'Neatly delivered. Satisfied with the overall experience.', date: '05 Apr 2026', partner: 'Vikram Singh' },
  { customer: 'Vikash Yadav', orderId: '#ORD-4507', rating: 3, comment: 'Delivery was late by a day. Expected better timing.', date: '06 Apr 2026', partner: 'Mahesh Babu' },
  { customer: 'Kavita Joshi', orderId: '#ORD-4499', rating: 1, comment: 'Wrong address attempted, delivery returned. Very frustrating experience.', date: '04 Apr 2026', partner: 'Mahesh Babu' },
];

const partnersData = [
  { id: 'DP001', name: 'Arjun Kumar', contact: '+91 98765 43210', delivered: 154, pending: 3, failed: 1, earnings: '₹12,400', status: 'Active', rating: 4.8, zone: 'Bangalore, Kolkata' },
  { id: 'DP002', name: 'Suresh Raina', contact: '+91 87654 32109', delivered: 132, pending: 8, failed: 2, earnings: '₹10,560', status: 'Active', rating: 4.6, zone: 'Mumbai, Hyderabad' },
  { id: 'DP003', name: 'Vikram Singh', contact: '+91 76543 21098', delivered: 98, pending: 2, failed: 0, earnings: '₹7,840', status: 'On Leave', rating: 4.9, zone: 'New Delhi, Lucknow' },
  { id: 'DP004', name: 'Rahul Dravid', contact: '+91 65432 10987', delivered: 210, pending: 5, failed: 2, earnings: '₹16,800', status: 'Active', rating: 4.7, zone: 'Hyderabad, Pune' },
  { id: 'DP005', name: 'Mahesh Babu', contact: '+91 54321 09876', delivered: 45, pending: 4, failed: 3, earnings: '₹3,600', status: 'Active', rating: 4.2, zone: 'Bangalore, Pune' },
];

/* ── HELPERS ── */

const statusBadge = (status) => {
  const map = {
    Delivered: 'badge-success', Active: 'badge-success', Resolved: 'badge-success',
    Pending: 'badge-warning', 'In Transit': 'badge-warning', 'On Leave': 'badge-warning', 'In Progress': 'badge-warning',
    Failed: 'badge-danger', Inactive: 'badge-danger', Open: 'badge-danger',
  };
  return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
};

const priorityBadge = (priority) => {
  const map = { High: 'priority-high', Medium: 'priority-medium', Low: 'priority-low' };
  return <span className={`dp-priority-tag ${map[priority] || ''}`}>{priority}</span>;
};

const renderStars = (rating) => {
  if (rating == null) return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>N/A</span>;
  return (
    <div className="dp-star-row">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className="material-icons" style={{ fontSize: 15, color: s <= rating ? '#f59e0b' : '#d1d5db' }}>star</span>
      ))}
      <span className="dp-star-num">{rating}.0</span>
    </div>
  );
};

/* ── TABS ── */
const TABS = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'deliveries', label: 'Delivery Orders', icon: 'local_shipping' },
  { key: 'locations', label: 'Locations', icon: 'location_on' },
  { key: 'queries', label: 'Queries & Issues', icon: 'report_problem' },
  { key: 'feedback', label: 'Customer Feedback', icon: 'reviews' },
  { key: 'partners', label: 'Partners', icon: 'group' },
];

/* ── COMPONENT ── */
const DeliveryPartners = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('All');
  const [queryFilter, setQueryFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [partnerFilter, setPartnerFilter] = useState('All Partners');
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#94a3b8' : '#6b7280';

  /* Charts */
  const earningsChart = {
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        { label: 'Earnings (₹)', data: [52000, 58000, 61000, 59000, 68000, 72000, 75000, 81000, 79000, 84250, 82000, 88000], borderColor: '#1d5ba0', backgroundColor: 'rgba(37,99,235,0.12)', fill: true, tension: 0.4, pointBackgroundColor: '#1d5ba0', pointRadius: 4, pointHoverRadius: 7 },
        { label: 'Deliveries', data: [820, 910, 970, 940, 1060, 1120, 1150, 1210, 1190, 1245, 1200, 1300], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointRadius: 4, pointHoverRadius: 7, yAxisID: 'y1' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { color: textColor, font: { family: 'Nunito', size: 12 }, boxWidth: 14, padding: 16 } }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Nunito' } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Nunito' }, callback: v => '₹' + (v / 1000).toFixed(0) + 'k' }, position: 'left' },
        y1: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Nunito' } }, position: 'right' },
      },
    },
  };

  const locationChart = {
    data: {
      labels: locationData.map(l => l.city),
      datasets: [
        { label: 'Delivered', data: locationData.map(l => l.delivered), backgroundColor: '#1d5ba0' },
        { label: 'Pending', data: locationData.map(l => l.pending), backgroundColor: '#f59e0b' },
        { label: 'Failed', data: locationData.map(l => l.failed), backgroundColor: '#ef4444' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { color: textColor, font: { family: 'Nunito', size: 12 }, boxWidth: 14, padding: 16 } } },
      scales: {
        x: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Nunito' } } },
        y: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Nunito' } } },
      },
    },
  };

  const ratingDonut = {
    data: {
      labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
      datasets: [{ data: [3, 2, 1, 0, 1], backgroundColor: ['#1d5ba0', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'], borderWidth: 0, hoverOffset: 8 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Nunito', size: 12 }, padding: 14, boxWidth: 12 } } },
      cutout: '65%',
    },
  };

  /* Filters */
  const uniquePartners = ['All Partners', ...new Set(deliveryOrders.map(o => o.partner))];

  const filterByTime = (dateStr, filter) => {
    if (filter === 'All Time') return true;
    const orderDate = new Date(dateStr);
    const today = new Date('2026-04-07T00:00:00'); // Baseline date from mock data
    
    orderDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = today - orderDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (filter === 'Daily') return diffDays === 0;
    if (filter === 'Weekly') return diffDays <= 7;
    if (filter === 'Monthly') return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    if (filter === 'Annually') return orderDate.getFullYear() === today.getFullYear();
    
    return true;
  };

  const filteredOrders = deliveryOrders.filter(o => {
    const statusMatch = statusFilter === 'All' || o.status === statusFilter;
    const partnerMatch = partnerFilter === 'All Partners' || o.partner === partnerFilter;
    const timeMatch = filterByTime(o.date, timeFilter);
    const searchMatch = !searchQuery || 
                        o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.product.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && partnerMatch && timeMatch && searchMatch;
  });

  const filteredQueries = customerQueries.filter(q => queryFilter === 'All' || q.status === queryFilter);

  /* ── RENDER SECTIONS ── */

  const renderOverview = () => (
    <>
      <div className="stats-grid">
        {deliveryStats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}>
              <span className="material-icons">{s.icon}</span>
            </div>
            <div className="stat-info">
              <h6>{s.label}</h6>
              <span className="value">{s.value}</span>
              <div className="dp-trend-row">
                <span className={`dp-trend ${s.trendUp ? 'up' : 'down'}`}>
                  <span className="material-icons" style={{ fontSize: 14 }}>{s.trendUp ? 'trending_up' : 'trending_down'}</span>
                  {s.trend}
                </span>
                <span className="desc">{s.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row col-8-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title" style={{ marginBottom: 16 }}>Earnings & Deliveries Trend</h5>
            <div className="chart-wrap" style={{ height: 300 }}>
              <Line data={earningsChart.data} options={earningsChart.options} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title" style={{ marginBottom: 16 }}>Feedback Ratings</h5>
            <div className="chart-wrap" style={{ height: 300 }}>
              <Doughnut data={ratingDonut.data} options={ratingDonut.options} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deliveries (mini table) */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h4 className="card-title">Recent Deliveries</h4>
          <button className="btn-xs" onClick={() => setActiveTab('deliveries')}>View All →</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveryOrders.slice(0, 5).map((o, i) => (
                  <tr key={i}>
                    <td><span className="order-id">{o.orderId}</span></td>
                    <td style={{ fontWeight: 500 }}>{o.customer}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{o.product}</td>
                    <td><span className="dp-location-tag"><span className="material-icons" style={{ fontSize: 14 }}>location_on</span>{o.location}</span></td>
                    <td>{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Queries + Top Locations */}
      <div className="row cols-2">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Open Queries</h4>
            <button className="btn-xs" onClick={() => setActiveTab('queries')}>View All →</button>
          </div>
          <div className="card-body">
            {customerQueries.filter(q => q.status === 'Open').slice(0, 3).map((q, i) => (
              <div key={i} className="dp-query-mini">
                <div className="dp-query-mini-header">
                  <span className="order-id">{q.id}</span>
                  {priorityBadge(q.priority)}
                </div>
                <p className="dp-query-mini-text">{q.issue}</p>
                <div className="dp-query-mini-footer">
                  <span><span className="material-icons" style={{ fontSize: 13 }}>person</span> {q.customer}</span>
                  <span><span className="material-icons" style={{ fontSize: 13 }}>calendar_today</span> {q.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Deliveries by Location</h4>
            <button className="btn-xs" onClick={() => setActiveTab('locations')}>View All →</button>
          </div>
          <div className="card-body">
            {locationData.slice(0, 5).map((loc, i) => (
              <div key={i} className="dp-location-row">
                <div className="dp-location-name">
                  <span className="material-icons" style={{ fontSize: 18, color: 'var(--primary)' }}>location_city</span>
                  <span>{loc.city}</span>
                </div>
                <div className="dp-location-bar-area">
                  <div className="progress-bar-wrap">
                    <div className="progress-fill blue" style={{ width: `${(loc.delivered / 323) * 100}%` }} />
                  </div>
                </div>
                <span className="dp-location-count">{loc.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderDeliveries = () => (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
        <h4 className="card-title">All Delivery Orders</h4>
        <div className="filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div className="search-box">
            <span className="material-icons search-icon">search</span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="form-select" value={partnerFilter} onChange={e => setPartnerFilter(e.target.value)} style={{ minWidth: 140 }}>
            {uniquePartners.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select className="form-select" value={timeFilter} onChange={e => setTimeFilter(e.target.value)} style={{ minWidth: 130 }}>
            <option value="All Time">All Time</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Annually">Annually</option>
          </select>
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: 130 }}>
            <option value="All">All Status</option>
            <option>Delivered</option>
            <option>Pending</option>
            <option>In Transit</option>
            <option>Failed</option>
          </select>
        </div>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Location</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Amount</th>
                <th>Partner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, i) => (
                <tr key={i}>
                  <td><span className="order-id">{o.orderId}</span></td>
                  <td style={{ fontWeight: 500 }}>{o.customer}</td>
                  <td style={{ color: 'var(--text-muted)', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.product}</td>
                  <td><span className="dp-location-tag"><span className="material-icons" style={{ fontSize: 14 }}>location_on</span>{o.location}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{o.date}</td>
                  <td style={{ color: o.deliveryDate === '—' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{o.deliveryDate}</td>
                  <td style={{ fontWeight: 700 }}>{o.amount}</td>
                  <td style={{ fontWeight: 500 }}>{o.partner}</td>
                  <td>{statusBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer d-flex justify-between align-center" style={{ padding: '15px 20px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Showing {filteredOrders.length} of {deliveryOrders.length} orders</span>
        <div className="pagination" style={{ margin: 0 }}>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn"><span className="material-icons" style={{ fontSize: 18 }}>chevron_right</span></button>
        </div>
      </div>
    </div>
  );

  const renderLocations = () => (
    <>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <h5 className="card-title" style={{ marginBottom: 16 }}>Deliveries by City</h5>
          <div className="chart-wrap" style={{ height: 350 }}>
            <Bar data={locationChart.data} options={locationChart.options} />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Location-wise Breakdown</h4>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Delivered</th>
                  <th>Pending</th>
                  <th>Failed</th>
                  <th>Total</th>
                  <th>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {locationData.map((loc, i) => (
                  <tr key={i}>
                    <td>
                      <div className="d-flex align-center" style={{ gap: 8 }}>
                        <span className="material-icons" style={{ fontSize: 18, color: 'var(--primary)' }}>location_city</span>
                        <span style={{ fontWeight: 600 }}>{loc.city}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#16a34a' }}>{loc.delivered}</td>
                    <td style={{ fontWeight: 600, color: '#d97706' }}>{loc.pending}</td>
                    <td style={{ fontWeight: 600, color: '#dc2626' }}>{loc.failed}</td>
                    <td style={{ fontWeight: 700 }}>{loc.total}</td>
                    <td>
                      <div className="dp-success-rate">
                        <div className="progress-bar-wrap" style={{ flex: 1 }}>
                          <div className="progress-fill blue" style={{ width: `${((loc.delivered / loc.total) * 100).toFixed(0)}%` }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{((loc.delivered / loc.total) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderQueries = () => (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Customer Queries & Issues</h4>
        <div className="filter-bar">
          <select className="form-select" value={queryFilter} onChange={e => setQueryFilter(e.target.value)} style={{ minWidth: 130 }}>
            <option value="All">All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Query ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Issue Description</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((q, i) => (
                <tr key={i}>
                  <td><span className="order-id">{q.id}</span></td>
                  <td><span className="order-id">{q.orderId}</span></td>
                  <td style={{ fontWeight: 500 }}>{q.customer}</td>
                  <td style={{ maxWidth: 220, fontSize: 13 }}>{q.issue}</td>
                  <td>{priorityBadge(q.priority)}</td>
                  <td style={{ fontWeight: 500 }}>{q.assignedTo}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{q.date}</td>
                  <td>{statusBadge(q.status)}</td>
                  <td><button className="btn-xs">{q.status === 'Resolved' ? 'View' : 'Resolve'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer d-flex justify-between align-center" style={{ padding: '15px 20px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Showing {filteredQueries.length} of {customerQueries.length} queries</span>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="dp-feedback-grid">
      {customerFeedback.map((fb, i) => (
        <div key={i} className="card dp-feedback-card">
          <div className="card-body">
            <div className="dp-fb-header">
              <div className="dp-fb-avatar-area">
                <div className={`member-avatar g${(i % 5) + 1}`} style={{ width: 40, height: 40, fontSize: 14 }}>
                  {fb.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{fb.customer}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fb.orderId} · {fb.date}</div>
                </div>
              </div>
              <div className="dp-star-row">{renderStars(fb.rating)}</div>
            </div>
            <p className="dp-fb-comment">"{fb.comment}"</p>
            <div className="dp-fb-footer">
              <span className="material-icons" style={{ fontSize: 14, color: 'var(--primary)' }}>local_shipping</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Delivered by <strong style={{ color: 'var(--text-primary)' }}>{fb.partner}</strong></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPartners = () => {
    const filteredPartners = partnersData.filter(p => !partnerSearchQuery || p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(partnerSearchQuery.toLowerCase()));

    return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">All Delivery Partners</h4>
        <div className="filter-bar">
          <div className="search-box">
            <span className="material-icons search-icon">search</span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search partners..." 
              value={partnerSearchQuery}
              onChange={e => setPartnerSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Partner Name</th>
                <th>Contact</th>
                <th>Delivered</th>
                <th>Pending</th>
                <th>Failed</th>
                <th>Earnings</th>
                <th>Zone</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((p, i) => (
                <tr key={i}>
                  <td><span className="order-id">{p.id}</span></td>
                  <td>
                    <div className="d-flex align-center">
                      <div className={`member-avatar g${(i % 5) + 1}`} style={{ width: 32, height: 32, fontSize: 12, marginRight: 10 }}>
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.contact}</td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>{p.delivered}</td>
                  <td style={{ fontWeight: 600, color: '#d97706' }}>{p.pending}</td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>{p.failed}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.earnings}</td>
                  <td><span className="dp-location-tag"><span className="material-icons" style={{ fontSize: 14 }}>location_on</span>{p.zone}</span></td>
                  <td>
                    <div className="d-flex align-center">
                      <span className="material-icons" style={{ color: '#f59e0b', fontSize: 16, marginRight: 4 }}>star</span>
                      {p.rating}
                    </div>
                  </td>
                  <td>{statusBadge(p.status)}</td>
                  <td>
                    <button className="btn-xs btn-outline" onClick={() => navigate(`/delivery-partners/${p.id}`)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const tabContent = {
    overview: renderOverview,
    deliveries: renderDeliveries,
    locations: renderLocations,
    queries: renderQueries,
    feedback: renderFeedback,
    partners: renderPartners,
  };

  return (
    <div>
      {/* Header */}
      <div className="content-header">
        <div>
          <h2>Delivery Partners</h2>
          <p>Manage deliveries, track performance, and resolve customer queries</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <span className="material-icons" style={{ fontSize: 18 }}>download</span>
            Export Report
          </button>
          <button className="btn btn-primary">
            <span className="material-icons" style={{ fontSize: 18 }}>person_add</span>
            Add Partner
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="dp-tabs-bar">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`dp-tab-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="material-icons">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dp-tab-content">
        {tabContent[activeTab]()}
      </div>
    </div>
  );
};

export default DeliveryPartners;
