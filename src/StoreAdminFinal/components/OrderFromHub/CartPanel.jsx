import React from 'react';
import { ShoppingCart, Trash2, ArrowRight, PackageOpen } from 'lucide-react';

const CartPanel = ({ items, onRemove, onProceed, totalItems }) => {
  return (
    <aside className="hub-cart-panel">
      {/* Header */}
      <div className="cart-panel-header">
        <div className="cart-header-left">
          <ShoppingCart size={20} />
          <h3>Order Summary</h3>
        </div>
        {totalItems > 0 && (
          <span className="cart-items-badge">{totalItems} Items</span>
        )}
      </div>

      {/* Body */}
      <div className="cart-panel-body">
        {items.length === 0 ? (
          /* Empty State */
          <div className="cart-empty-state">
            <div className="cart-empty-icon">
              <PackageOpen size={40} />
            </div>
            <p className="cart-empty-title">No items added yet</p>
            <p className="cart-empty-subtitle">
              Start adding products to create your restock order
            </p>
          </div>
        ) : (
          <>
            {/* Item List */}
            <div className="cart-items-list">
              {items.map((item, index) => (
                <div key={item.cartId} className="cart-row">
                  <div className="cart-row-main">
                    <div className="cart-row-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-meta">
                        {item.netWt}
                      </p>
                    </div>
                    <div className="cart-row-right">
                      <span className="cart-item-subtotal">
                        Qty: {item.quantity}
                      </span>
                      <button
                        className="cart-remove-btn"
                        onClick={() => onRemove(item.cartId)}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  {index < items.length - 1 && <div className="cart-row-divider" />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer / Proceed Button */}
      <div className="cart-panel-footer">
        <button
          className="proceed-pay-btn"
          onClick={onProceed}
          disabled={items.length === 0}
        >
          <span>Proceed to Order</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </aside>
  );
};

export default CartPanel;
