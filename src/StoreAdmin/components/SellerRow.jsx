import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerRow({ seller }) {
  const navigate = useNavigate();
  const initials = seller.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <tr>
      <td width="40%">
        <div className="seller-row-item">
          <div className="seller-row-avatar">{initials}</div>
          <div>
            <div className="seller-row-name">{seller.name}</div>
            <div className="seller-row-meta">Seller ID: {seller.sellerId}</div>
          </div>
        </div>
      </td>
      <td>{seller.email}</td>
      <td>
        <span className={`badge ${seller.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
          {seller.status}
        </span>
      </td>
      <td>{seller.registered}</td>
      <td className="text-end">
        <button
          type="button"
          className="btn-xs"
          onClick={() => navigate(`/sellers/${seller.id}`)}
        >
          View details
        </button>
      </td>
    </tr>
  );
}
