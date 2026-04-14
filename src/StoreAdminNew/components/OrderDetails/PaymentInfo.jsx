const PaymentInfo = ({ order }) => {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-body">
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 14 }}>Payment info</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 40, height: 28, borderRadius: 8, background: '#f8fafc', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-icons" style={{ fontSize: 18, color: '#1d5ba0' }}>credit_card</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Master Card **** **** 4768</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Business name: Grand Market LLC</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          Phone: +1 (800) 555-154-52
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
