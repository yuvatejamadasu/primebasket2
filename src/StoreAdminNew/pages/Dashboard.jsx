import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../ThemeContext';
import { Plus, DollarSign, Truck, Package, ShoppingBag, CreditCard, UserPlus, PlayCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const members = [
  { name: 'Neal Matthews', email: 'neal@example.com', color: 'bg-blue-100 text-blue-600' },
  { name: 'Jamal Burnett', email: 'jamal@example.com', color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Juan Mitchell', email: 'juan@example.com', color: 'bg-amber-100 text-amber-600' },
  { name: 'Barry Dick', email: 'barry@example.com', color: 'bg-purple-100 text-purple-600' },
  { name: 'Ronald Taylor', email: 'ronald@example.com', color: 'bg-pink-100 text-pink-600' },
];

const timelineEvents = [
  { date: '27 Mar', text: 'Markup changes for any page where template header item active' },
  { date: '26 Mar', text: 'Responded to need "Volunteer Activities"' },
  { date: '25 Mar', text: 'Reviewed order details and issued refund to #SK2544' },
  { date: '24 Mar', text: 'Updated product inventory for Electronics category' },
];

const marketingChannels = [
  { label: 'Facebook', pct: 15, color: '#1d5ba0' },
  { label: 'Instagram', pct: 65, color: '#ec4899' },
  { label: 'Google', pct: 51, color: '#f59e0b' },
  { label: 'Twitter', pct: 80, color: '#06b6d4' },
  { label: 'Other', pct: 30, color: '#8b5cf6' },
];

const orders = [
  { id: '#SK2540', name: 'Neal Matthews', date: '07 Oct, 2021', total: '₹400', status: 'Paid', method: 'Mastercard' },
  { id: '#SK2541', name: 'Jamal Burnett', date: '07 Oct, 2021', total: '₹380', status: 'Chargeback', method: 'Visa' },
  { id: '#SK2542', name: 'Juan Mitchell', date: '06 Oct, 2021', total: '₹384', status: 'Paid', method: 'Paypal' },
  { id: '#SK2543', name: 'Barry Dick', date: '05 Oct, 2021', total: '₹412', status: 'Paid', method: 'Mastercard' },
  { id: '#SK2544', name: 'Ronald Taylor', date: '04 Oct, 2021', total: '₹404', status: 'Refund', method: 'Visa' },
  { id: '#SK2545', name: 'Jacob Hunter', date: '04 Oct, 2021', total: '₹392', status: 'Paid', method: 'Paypal' },
];

const StatCard = ({ icon, label, value, subtext, colorClass, isDark }) => (
  <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
    isDark ? 'bg-[#2c3136] border-slate-700/50 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[13px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
        <h4 className={`text-2xl font-black mt-0.5 tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</h4>
        <p className={`text-[11px] mt-1 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtext}</p>
      </div>
    </div>
  </div>
);

const getStatusBadge = (status) => {
  if (status === 'Paid') return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
  if (status === 'Chargeback') return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
  if (status === 'Refund') return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
  return 'bg-slate-100 text-slate-500 border border-slate-200';
};

const Dashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [tableOrders, setTableOrders] = useState(orders.map(o => ({ ...o, checked: false })));
  const [allChecked, setAllChecked] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('Status');

  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [8200, 9400, 7800, 11200, 10400, 13800, 12100, 14200, 11600, 15800, 13200, 17400],
        borderColor: '#1d5ba0',
        backgroundColor: 'rgba(29, 91, 160, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1d5ba0',
        pointRadius: 3,
        hoverRadius: 6,
      },
      {
        label: 'Orders',
        data: [5200, 6100, 5400, 7800, 7200, 9200, 8400, 9800, 8100, 10200, 9400, 11800],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointRadius: 3,
        hoverRadius: 6,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: textColor, font: { weight: 'bold', size: 12 }, usePointStyle: true, padding: 20 } },
      tooltip: { mode: 'index', intersect: false, backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: isDark ? '#f1f5f9' : '#1e293b', bodyColor: isDark ? '#cbd5e1' : '#475569', borderColor: isDark ? '#334155' : '#e2e8f0', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11, weight: '600' } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11, weight: '600' }, callback: v => '₹' + (v/1000).toFixed(0) + 'k' } },
    },
  };

  const donutData = {
    labels: ['US', 'Europe', 'Asian', 'Africa', 'Other'],
    datasets: [{
      data: [35, 25, 18, 12, 10],
      backgroundColor: ['#1d5ba0', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: textColor, font: { weight: 'bold', size: 12 }, padding: 20, usePointStyle: true } },
    },
    cutout: '70%',
  };

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    setTableOrders(o => o.map(r => ({ ...r, checked: next })));
  };

  const toggleRow = (id) => {
    setTableOrders(o => o.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const filteredOrders = tableOrders.filter(o => {
    if (filterStatus !== 'Status' && filterStatus !== 'All' && o.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-8 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Store Dashboard</h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium mt-1`}>Whole data about your business here</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-all active:scale-95 shadow-sm text-sm">
          <Plus size={18} />
          Create report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard isDark={isDark} icon={<DollarSign size={24} className="text-brand" />} label="Revenue" value="₹13,456.5" subtext="Shipping fees not included" colorClass="bg-brand/10" />
        <StatCard isDark={isDark} icon={<Truck size={24} className="text-emerald-500" />} label="Orders" value="53,668" subtext="Excluding orders in transit" colorClass="bg-emerald-500/10" />
        <StatCard isDark={isDark} icon={<Package size={24} className="text-amber-500" />} label="Products" value="9,856" subtext="In 19 Categories" colorClass="bg-amber-500/10" />
        <StatCard isDark={isDark} icon={<ShoppingBag size={24} className="text-sky-500" />} label="Monthly Earning" value="₹6,982" subtext="Based on your local time" colorClass="bg-sky-500/10" />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sale Statistics */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h5 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Sale Statistics</h5>
            <div className="h-[320px]">
              <Line data={salesData} options={salesOptions} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* New Members */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
              <h5 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>New Members</h5>
              <div className="space-y-5">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${m.color}`}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <h6 className={`text-sm font-bold truncate ${isDark ? 'text-slate-200 group-hover:text-brand' : 'text-slate-800 group-hover:text-brand'} transition-colors`}>{m.name}</h6>
                        <p className={`text-xs truncate font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.email}</p>
                      </div>
                      <button className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDark ? 'bg-slate-800 text-brand hover:bg-brand hover:text-white' : 'bg-brand/10 text-brand hover:bg-brand hover:text-white'}`}>
                        <UserPlus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
              <h5 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Activity</h5>
              <div className="ml-2 relative border-l-2 border-dashed border-slate-200 dark:border-slate-700 space-y-6 pb-2">
                {timelineEvents.map((ev, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[11px] top-1 bg-white dark:bg-[#2c3136] rounded-full">
                      <PlayCircle size={20} className="text-brand" fill="#1d5ba020" />
                    </div>
                    <div className={`text-xs font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-brand'}`}>{ev.date}</div>
                    <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{ev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-8">
          {/* Revenue By Area */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h5 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Revenue By Area</h5>
            <div className="h-[280px]">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </div>

          {/* Marketing Channel */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h5 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Marketing Channel</h5>
            <div className="space-y-5">
              {marketingChannels.map((ch, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{ch.label}</span>
                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{ch.pct}%</span>
                  </div>
                  <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${ch.pct}%`, backgroundColor: ch.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Orders Table */}
      <div className={`rounded-2xl border transition-all duration-300 hover:shadow-xl overflow-hidden ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Latest Orders</h4>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className={`text-sm font-bold px-3 py-2 rounded-xl border outline-none focus:border-brand focus:ring-1 focus:ring-brand ${isDark ? 'bg-[#212529] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              {["All Categories","Women's Clothing","Men's Clothing","Cellphones","Computer & Office","Consumer Electronics","Jewelry & Accessories","Home & Garden"].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className={`text-sm font-bold px-3 py-2 rounded-xl border outline-none focus:border-brand focus:ring-1 focus:ring-brand ${isDark ? 'bg-[#212529] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              {['Status','All','Paid','Chargeback','Refund'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isDark ? 'bg-slate-800/30' : 'bg-slate-50/50'}>
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded-sm accent-brand w-4 h-4 cursor-pointer" checked={allChecked} onChange={toggleAll} />
                </th>
                {['Order ID', 'Billing Name', 'Date', 'Total', 'Payment Status', 'Payment Method', 'Action'].map(h => (
                  <th key={h} className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
              {filteredOrders.map(o => (
                <tr key={o.id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'}`}>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded-sm accent-brand w-4 h-4 cursor-pointer" checked={o.checked} onChange={() => toggleRow(o.id)} />
                  </td>
                  <td className="px-6 py-4">
                    <Link to="/store-dashboard/orders" className={`text-xs font-bold hover:underline ${isDark ? 'text-brand-lightdark' : 'text-brand'}`}>{o.id}</Link>
                  </td>
                  <td className={`px-6 py-4 text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{o.name}</td>
                  <td className={`px-6 py-4 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{o.date}</td>
                  <td className={`px-6 py-4 text-[13px] font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{o.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <CreditCard size={14} className="opacity-60" /> {o.method}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => navigate('/store-dashboard/orders')} className="bg-brand hover:bg-brand-hover text-white text-[11px] font-bold py-1.5 px-4 rounded-lg transition-all active:scale-95 shadow-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Details within Table Card */}
        <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-slate-700/50 bg-[#212529]/30' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex items-center gap-1.5">
            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><ChevronLeft size={16} /></button>
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${n === 1 ? 'bg-brand border-brand text-white shadow-sm' : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800')}`}>{n}</button>
            ))}
            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><ChevronRight size={16} /></button>
          </div>
          <p className={`text-xs font-bold tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Showing 6 of {tableOrders.length} items</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
