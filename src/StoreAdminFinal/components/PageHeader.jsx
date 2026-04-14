// ===========================================
//  src/components/PageHeader.jsx
//  Page title and subtitle for orders list
// ===========================================

const PageHeader = ({ selectedDate }) => {
  const subtitle = selectedDate
    ? `Showing orders for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })}`
    : 'Manage and track all customer orders';

  return (
    <div className="content-header">
      <h2 className="page-title">Order List</h2>
      <p className="page-subtitle">{subtitle}</p>
    </div>
  );
};

export default PageHeader;
