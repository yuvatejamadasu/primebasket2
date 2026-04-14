function PageTitle({ order }) {
  return (
    <div className="content-header" style={{ marginBottom: 24 }}>
      <div>
        <h2>Order detail</h2>
        <p>Details for Order ID: {order.id}</p>
      </div>
    </div>
  );
}

export default PageTitle;
