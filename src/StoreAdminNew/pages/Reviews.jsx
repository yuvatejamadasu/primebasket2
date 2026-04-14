import React, { useEffect, useMemo, useState } from 'react';
import { useReviews } from '../context/ReviewsContext';

const StarRating = ({ rating, editable = false, onChange }) => (
  <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => editable && onChange && onChange(star)}
        style={{
          fontSize: 15,
          color: star <= rating ? '#f59e0b' : 'var(--border-color)',
          cursor: editable ? 'pointer' : 'default',
          lineHeight: 1,
        }}
      >
        ★
      </span>
    ))}
  </div>
);

const StatusBadge = ({ status }) => {
  const active = status === 'active';
  return (
    <span className={`badge ${active ? 'badge-success' : 'badge-danger'}`} style={{ textTransform: 'capitalize' }}>
      {active ? 'Active' : 'Disabled'}
    </span>
  );
};

const DetailModal = ({ review, onClose }) => {
  if (!review) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          boxShadow: 'var(--shadow-md)',
          padding: 24,
          color: 'var(--text-primary)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20 }}>Review Detail</h3>
            <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>Review detail and status summary.</p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Review ID</span>
            <strong>#{review.id}</strong>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product</span>
            <strong>{review.product}</strong>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reviewer</span>
            <strong>{review.name}</strong>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rating</span>
            <StarRating rating={review.rating} />
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</span>
            <span>{review.date}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
            <StatusBadge status={review.status} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 22 }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const EditModal = ({ review, onClose, onSave }) => {
  const [product, setProduct] = useState(review?.product || '');
  const [name, setName] = useState(review?.name || '');
  const [rating, setRating] = useState(review?.rating || 3);
  const [status, setStatus] = useState(review?.status || 'active');

  useEffect(() => {
    if (review) {
      setProduct(review.product);
      setName(review.name);
      setRating(review.rating);
      setStatus(review.status);
    }
  }, [review]);

  if (!review) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          boxShadow: 'var(--shadow-md)',
          padding: 24,
          color: 'var(--text-primary)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20 }}>Edit Review</h3>
            <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>Update review details and save changes.</p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Product</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="form-control"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Reviewer</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Rating</label>
            <StarRating rating={rating} editable onChange={setRating} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select"
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ flex: 1, minWidth: 120 }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...review, product: product.trim(), name: name.trim(), rating, status })}
            className="btn btn-primary"
            style={{ flex: 1, minWidth: 120 }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  const { reviews, updateReview, deleteReview } = useReviews();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilter, setShowFilter] = useState('all');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailReview, setDetailReview] = useState(null);
  const [editReview, setEditReview] = useState(null);

  const filteredReviews = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchSearch =
        !normalizedSearch ||
        review.product.toLowerCase().includes(normalizedSearch) ||
        review.name.toLowerCase().includes(normalizedSearch);

      let matchStatus = true;
      if (statusFilter !== 'all') {
        matchStatus = review.rating === Number(statusFilter);
      }

      const matchShow = showFilter === 'all' || review.status === showFilter;
      return matchSearch && matchStatus && matchShow;
    });
  }, [reviews, searchTerm, statusFilter, showFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / perPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedReviews = filteredReviews.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const activeReviews = reviews.filter((review) => review.status === 'active').length;
  const disabledReviews = reviews.filter((review) => review.status === 'disabled').length;

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(id);
    }
  };

  const handleSave = (updatedReview) => {
    updateReview(updatedReview);
    setEditReview(null);
  };

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {detailReview && <DetailModal review={detailReview} onClose={() => setDetailReview(null)} />}
      {editReview && <EditModal review={editReview} onClose={() => setEditReview(null)} onSave={handleSave} />}

      <div className="content-header">
        <div>
          <h2>Reviews</h2>
          <p>Manage customer review feedback and ratings in the dashboard.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 0 }}>
        {[
          { label: 'Total Reviews', value: totalReviews, icon: '📝' },
          { label: 'Average Rating', value: `${averageRating} / 5`, icon: '⭐' },
          { label: 'Active', value: activeReviews, icon: '✅' },
          { label: 'Disabled', value: disabledReviews, icon: '⛔' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div
              className="stat-icon"
              style={{
                minWidth: 52,
                minHeight: 52,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--primary-light)',
                fontSize: 22,
              }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <h6>{stat.label}</h6>
              <span className="value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ paddingBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 240, maxWidth: 420 }}>
              <div className="filter-bar">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by product or reviewer"
                  className="form-control"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div className="filter-bar" style={{ justifyContent: 'flex-end', flex: 1, minWidth: 320 }}>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="form-select"
              >
                <option value="all">All stars</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
              <select
                value={showFilter}
                onChange={(e) => { setShowFilter(e.target.value); setCurrentPage(1); }}
                className="form-select"
              >
                <option value="all">Show all</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="form-select"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={30}>30 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: 'var(--table-header)' }}>
                  <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)' }}>ID</th>
                  <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)' }}>Product</th>
                  <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)' }}>Reviewer</th>
                  <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)' }}>Rating</th>
                  <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  paginatedReviews.map((review) => (
                    <tr key={review.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-primary)' }}>{review.id}</td>
                      <td style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-primary)' }}>{review.product}</td>
                      <td style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-primary)' }}>{review.name}</td>
                      <td style={{ padding: '16px 18px', fontSize: 13 }}><StarRating rating={review.rating} /></td>
                      <td style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>{review.date}</td>
                      <td style={{ padding: '16px 18px' }}><StatusBadge status={review.status} /></td>
                      <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setDetailReview(review)}
                            className="btn btn-xs"
                            style={{ background: '#1d5ba0', borderColor: '#1d5ba0' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditReview(review)}
                            className="btn btn-outline btn-xs"
                            style={{ padding: '6px 10px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="btn btn-outline btn-xs"
                            style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'rgba(220, 82, 82, 0.35)' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination" style={{ justifyContent: 'flex-end', padding: '18px' }}>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
