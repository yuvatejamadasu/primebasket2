// ===========================================
//  src/components/OrdersPage.jsx
//  Dashboard order list page
// ===========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import OrdersToolbar from './OrdersToolbar';
import OrdersTable from './OrdersTable';
import Pagination from './Pagination';
import FilterSidebar from './FilterSidebar';
import { ordersData } from '../data/ordersData';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCount, setShowCount] = useState('20');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = ordersData.filter(order => {
    const query = search.toLowerCase();
    const matchText = order.customer.toLowerCase().includes(query) || String(order.id).includes(query);
    const matchStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchDate = !selectedDate || order.isoDate === selectedDate;
    return matchText && matchStatus && matchDate;
  });

  return (
    <div className="orders-page">
      <PageHeader selectedDate={selectedDate} />

      <div className="row col-8-4">
        <div className="col-main">
          <div className="card orders-table-card">
            <div className="card-body">
              <OrdersToolbar
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                showCount={showCount}
                setShowCount={setShowCount}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                allOrders={ordersData}
                filteredCount={filteredOrders.length}
              />
              <OrdersTable
                orders={filteredOrders}
                onViewDetail={(order) => navigate(`/orders/${order.id}`)}
              />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Pagination currentPage={currentPage} totalPages={4} onPageChange={setCurrentPage} />
          </div>
        </div>

        <div className="col-side">
          <FilterSidebar />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
