import React from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="content-header">
        <div>
          <h2>Products</h2>
          <p>Manage your product catalog in the dashboard theme.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => navigate('/store-dashboard/products/list')}>
            <span className="material-icons" style={{ fontSize: 18 }}>view_list</span>
            Product List
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/store-dashboard/products/categories')}>
            <span className="material-icons" style={{ fontSize: 18 }}>category</span>
            Categories
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <p style={{ margin: 0 }}>
            Use the routed product pages to move between the product grid, product list, and
            category management screens.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products;

