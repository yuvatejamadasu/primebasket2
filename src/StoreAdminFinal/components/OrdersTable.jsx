// ===========================================
//  src/components/OrdersTable.jsx
//  Orders data table with status badges & row actions
// ===========================================

import { Link } from 'react-router-dom';
import RowDropdown from './RowDropdown';

const formatDate = iso => {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

const badgeClass = status =>
  status === 'Received' ? 'badge badge-success' : 'badge badge-warning';

const OrdersTable = ({ orders, onViewDetail }) => {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Date</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: '#9ca3af' }}>
                No orders found
              </td>
            </tr>
          )}

          {orders.map((order, i) => (
            <tr key={i}>
              <td>
                <Link to={`/orders/${order.id}`} className="order-id">
                  {order.id}
                </Link>
              </td>
              <td><b>{order.customer}</b></td>
              <td>{order.price}</td>
              <td>
                <span className={badgeClass(order.status)}>{order.status}</span>
              </td>
              <td>{formatDate(order.isoDate)}</td>
              <td style={{ textAlign: 'right' }}>
                <div className="action-group" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '7px 12px', fontSize: 12 }}
                    onClick={() => onViewDetail?.(order)}
                  >
                    Detail
                  </button>
                  <RowDropdown />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
