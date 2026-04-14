import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/productPagesData';

export default function Categories() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase()) ||
      category.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div>
      <div className="content-header">
        <div>
          <h2>Categories</h2>
          <p>Manage product categories inside the dashboard theme.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => navigate('/products/grid')}>
            <span className="material-icons" style={{ fontSize: 18 }}> </span>
           Products
          </button>
          <div style={{ minWidth: 240 }}>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', minWidth: 240 }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 44, textAlign: 'center' }}><input type="checkbox" className="form-check-input" /></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Slug</th>
                  <th>Order</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td style={{ textAlign: 'center' }}><input type="checkbox" className="form-check-input" /></td>
                    <td>{category.id}</td>
                    <td><strong>{category.name}</strong></td>
                    <td>{category.description}</td>
                    <td>{category.slug}</td>
                    <td>{category.order}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }}>View</button>
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }}>Edit</button>
                        <button className="btn btn-outline" style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'rgba(220,82,82,0.35)' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
