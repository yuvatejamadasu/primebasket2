import React, { useState } from 'react';

export const Brands = () => {
  const brands = [
    { name: 'Apple', products: 48, revenue: '$124,500', country: 'USA', status: 'Active', grad: 'g1' },
    { name: 'Samsung', products: 62, revenue: '$98,200', country: 'South Korea', status: 'Active', grad: 'g2' },
    { name: 'Nike', products: 134, revenue: '$67,400', country: 'USA', status: 'Active', grad: 'g3' },
    { name: 'Sony', products: 29, revenue: '$54,800', country: 'Japan', status: 'Active', grad: 'g4' },
    { name: 'Adidas', products: 87, revenue: '$43,100', country: 'Germany', status: 'Active', grad: 'g5' },
    { name: 'Canon', products: 18, revenue: '$38,900', country: 'Japan', status: 'Inactive', grad: 'g1' },
  ];

  return (
    <div>
      <div className="content-header">
        <div>
          <h2>Brands</h2>
          <p>Manage brands in your marketplace</p>
        </div>
        <button className="btn btn-primary">
          <span className="material-icons" style={{ fontSize: 18 }}>add</span>
          Add Brand
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {brands.map((b, i) => (
          <div key={i} className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div className={`member-avatar ${b.grad}`} style={{ width: 64, height: 64, borderRadius: 18, fontSize: 22, margin: '0 auto 12px' }}>
                {b.name[0]}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{b.country}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[['Products', b.products], ['Revenue', b.revenue]].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--bg-body)', borderRadius: 10, padding: '10px 6px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k}</div>
                  </div>
                ))}
              </div>
              <span className={`badge ${b.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AddProduct = () => {
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', sku: '', description: '', status: 'Active' });
  const [saved, setSaved] = useState(false);

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div>
      <div className="content-header">
        <div>
          <h2>Add Product</h2>
          <p>Add a new product to your catalog</p>
        </div>
      </div>
      {saved && (
        <div style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-icons">check_circle</span>
          Product saved successfully!
        </div>
      )}
      <div className="row col-8-4">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h5 className="card-title">Product Information</h5></div>
            <div className="card-body">
              <div style={{ display: 'grid', gap: 16 }}>
                {[['Product Name', 'name', 'text', 'Enter product name...'],
                  ['SKU', 'sku', 'text', 'e.g. APL-IP14'],
                  ['Price', 'price', 'number', '0.00'],
                  ['Stock Quantity', 'stock', 'number', '0']].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input type={type} className="form-control" placeholder={ph}
                      value={form[key]} onChange={e => handleChange(key, e.target.value)} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category</label>
                  <select className="form-select" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                    <option value="">Select category...</option>
                    {["Women's Clothing","Men's Clothing","Cellphones","Computer & Office","Consumer Electronics","Jewelry & Accessories","Home & Garden","Shoes"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Description</label>
                  <textarea className="form-control" rows={4} placeholder="Product description..." value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    style={{ resize: 'vertical', minHeight: 100 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h5 className="card-title">Status & Visibility</h5></div>
            <div className="card-body">
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Product Status</label>
                <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Draft</option>
                </select>
              </div>
              <div style={{ padding: 16, background: 'var(--bg-body)', borderRadius: 12, border: '2px dashed var(--border-color)', textAlign: 'center', cursor: 'pointer' }}>
                <span className="material-icons" style={{ fontSize: 36, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>cloud_upload</span>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)' }}>Upload Product Image</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>PNG, JPG up to 5MB</div>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={handleSubmit}>
            <span className="material-icons" style={{ fontSize: 18 }}>save</span>
            Save Product
          </button>
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 10 }}>
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const Statistics = () => {
  return (
    <div>
      <div className="content-header">
        <div><h2>Statistics</h2><p>Advanced analytics and reports</p></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
        <span className="material-icons" style={{ fontSize: 80, color: 'var(--border-color)', marginBottom: 20 }}>bar_chart</span>
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Statistics Coming Soon</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: 400 }}>Advanced analytics features are currently under development. Check back soon for detailed insights.</p>
      </div>
    </div>
  );
};

export const Settings = () => {
  const [profile, setProfile] = useState({ name: 'Admin', email: 'admin@primebasket.com', phone: '+1 234 567 890', company: 'Prime Basket Inc.' });
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="content-header"><div><h2>Settings</h2><p>Manage your account preferences</p></div></div>
      {saved && (
        <div style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-icons">check_circle</span> Settings saved!
        </div>
      )}
      <div className="row cols-2">
        <div className="card">
          <div className="card-header"><h5 className="card-title">Profile Settings</h5></div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
              <div className="user-avatar" style={{ width: 64, height: 64, fontSize: 24 }}>AH</div>
              <button className="btn btn-outline">Change Avatar</button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {Object.entries(profile).map(([k, v]) => (
                <div key={k}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'capitalize' }}>
                    {k.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input className="form-control" value={v} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
              Save Changes
            </button>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h5 className="card-title">Notification Preferences</h5></div>
            <div className="card-body">
              {['Email notifications', 'Push notifications', 'Order updates', 'Marketing emails', 'Weekly digest'].map((pref, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: 13.5 }}>{pref}</span>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={i < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: i < 3 ? 'var(--primary)' : 'var(--border-color)', borderRadius: 24, transition: '0.3s' }}>
                      <span style={{ position: 'absolute', width: 18, height: 18, top: 3, left: i < 3 ? 23 : 3, background: 'white', borderRadius: '50%', transition: '0.3s' }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h5 className="card-title">Security</h5></div>
            <div className="card-body">
              {[['Current Password', 'password'], ['New Password', 'password'], ['Confirm Password', 'password']].map(([label, type]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input type={type} className="form-control" placeholder="••••••••" />
                </div>
              ))}
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>Update Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
