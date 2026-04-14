// ===========================================
//  src/components/OrdersToolbar.jsx
//  Filters and controls for orders list
// ===========================================

import OrdersCalendar from './OrdersCalendar';
import { Icon, icons } from './Icons';

const OrdersToolbar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  showCount,
  setShowCount,
  selectedDate,
  setSelectedDate,
  allOrders,
  filteredCount,
}) => {
  return (
    <>
      <div className="orders-toolbar">
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="button" className="search-btn">
            <span className="material-icons" style={{ fontSize: 20 }}>search</span>
          </button>
        </div>

        <select
          className="form-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ minWidth: 140 }}
        >
          <option value="All">Status</option>
          <option value="Received">Received</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          className="form-select"
          value={showCount}
          onChange={e => setShowCount(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <option value="20">Show 20</option>
          <option value="30">Show 30</option>
          <option value="40">Show 40</option>
        </select>

        <OrdersCalendar
          orders={allOrders}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        <div className="orders-results-count">
          {filteredCount} results
        </div>
      </div>

      {selectedDate && (
        <div style={{ padding: '10px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Filtered by:</span>
          <div className="cal-active-tag">
            <Icon d={icons.calIcon} size={12} />
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
            <button onClick={() => setSelectedDate(null)} title="Clear date filter" style={{ marginLeft: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersToolbar;
