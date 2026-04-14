// ===========================================
//  src/components/FilterSidebar.jsx
//  Right-side filter panel for orders list
// ===========================================

const TEXT_FIELDS = [
  'Order ID',
  'Customer',
  'Total',
  'Date Added',
  'Date Modified',
];

const FilterSidebar = () => {
  return (
    <div className="filter-card" style={{ padding: 24, borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <h5 className="filter-title" style={{ marginBottom: 20 }}>Filter by</h5>

      {TEXT_FIELDS.map((label, i) => (
        <div className="form-group" key={i} style={{ marginBottom: 16 }}>
          <label className="form-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>{label}</label>
          <input
            type="text"
            placeholder="Type here"
            className="form-control"
            style={{ width: '100%', margin: 0 }}
          />
        </div>
      ))}

      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="form-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>Order Status</label>
        <select className="form-select" style={{ width: '100%', margin: 0 }}>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Apply Filter</button>
    </div>
  );
};

export default FilterSidebar;
