import PageTitle from './PageTitle';
import OrderHeader from './OrderHeader';
import InfoCards from './InfoCards';
import OrderTable from './OrderTable';
import PaymentInfo from './PaymentInfo';
import NotesSection from './NotesSection';

const OrderDetailPage = ({ order, onBack }) => {
  return (
    <div className="orders-detail-page">
      <PageTitle order={order} />
      <OrderHeader order={order} onBack={onBack} />
      <InfoCards order={order} />

      <div className="row col-8-4">
        <div className="col-main">
          <OrderTable order={order} />
        </div>
        <div className="col-side">
          <PaymentInfo order={order} />
          <NotesSection />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
