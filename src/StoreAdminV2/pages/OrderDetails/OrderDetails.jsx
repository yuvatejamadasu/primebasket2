import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Truck, MapPin, CreditCard, 
  FileText, Printer, Save, CheckCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useFetch from '../../hooks/useFetch';
import DataState from '../../components/DataState';
import { API } from '../../config/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const formattedId = id?.startsWith('#') ? id : `#${id}`;

  const { data: ordersData, loading, error } = useFetch(API.ORDERS, '/data/orders.json');
  const allOrders = Array.isArray(ordersData) ? ordersData : (ordersData?.orders ?? []);

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (allOrders.length > 0 && formattedId) {
      const foundOrder = allOrders.find(o => o.id === formattedId);
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Mock items to match the image style/variety
        const mockItems = [
          { name: 'Haagen-Dazs Caramel Cone Ice', unitPrice: 44.25, qty: 2, total: 88.50 },
          { name: 'Seeds of Change Organic', unitPrice: 7.50, qty: 2, total: 15.00 },
          { name: 'All Natural Italian-Style', unitPrice: 43.50, qty: 2, total: 87.00 },
          { name: 'Sweet & Salty Kettle Corn', unitPrice: 99.00, qty: 3, total: 297.00 }
        ];
        // Only use mock items if it's the specific order from image, otherwise randomize or use order count
        setItems(mockItems);
      }
    }
  }, [allOrders, formattedId]);

  const handleSave = () => {
    alert("Order details saved successfully!");
  };

  if (loading) return <DataState loading={true} />;
  if (error || !order) return <DataState error={error || 'Order not found'} />;

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const shipping = 10.00;
  const grandTotal = subtotal + shipping;

  // Status mapping to match image
  const displayStatus = order.status === 'Delivered' ? 'Received' : order.status;

  const cardClass = `rounded-xl border shadow-sm transition-all duration-300 ${
    isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-200'
  }`;

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* ─── Top Bar ────────────────────────────────────────────────────────── */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <button 
          onClick={() => navigate('/store-dashboard/orders')}
          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
            isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Back to orders
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            Save
          </button>
          <button 
            onClick={() => window.print()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* ─── Order Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 px-1">
        <p className={`text-[11px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Ordered on {order.date}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {order.id.replace('#ORD-', '')}
          </h2>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
            displayStatus === 'Received' 
              ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
              : (isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600')
          }`}>
            {displayStatus}
          </span>
        </div>
      </div>

      {/* ─── Info Head Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer */}
        <div className={cardClass}>
          <div className="p-5 flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-800 text-brand' : 'bg-brand-light text-brand'}`}>
              <User size={20} />
            </div>
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Customer</p>
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{order.storeName}</h4>
              <p className={`text-xs font-medium mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No email provided</p>
              <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Phone: +1 800 555 0052</p>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className={cardClass}>
          <div className="p-5 flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-800 text-brand' : 'bg-brand-light text-brand'}`}>
              <Truck size={20} />
            </div>
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Order Info</p>
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Shipping: Fast delivery</h4>
              <p className={`text-xs font-medium mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pay method: Card</p>
              <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status: {displayStatus}</p>
            </div>
          </div>
        </div>

        {/* Deliver To */}
        <div className={cardClass}>
          <div className="p-5 flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-800 text-brand' : 'bg-brand-light text-brand'}`}>
              <MapPin size={20} />
            </div>
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Deliver To</p>
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>New York City</h4>
              <p className={`text-xs font-medium mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                123 Main Street, Apt 4B<br />United States
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Table */}
        <div className={`xl:col-span-8 rounded-xl border overflow-hidden ${
          isDark ? 'bg-[#2c3136] border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isDark ? 'bg-slate-800/30' : 'bg-slate-50/50 text-slate-500'}>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-center">Unit Price</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-center">Quantity</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-right pr-12">Total</th>
                </tr>
              </thead>
              <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className={`px-6 py-4 text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.name}</td>
                    <td className={`px-6 py-4 text-xs font-bold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>${item.unitPrice.toFixed(2)}</td>
                    <td className={`px-6 py-4 text-xs font-bold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.qty}</td>
                    <td className={`px-6 py-4 text-xs font-black text-right pr-12 ${isDark ? 'text-white' : 'text-slate-800'}`}>${item.total.toFixed(2)}</td>
                  </tr>
                ))}
                
                {/* Summary Rows */}
                <tr className="border-t border-slate-100 dark:border-slate-700">
                  <td colSpan="3" className={`px-6 py-3 text-xs font-bold text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Subtotal</td>
                  <td className={`px-6 py-3 text-xs font-black text-right pr-12 ${isDark ? 'text-white' : 'text-slate-800'}`}>${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className={`px-6 py-3 text-xs font-bold text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Shipping</td>
                  <td className={`px-6 py-3 text-xs font-black text-right pr-12 ${isDark ? 'text-white' : 'text-slate-800'}`}>${shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className={`px-6 py-3 text-sm font-bold text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Grand total</td>
                  <td className={`px-6 py-3 text-sm font-black text-right pr-12 ${isDark ? 'text-white' : 'text-slate-800'}`}>${grandTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className={`px-6 py-4 text-xs font-bold text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Payment status</td>
                  <td className="px-6 py-4 text-right pr-12">
                    <span className="text-xs font-bold text-emerald-600">Paid</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          {/* Payment Info */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <h5 className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Payment Info</h5>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <CreditCard size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Master Card **** **** 4768</p>
                  <p className={`text-[10px] font-bold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Business name: Grand Market LLC</p>
                </div>
              </div>
              <p className={`text-[11px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Phone: +1 800 555-0154-52</p>
            </div>
          </div>

          {/* Notes */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <h5 className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Notes</h5>
            </div>
            <div className="p-6">
              <textarea 
                placeholder="Type some note"
                className={`w-full h-24 p-4 rounded-xl text-xs font-bold outline-none transition-all resize-none border ${
                  isDark ? 'bg-slate-800/40 border-slate-700 text-slate-200 focus:border-brand' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-brand'
                }`}
              />
              <button 
                className="w-full py-2.5 mt-4 rounded-lg bg-brand hover:bg-brand-hover text-white text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-brand-light"
              >
                Save note
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
