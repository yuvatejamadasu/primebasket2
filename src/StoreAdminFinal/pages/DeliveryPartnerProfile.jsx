import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/DeliveryPartner.css';

const mockPartnerData = {
  id: 'DP001',
  name: 'Arjun Kumar',
  phone: '+91 98765 43210',
  status: 'Online',
  verification: 'Verified',
  rating: 4.8,
  vehicle: {
    type: 'Bike',
    number: 'KA-01-HH-1234',
    license: 'KA04 2018xxxxxxx',
    insurance: 'Active',
  },
  earnings: {
    today: '₹840',
    week: '₹5,200',
    total: '₹12,400',
    pending: '₹1,200',
    method: 'UPI (Arjun@ybl)',
  },
  performance: {
    totalDeliveries: 154,
    completedToday: 12,
    cancelled: 2,
    avgTime: '28 mins',
  },
  activeOrders: [
    { orderId: '#ORD-4522', location: 'Koramangala -> Indiranagar', timeSinceAssign: '14 mins', status: 'In Transit' },
    { orderId: '#ORD-4523', location: 'HSR Layout -> BTM Layout', timeSinceAssign: '2 mins', status: 'Pickup' },
  ],
  history: [
    { date: '07 Apr 2026, 14:30', distance: '4.2 km', earnings: '₹65', status: 'Delivered' },
    { date: '07 Apr 2026, 13:10', distance: '2.1 km', earnings: '₹40', status: 'Delivered' },
    { date: '06 Apr 2026, 19:45', distance: '5.8 km', earnings: '₹85', status: 'Delivered' },
    { date: '06 Apr 2026, 18:20', distance: '1.2 km', earnings: '₹30', status: 'Cancelled' },
  ],
  documents: [
    { name: 'Aadhar Card', status: 'Approved' },
    { name: 'Driving License', status: 'Approved' },
    { name: 'Vehicle RC', status: 'Approved' },
    { name: 'Insurance', status: 'Expired' },
  ]
};

const TABS = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'orders', label: 'Orders', icon: 'local_shipping' },
  { key: 'earnings', label: 'Earnings', icon: 'account_balance_wallet' },
  { key: 'status', label: 'Status & Admin', icon: 'admin_panel_settings' },
];

const DeliveryPartnerProfile = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const p = mockPartnerData;
  p.id = partnerId || p.id;

  const renderOverview = () => (
    <>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <h4 className="dp-section-title"><span className="material-icons" style={{ fontSize: 18 }}>show_chart</span> Performance Overview</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <h6>Total Deliveries</h6>
                <span className="value">{p.performance.totalDeliveries}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h6>Completed Today</h6>
                <span className="value">{p.performance.completedToday}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h6>Cancelled Orders</h6>
                <span className="value">{p.performance.cancelled}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h6>Avg Delivery Time</h6>
                <span className="value">{p.performance.avgTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row cols-2">
        <div className="card">
          <div className="card-body">
            <h4 className="dp-section-title"><span className="material-icons" style={{ fontSize: 18 }}>two_wheeler</span> Vehicle Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Type</span>
                <span style={{ fontWeight: 600 }}>{p.vehicle.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Vehicle Number</span>
                <span style={{ fontWeight: 600 }}>{p.vehicle.number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>License Number</span>
                <span style={{ fontWeight: 600 }}>{p.vehicle.license}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Insurance</span>
                <span style={{ fontWeight: 600, color: p.vehicle.insurance === 'Active' ? '#16a34a' : '#dc2626' }}>{p.vehicle.insurance}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h4 className="dp-section-title"><span className="material-icons" style={{ fontSize: 18 }}>my_location</span> Location Tracking</h4>
            <div style={{ background: 'var(--bg-body)', padding: '30px', borderRadius: '10px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span className="material-icons" style={{ fontSize: 40, opacity: 0.5, marginBottom: 10 }}>map</span>
              <div>Live Location Map</div>
              <div style={{ fontSize: 12, marginTop: 5 }}>Last updated: Just now (Indiranagar)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderOrders = () => (
    <>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <h4 className="dp-section-title"><span className="material-icons" style={{ fontSize: 18 }}>rocket_launch</span> Current Activity</h4>
          {p.activeOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No active orders.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {p.activeOrders.map((o, i) => (
                <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700 }}>{o.orderId}</span>
                    <span className={`badge ${o.status === 'Pickup' ? 'badge-warning' : 'badge-info'}`}>{o.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <span className="material-icons" style={{ fontSize: 16 }}>route</span>
                    <span style={{ fontSize: 14 }}>{o.location}</span>
                    <span>•</span>
                    <span style={{ fontSize: 14 }}>Assigned {o.timeSinceAssign} ago</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-xs" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-icons" style={{ fontSize: 14 }}>call</span> Call</button>
                    <button className="btn-xs btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-icons" style={{ fontSize: 14 }}>my_location</span> View on Map</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="card-header">
            <h4 className="card-title"><span className="material-icons" style={{ fontSize: 18 }}>history</span> Order History</h4>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Distance</th>
                  <th>Earnings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {p.history.map((h, i) => (
                  <tr key={i}>
                    <td>{h.date}</td>
                    <td>{h.distance}</td>
                    <td style={{ fontWeight: 600 }}>{h.earnings}</td>
                    <td><span className={`badge ${h.status === 'Delivered' ? 'badge-success' : 'badge-danger'}`}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderEarnings = () => (
    <div className="card">
      <div className="card-body">
        <h4 className="dp-section-title"><span className="material-icons" style={{ fontSize: 18 }}>payments</span> Earnings Breakdown</h4>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h6>Today's Earnings</h6>
              <span className="value" style={{ color: '#16a34a' }}>{p.earnings.today}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h6>Weekly Earnings</h6>
              <span className="value">{p.earnings.week}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h6>Total Earnings</h6>
              <span className="value">{p.earnings.total}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h6>Pending Payouts</h6>
              <span className="value" style={{ color: '#d97706' }}>{p.earnings.pending}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-body)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Preferred Payment Method</div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-icons" style={{ color: 'var(--primary)' }}>account_balance</span>
              {p.earnings.method}
            </div>
          </div>
          <button className="btn-xs btn-outline">Change Details</button>
        </div>
      </div>
    </div>
  );

  const renderStatus = () => (
    <div className="row cols-2">
      <div className="card">
        <div className="card-body">
          <h4 className="dp-section-title"><span className="material-icons" style={{ fontSize: 18 }}>folder_shared</span> Documents & Verification</h4>
          <div>
            {p.documents.map((doc, i) => (
              <div key={i} className="dp-doc-row">
                <div className="dp-doc-info">
                  <span className="material-icons" style={{ color: 'var(--text-muted)' }}>description</span>
                  {doc.name}
                </div>
                <span className={`badge ${doc.status === 'Approved' ? 'badge-success' : 'badge-danger'}`}>{doc.status}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Request Document Update</button>
        </div>
      </div>

      <div className="card" style={{ borderColor: 'rgba(220, 38, 38, 0.2)' }}>
        <div className="card-body">
          <h4 className="dp-section-title" style={{ color: '#dc2626' }}><span className="material-icons" style={{ fontSize: 18 }}>gavel</span> Admin Actions</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Use these actions carefully as they directly impact the partner's account access and operations.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: 18 }}>edit</span> Edit Partner Details
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'center', color: '#d97706', borderColor: '#d97706' }}>
              <span className="material-icons" style={{ fontSize: 18 }}>pause_circle</span> Suspend Account
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'center', color: '#dc2626', borderColor: '#dc2626' }}>
              <span className="material-icons" style={{ fontSize: 18 }}>block</span> Deactivate & Block
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <button
        className="btn-xs btn-outline"
        style={{ marginBottom: '20px', display: 'inline-flex' }}
        onClick={() => navigate('/store-dashboard/delivery-partners')}
      >
        <span className="material-icons" style={{ fontSize: 16 }}>arrow_back</span>
        Back to Partners
      </button>

      {/* Top Profile Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="dp-profile-avatar">
              {p.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="dp-profile-details">
              <h2 style={{ margin: '0 0 6px 0', fontSize: '22px' }}>{p.name}</h2>
              <div className="dp-profile-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-icons" style={{ fontSize: 14 }}>tag</span> {p.id}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-icons" style={{ fontSize: 14 }}>phone</span> {p.phone}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600 }}>
                  <span className="material-icons" style={{ fontSize: 16 }}>star</span> {p.rating}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className={`dp-status-badge ${p.status === 'Online' ? 'dp-status-online' : 'dp-status-offline'}`}>
              <span className="material-icons" style={{ fontSize: 14 }}>circle</span> {p.status}
            </div>
            <div className={`dp-status-badge ${p.verification === 'Verified' ? 'dp-status-verified' : 'dp-status-busy'}`}>
              <span className="material-icons" style={{ fontSize: 14 }}>verified_user</span> {p.verification}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dp-tabs-bar">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`dp-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="material-icons">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="dp-tab-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'status' && renderStatus()}
      </div>
    </div>
  );
};

export default DeliveryPartnerProfile;

