const InfoCards = ({ order }) => {
  return (
    <div className="row cols-3" style={{ marginBottom: 20 }}>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
          <span className="material-icons" style={{ fontSize: 28, color: '#1d5ba0' }}>person</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>Customer</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer}</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {order.email || 'No email provided'}<br />
          Phone: +1 800 555 00{order.id?.toString().slice(-2) || '00'}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
          <span className="material-icons" style={{ fontSize: 28, color: '#1d5ba0' }}>local_shipping</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>Order info</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Shipping: Fast delivery</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Pay method: Card<br />
          Status: {order.status}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
          <span className="material-icons" style={{ fontSize: 28, color: '#1d5ba0' }}>location_on</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>Deliver to</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>New York City</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          123 Main Street, Apt 4B<br />
          United States
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
