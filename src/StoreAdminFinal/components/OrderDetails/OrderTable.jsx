const sampleProducts = [
  { name: 'Haagen-Dazs Caramel Cone Ice', unitPrice: 44.25, qty: 2, total: 99.50 },
  { name: 'Seeds of Change Organic', unitPrice: 7.50, qty: 2, total: 15.00 },
  { name: 'All Natural Italian-Style', unitPrice: 43.50, qty: 2, total: 102.04 },
  { name: 'Sweet & Salty Kettle Corn', unitPrice: 99.00, qty: 3, total: 297.00 },
];

const OrderTable = ({ order }) => {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-body" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sampleProducts.map((product, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 20px', fontSize: 14, color: 'var(--text-primary)' }}>{product.name}</td>
                <td style={{ padding: '16px 20px', fontSize: 14, color: 'var(--text-primary)' }}>${product.unitPrice.toFixed(2)}</td>
                <td style={{ padding: '16px 20px', fontSize: 14, color: 'var(--text-primary)' }}>{product.qty}</td>
                <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>${product.total.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} />
              <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Subtotal</td>
              <td style={{ padding: '16px 20px', fontWeight: 700 }}>$513.54</td>
            </tr>
            <tr>
              <td colSpan={2} />
              <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Shipping</td>
              <td style={{ padding: '16px 20px', fontWeight: 700 }}>$10.00</td>
            </tr>
            <tr>
              <td colSpan={2} />
              <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Grand total</td>
              <td style={{ padding: '16px 20px', fontWeight: 700 }}>$523.54</td>
            </tr>
            <tr>
              <td colSpan={2} />
              <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Payment status</td>
              <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--success)' }}>Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
