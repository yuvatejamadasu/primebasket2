const OrderHeader = ({ order, onBack }) => {
  const badgeClass = order.status === 'Received' ? 'badge badge-success' : order.status === 'Pending' ? 'badge badge-warning' : 'badge badge-info';

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
        <div style={{ minWidth: 0 }}>
          <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: 14 }}>
            <span className="material-icons" style={{ fontSize: 18 }}> </span>
            Back to orders
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Ordered on {order.isoDate}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: 22 }}>{order.id}</h3>
              <span className={badgeClass}>{order.status}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-outline">Save</button>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-icons" style={{ fontSize: 18 }}>print</span>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
