import React, { useState } from 'react';
import { 
  Truck, LayoutGrid, MapPin, AlertTriangle, MessageSquare, 
  Users, Banknote, CheckCircle, ClipboardList, Headset,
  ArrowUp, ArrowDown, Download, Plus, Search, Calendar, ArrowLeft, ArrowRight, Star, ExternalLink, ShieldCheck, Map, Store,
  Phone, Gavel, History, FileText, CreditCard, Edit2, PauseCircle, Slash
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import DataState from '../components/DataState';
import { API } from '../config/api';

const TABS = [
  { id: 'overview', icon: <LayoutGrid size={18} />, label: 'Overview' },
  { id: 'orders', icon: <Truck size={18} />, label: 'Delivery Orders' },
  { id: 'locations', icon: <MapPin size={18} />, label: 'Locations' },
  { id: 'issues', icon: <AlertTriangle size={18} />, label: 'Queries & Issues' },
  { id: 'feedback', icon: <MessageSquare size={18} />, label: 'Customer Feedback' },
  { id: 'partners', icon: <Users size={18} />, label: 'Partners' },
];

const DeliveryPartners = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [queryStatusFilter, setQueryStatusFilter] = useState('All Status');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [profileTab, setProfileTab] = useState('Overview');

  const { data: deliveryData, loading, error } = useFetch(API.DELIVERY_PARTNERS, '/data/delivery_partners.json');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedPartner]);

  const kpis = [
    { 
      label: 'Total Earnings', 
      value: deliveryData?.kpi?.[0]?.value || '₹0', 
      change: deliveryData?.kpi?.[0]?.change || '0%', 
      up: deliveryData?.kpi?.[0]?.up ?? true,
      sub: deliveryData?.kpi?.[0]?.sub || 'Total payouts',
      icon: <Banknote size={22} className="text-brand" />,
      bg: 'bg-brand/10'
    },
    { 
      label: 'Delivered', 
      value: deliveryData?.kpi?.[1]?.value || '0', 
      change: deliveryData?.kpi?.[1]?.change || '0%', 
      up: deliveryData?.kpi?.[1]?.up ?? true,
      sub: deliveryData?.kpi?.[1]?.sub || 'Successfully completed',
      icon: <CheckCircle size={22} className="text-emerald-500" />,
      bg: 'bg-emerald-500/10'
    },
    { 
      label: 'Pending', 
      value: deliveryData?.kpi?.[2]?.value || '0', 
      change: deliveryData?.kpi?.[2]?.change || '0%', 
      up: deliveryData?.kpi?.[2]?.up ?? false,
      sub: deliveryData?.kpi?.[2]?.sub || 'Awaiting delivery',
      icon: <ClipboardList size={22} className="text-violet-500" />,
      bg: 'bg-violet-500/10'
    },
    { 
      label: 'Open Queries', 
      value: deliveryData?.kpi?.[3]?.value || '0', 
      change: deliveryData?.kpi?.[3]?.change || '0%', 
      up: deliveryData?.kpi?.[3]?.up ?? false,
      sub: deliveryData?.kpi?.[3]?.sub || 'Customer complaints',
      icon: <Headset size={22} className="text-rose-500" />,
      bg: 'bg-rose-500/10'
    }
  ];

  const statuses = ['All Status', 'Delivered', 'Pending', 'In Transit', 'Failed'];

  const filteredOrders = (deliveryData?.allDeliveryOrders || []).filter(order => {
    const matchSearch = order.id.toLowerCase().includes(ordersSearch.toLowerCase()) || 
                       order.customer.toLowerCase().includes(ordersSearch.toLowerCase()) ||
                       order.product.toLowerCase().includes(ordersSearch.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || order.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.bg}`}>{kpi.icon}</div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                kpi.up ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
              }`}>
                {kpi.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {kpi.change}
              </div>
            </div>
            <div>
              <h4 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{kpi.value}</h4>
              <p className={`text-xs font-bold mt-1 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{kpi.label}</p>
              <p className={`text-[10px] font-semibold mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className={`text-lg font-black mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>Earnings & Deliveries Trend</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deliveryData?.trend}>
                <defs>
                  <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="delGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f1f5f9'} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(v) => `₹${v/1000}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1a1d21' : '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                />
                <Legend verticalAlign="top" align="center" iconType="rect" wrapperStyle={{ paddingBottom: '20px' }} />
                <Area yAxisId="left" type="monotone" name="Earnings (₹)" dataKey="earnings" stroke="#1e40af" strokeWidth={3} fill="url(#earnGrad)" dot={{ r: 4, fill: '#1e40af' }} />
                <Area yAxisId="right" type="monotone" name="Deliveries" dataKey="deliveries" stroke="#10b981" strokeWidth={3} fill="url(#delGrad)" dot={{ r: 4, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className={`text-lg font-black mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>Feedback Ratings</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deliveryData?.feedback} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={5} dataKey="value">
                  {(deliveryData?.feedback || []).map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a1d21' : '#fff', borderRadius: '16px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {(deliveryData?.feedback || []).map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.name}</span>
                </div>
                <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Deliveries & Regional row */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Deliveries</h3>
          <button 
            onClick={() => setActiveTab('orders')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand-light"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <th className="pb-4 pl-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Product</th>
                <th className="pb-4">Location</th>
                <th className="pb-4 pr-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {(deliveryData?.recentDeliveries || []).map((order) => (
                <tr key={order.id} className="transition-colors">
                  <td className={`py-4 pl-4 text-sm font-black ${isDark ? 'text-brand' : 'text-brand'}`}>{order.id}</td>
                  <td className={`py-4 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{order.customer}</td>
                  <td className={`py-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{order.product}</td>
                  <td className={`py-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-brand" />
                      {order.location}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                      order.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' :
                      'bg-blue-50 text-blue-600 dark:bg-blue-500/10'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Open Queries</h3>
            <button 
              onClick={() => setActiveTab('issues')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand-light"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {(deliveryData?.openQueries || []).map((query) => (
              <div key={query.id} className={`p-5 rounded-xl border relative ${isDark ? 'bg-[#212529] border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
                <span className={`absolute top-4 right-4 px-2 py-1 rounded-md text-[9px] font-black tracking-widest ${
                  query.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  {query.priority}
                </span>
                <p className={`text-sm font-black text-brand mb-1`}>{query.id}</p>
                <p className={`text-sm font-bold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{query.issue}</p>
                <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400">
                  <div className="flex items-center gap-1.5"><Users size={14} /> {query.customer}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {query.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Deliveries by Location</h3>
            <button 
              onClick={() => setActiveTab('locations')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand-light"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-8">
            {(deliveryData?.locationStats || []).map((item) => (
              <div key={item.name} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}><Store size={14} className="text-brand" /></div>
                    <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.name}</span>
                  </div>
                  <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.value}</span>
                </div>
                <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className="h-full bg-brand rounded-full transition-all duration-1000 ease-out" style={{ width: `${(item.value / item.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveryOrders = () => (
    <div className={`p-6 rounded-xl border animate-fade-in w-full ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>All Delivery Orders</h3>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Table */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search orders..." value={ordersSearch} onChange={e => setOrdersSearch(e.target.value)}
              className={`pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold outline-none transition-all w-full md:w-56 ${
                isDark ? 'bg-[#212529] border-slate-700 text-white focus:border-brand shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-brand shadow-inner'
              }`}
            />
          </div>
          {/* Filters */}
          {[
            { val: statusFilter, set: setStatusFilter, opts: statuses }
          ].map((f, i) => (
            <select
              key={i} value={f.val} onChange={e => f.set(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold outline-none transition-all cursor-pointer ${
                isDark ? 'bg-[#212529] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px] w-full">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <th className="pb-4 px-3 min-w-[100px]">Order ID</th>
              <th className="pb-4 px-3">Customer</th>
              <th className="pb-4 px-3">Product</th>
              <th className="pb-4 px-3">Location</th>
              <th className="pb-4 px-3 min-w-[110px]">Order Date</th>
              <th className="pb-4 px-3 min-w-[110px]">Delivery Date</th>
              <th className="pb-4 px-3 min-w-[90px]">Amount</th>
              <th className="pb-4 px-3">Partner</th>
              <th className="pb-4 px-3 text-center min-w-[100px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <tr key={order.id} className="transition-colors">
                <td className="py-4 px-3 text-sm font-black text-brand whitespace-nowrap">{order.id}</td>
                <td className={`py-4 px-3 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{order.customer}</td>
                <td className={`py-4 px-3 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{order.product}</td>
                <td className={`py-4 px-3 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <div className="flex items-center gap-2"><MapPin size={13} className="text-brand opacity-60 flex-shrink-0" /> {order.location}</div>
                </td>
                <td className={`py-4 px-3 text-[13px] font-bold whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{order.orderDate}</td>
                <td className={`py-4 px-3 text-[13px] font-bold whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{order.deliveryDate}</td>
                <td className={`py-4 px-3 text-sm font-black whitespace-nowrap ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{order.amount}</td>
                <td className={`py-4 px-3 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{order.partner}</td>
                <td className="py-4 px-3 text-center whitespace-nowrap">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${
                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                    order.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' :
                    order.status === 'Failed' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' :
                    'bg-orange-50 text-orange-600 dark:bg-orange-500/10'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="py-20 text-center font-bold text-slate-400">No orders found matching filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={`mt-8 pt-6 border-t flex items-center justify-between ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
        <p className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Showing {filteredOrders.length} of {(deliveryData?.allDeliveryOrders || []).length} orders
        </p>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div className="space-y-6 animate-fade-in">
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h3 className={`text-lg font-black mb-12 ${isDark ? 'text-white' : 'text-slate-800'}`}>Deliveries by City</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deliveryData?.locationStats || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: isDark ? '#94a3b8' : '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: isDark ? '#94a3b8' : '#64748b' }} />
              <Tooltip 
                cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
                contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" align="center" iconType="rect" iconSize={12} wrapperStyle={{ paddingBottom: '40px' }} />
              <Bar dataKey="delivered" name="Delivered" fill="#1e40af" radius={[4, 4, 0, 0]} barSize={50} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={50} />
              <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h3 className={`text-lg font-black mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>Location-wise Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <th className="pb-4 px-3">City</th>
                <th className="pb-4 px-3">Delivered</th>
                <th className="pb-4 px-3">Pending</th>
                <th className="pb-4 px-3 text-rose-500">Failed</th>
                <th className="pb-4 px-3">Total</th>
                <th className="pb-4 px-3 text-right">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {(deliveryData?.locationStats || []).map((loc) => (
                <tr key={loc.name} className="transition-colors">
                  <td className={`py-4 px-3 text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Store size={14} className="text-brand opacity-60" /> {loc.name}
                  </td>
                  <td className="py-4 px-3 text-sm font-bold text-emerald-500">{loc.delivered}</td>
                  <td className="py-4 px-3 text-sm font-bold text-amber-500">{loc.pending}</td>
                  <td className="py-4 px-3 text-sm font-bold text-rose-500">{loc.failed}</td>
                  <td className={`py-4 px-3 text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{loc.total}</td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3 min-w-[150px] justify-end">
                      <div className={`h-2 w-24 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className="h-full bg-brand rounded-full" style={{ width: `${(loc.delivered / loc.total) * 100}%` }} />
                      </div>
                      <span className={`text-xs font-black ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {((loc.delivered / (loc.total || 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQueries = () => (
    <div className={`p-6 rounded-xl border animate-fade-in w-full ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Customer Queries & Issues</h3>
        <select 
          value={queryStatusFilter} onChange={e => setQueryStatusFilter(e.target.value)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold outline-none transition-all cursor-pointer ${
            isDark ? 'bg-[#212529] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <option>All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <th className="pb-4 px-3">Query ID</th>
              <th className="pb-4 px-3">Order ID</th>
              <th className="pb-4 px-3">Customer</th>
              <th className="pb-4 px-3 min-w-[200px]">Issue Description</th>
              <th className="pb-4 px-3">Priority</th>
              <th className="pb-4 px-3">Assigned To</th>
              <th className="pb-4 px-3">Date</th>
              <th className="pb-4 px-3">Status</th>
              <th className="pb-4 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {(deliveryData?.openQueries || []).filter(q => queryStatusFilter === 'All Status' || q.status === queryStatusFilter).map((q) => (
              <tr key={q.id} className="transition-colors">
                <td className="py-4 px-3 text-sm font-black text-brand">{q.id}</td>
                <td className="py-4 px-3 text-sm font-bold text-brand hover:underline cursor-pointer">{q.orderId}</td>
                <td className={`py-4 px-3 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{q.customer}</td>
                <td className={`py-4 px-3 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{q.issue}</td>
                <td className="py-4 px-3 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                    q.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' :
                    q.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' :
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                  }`}>
                    {q.priority}
                  </span>
                </td>
                <td className={`py-4 px-3 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{q.assignedTo}</td>
                <td className={`py-4 px-3 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{q.date}</td>
                <td className="py-4 px-3 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-black border ${
                    q.status === 'Open' ? 'border-rose-200 text-rose-600 bg-rose-50/10' :
                    q.status === 'In Progress' ? 'border-amber-200 text-amber-600 bg-amber-50/10' :
                    'border-emerald-200 text-emerald-600 bg-emerald-50/10'
                  }`}>
                    {q.status}
                  </span>
                </td>
                <td className="py-4 px-3 text-center">
                  <button className="px-5 py-1.5 rounded-lg text-[11px] font-black bg-brand text-white hover:bg-brand-hover transition-all">
                    {q.status === 'Resolved' ? 'View' : 'Resolve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {(deliveryData?.feedbackData || []).map((f) => (
        <div key={f.id} className={`p-6 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-xs">{f.avatar}</div>
                <div>
                  <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{f.customer}</h4>
                  <p className="text-[10px] font-bold opacity-50">{f.orderId} • {f.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < f.rating ? "currentColor" : "none"} />)}
              </div>
            </div>
            <p className={`text-xs font-semibold leading-relaxed p-4 rounded-xl italic relative ${isDark ? 'bg-[#212529] text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
              <span className="absolute -left-1 top-4 h-5 w-1 bg-brand rounded-full opacity-30"></span>
              {f.comment}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <Truck size={12} className="text-brand opacity-60" />
            <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Delivered by</span>
            <span className={`text-[10px] font-black text-brand cursor-pointer hover:underline`}>{f.partner}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPartnersList = () => (
    <div className={`p-6 rounded-xl border animate-fade-in w-full ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>All Delivery Partners</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" placeholder="Search partners..." value={partnerSearch} onChange={e => setPartnerSearch(e.target.value)}
            className={`pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold w-[250px] outline-none transition-all ${
              isDark ? 'bg-[#212529] border-slate-700 text-white focus:border-brand shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-brand shadow-inner'
            }`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <th className="pb-4 px-3">ID</th>
              <th className="pb-4 px-3">Partner Name</th>
              <th className="pb-4 px-3">Contact</th>
              <th className="pb-4 px-3 text-center">Delivered</th>
              <th className="pb-4 px-3 text-center">Pending</th>
              <th className="pb-4 px-3 text-center text-rose-500">Failed</th>
              <th className="pb-4 px-3">Earnings</th>
              <th className="pb-4 px-3">Zone</th>
              <th className="pb-4 px-3 text-center">Rating</th>
              <th className="pb-4 px-3 text-center">Status</th>
              <th className="pb-4 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {(deliveryData?.partners || []).filter(p => p.name.toLowerCase().includes(partnerSearch.toLowerCase())).map((p) => (
              <tr key={p.id} className="transition-colors">
                <td className="py-4 px-3 text-[13px] font-black text-brand whitespace-nowrap">{p.id}</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-xs">{p.avatar}</div>
                    <span className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{p.name}</span>
                  </div>
                </td>
                <td className={`py-4 px-3 text-sm font-semibold opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.contact}</td>
                <td className="py-4 px-3 text-sm text-center font-black text-emerald-500">{p.delivered}</td>
                <td className="py-4 px-3 text-sm text-center font-bold text-amber-500">{p.pending}</td>
                <td className="py-4 px-3 text-sm text-center font-bold text-rose-500">{p.failed}</td>
                <td className={`py-4 px-3 text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{p.earnings}</td>
                <td className="py-4 px-3 text-xs font-bold opacity-70">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-brand opacity-60" /> {p.zone}
                  </div>
                </td>
                <td className="py-4 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="text-amber-400" fill="currentColor" />
                    <span className={`text-sm font-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{p.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-3 text-center">
                  <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black ${
                    p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                    'bg-orange-50 text-orange-600 dark:bg-orange-500/10'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-4 px-3 text-center">
                  <button 
                    onClick={() => setSelectedPartner(p)}
                    className="px-5 py-2 rounded-xl text-xs font-black bg-brand hover:bg-brand-hover text-white transition-all shadow-md shadow-brand-light"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPartnerOverview = (partner) => (
    <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-100">
      <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className="flex items-center gap-2 text-lg font-black mb-8 opacity-80"><ArrowUp size={20} className="text-emerald-500" /> Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Deliveries', value: partner.delivered, bg: 'bg-slate-50 dark:bg-slate-800/50' },
            { label: 'Completed Today', value: '12', bg: 'bg-slate-50 dark:bg-slate-800/50' },
            { label: 'Cancelled Orders', value: partner.failed, bg: 'bg-slate-50 dark:bg-slate-800/50' },
            { label: 'Avg Delivery Time', value: '28 mins', bg: 'bg-slate-50 dark:bg-slate-800/50' }
          ].map(stat => (
            <div key={stat.label} className={`p-6 rounded-xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 ${stat.bg}`}>
              <p className="text-[11px] font-bold opacity-50 uppercase tracking-widest mb-3">{stat.label}</p>
              <h5 className="text-2xl font-black">{stat.value}</h5>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          <h3 className="flex items-center gap-2 text-lg font-black mb-8 opacity-80"><Truck size={20} className="text-brand" /> Vehicle Details</h3>
          <div className="space-y-4">
            {[
              { label: 'Type', value: 'Bike' },
              { label: 'Vehicle Number', value: 'KA-01-HH-1234' },
              { label: 'License Number', value: 'KA04 2018xxxxxxx' },
              { label: 'Insurance', value: 'Active', color: 'text-emerald-500' }
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                <span className="text-xs font-bold opacity-60">{row.label}</span>
                <span className={`text-xs font-black ${row.color || (isDark ? 'text-slate-300' : 'text-slate-700')}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          <h3 className="flex items-center gap-2 text-lg font-black mb-8 opacity-80"><Map size={20} className="text-brand" /> Location Tracking</h3>
          <div className={`h-[180px] rounded-xl flex flex-col items-center justify-center text-center p-6 ${isDark ? 'bg-[#212529]' : 'bg-slate-50'}`}>
            <Map size={48} className="text-brand opacity-20 mb-4" />
            <h6 className="text-xs font-black opacity-30">Live Location Map</h6>
            <p className="text-[10px] font-bold opacity-20 mt-1">Last updated: Just now (Indiranagar)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPartnerOrders = (partner) => (
    <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-100">
      {/* Current Activity */}
      <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className="flex items-center gap-2 text-lg font-black mb-8 opacity-80"><ArrowRight size={20} className="text-brand" /> Current Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: '#ORD-4522', from: 'Koramangala', to: 'Indiranagar', time: '14 mins ago', status: 'In Transit', statusColor: 'bg-blue-50 text-blue-600 dark:text-blue-400' },
            { id: '#ORD-4523', from: 'HSR Layout', to: 'BTM Layout', time: '2 mins ago', status: 'Pickup', statusColor: 'bg-orange-50 text-orange-600 dark:text-orange-400' }
          ].map(order => (
            <div key={order.id} className={`p-6 rounded-2xl border ${isDark ? 'bg-[#212529] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-slate-800 dark:text-white">{order.id}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${order.statusColor} dark:bg-opacity-10`}>{order.status}</span>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
                <MapPin size={12} className="text-brand" /> {order.from} -&gt; {order.to}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mb-6 flex items-center gap-2">
                <Calendar size={12} /> Assigned {order.time}
              </p>
              <div className="flex items-center gap-3">
                <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all border ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} text-brand`}>
                  <Phone size={14} /> Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all bg-brand text-white hover:bg-brand-hover">
                  <MapPin size={14} /> View on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order History */}
      <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className="flex items-center gap-2 text-lg font-black mb-8 opacity-80"><History size={20} className="text-brand" /> Order History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <th className="pb-4 pr-4">Date & Time</th>
                <th className="pb-4">Distance</th>
                <th className="pb-4">Earnings</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {[
                { date: '07 Apr 2026, 14:30', dist: '4.2 km', earn: '₹65', status: 'Delivered' },
                { date: '07 Apr 2026, 13:10', dist: '2.1 km', earn: '₹40', status: 'Delivered' },
                { date: '06 Apr 2026, 19:45', dist: '5.8 km', earn: '₹85', status: 'Delivered' },
                { date: '06 Apr 2026, 18:20', dist: '1.2 km', earn: '₹30', status: 'Cancelled' }
              ].map((h, i) => (
                <tr key={i}>
                  <td className={`py-4 text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{h.date}</td>
                  <td className={`py-4 text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{h.dist}</td>
                  <td className={`py-4 text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{h.earn}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                      h.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPartnerEarnings = (partner) => (
    <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-100">
      <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className="flex items-center gap-2 text-lg font-black mb-8 opacity-80"><Banknote size={20} className="text-brand" /> Earnings Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Today's Earnings", value: '₹840', color: 'text-emerald-500' },
            { label: 'Weekly Earnings', value: '₹5,200', color: 'text-slate-800 dark:text-white' },
            { label: 'Total Earnings', value: partner.earnings, color: 'text-slate-800 dark:text-white' },
            { label: 'Pending Payouts', value: '₹1,200', color: 'text-orange-500' }
          ].map(stat => (
            <div key={stat.label} className={`p-6 rounded-xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-3">{stat.label}</p>
              <h5 className={`text-xl font-black ${stat.color}`}>{stat.value}</h5>
            </div>
          ))}
        </div>
        <div className={`p-5 rounded-2xl flex items-center justify-between border ${isDark ? 'bg-[#212529] border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
          <div className="space-y-1">
            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Preferred Payment Method</p>
            <div className="flex items-center gap-2 text-brand">
              <Banknote size={16} />
              <span className="text-sm font-black">UPI (Arjun@ybl)</span>
            </div>
          </div>
          <button className="px-5 py-2 rounded-xl text-xs font-black bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand-light">
            Change Details
          </button>
        </div>
      </div>
    </div>
  );

  const renderPartnerAdmin = (partner) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in text-gray-800 dark:text-gray-100">
      <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className="flex items-center gap-2 text-lg font-black mb-8 opacity-80"><FileText size={20} className="text-brand" /> Documents & Verification</h3>
        <div className="space-y-4 mb-8">
          {[
            { label: 'Aadhar Card', status: 'Approved', color: 'bg-emerald-50 text-emerald-600 dark:text-emerald-400' },
            { label: 'Driving License', status: 'Approved', color: 'bg-emerald-50 text-emerald-600 dark:text-emerald-400' },
            { label: 'Vehicle RC', status: 'Approved', color: 'bg-emerald-50 text-emerald-600 dark:text-emerald-400' },
            { label: 'Insurance', status: 'Expired', color: 'bg-rose-50 text-rose-600 dark:text-rose-400' }
          ].map(doc => (
            <div key={doc.label} className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-800/20' : 'border-slate-50 bg-slate-50/30'}`}>
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-400" />
                <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{doc.label}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${doc.color} dark:bg-opacity-10`}>{doc.status}</span>
            </div>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand-light">
          Request Document Update
        </button>
      </div>

      <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h3 className="flex items-center gap-2 text-lg font-black mb-4 opacity-80"><Gavel size={20} className="text-rose-500" /> Admin Actions</h3>
        <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed">Use these actions carefully as they directly impact the partner's account access and operations.</p>
        <div className="space-y-4">
          <button className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black border ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} text-slate-700 dark:text-slate-300`}>
             <Edit2 size={18} /> Edit Partner Details
          </button>
          <button className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black border ${isDark ? 'border-orange-500/30 text-orange-500 hover:bg-orange-500/10' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}>
             <PauseCircle size={18} /> Suspend Account
          </button>
          <button className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black border ${isDark ? 'border-rose-500/30 text-rose-500 hover:bg-rose-500/10' : 'border-rose-200 text-rose-600 hover:bg-rose-50'}`}>
             <Slash size={18} /> Deactivate & Block
          </button>
        </div>
      </div>
    </div>
  );

  const renderPartnerProfile = (partner) => (
    <div className="space-y-6 animate-fade-in pb-12">
      <button 
        onClick={() => setSelectedPartner(null)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-brand text-white hover:bg-brand-hover transition-all w-fit shadow-lg shadow-brand-light"
      >
        <ArrowLeft size={18} /> Back to Partners
      </button>

      <div className={`p-8 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-8 ${isDark ? 'bg-[#212529] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-2xl">{partner.avatar}</div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{partner.name}</h2>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Online
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-brand-light text-brand">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold opacity-60">
              <span className="flex items-center gap-1.5"># {partner.id}</span>
              <span className="flex items-center gap-1.5 tracking-wider font-bold"> {partner.contact}</span>
              <span className="flex items-center gap-1.5 text-amber-500"> <Star size={14} fill="currentColor" /> {partner.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-2 rounded-2xl border flex flex-wrap items-center gap-2 max-w-fit ${isDark ? 'bg-[#212529] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
        {['Overview', 'Orders', 'Earnings', 'Status & Admin'].map(tab => (
          <button key={tab} onClick={() => setProfileTab(tab)} className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
            profileTab === tab ? 'bg-brand text-white shadow-lg shadow-brand-light' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}>
            {tab === 'Overview' && <LayoutGrid size={16} />}
            {tab === 'Orders' && <Truck size={16} />}
            {tab === 'Earnings' && <Banknote size={16} />}
            {tab === 'Status & Admin' && <ShieldCheck size={16} />}
            {tab}
          </button>
        ))}
      </div>

      {profileTab === 'Overview' && renderPartnerOverview(partner)}
      {profileTab === 'Orders' && renderPartnerOrders(partner)}
      {profileTab === 'Earnings' && renderPartnerEarnings(partner)}
      {profileTab === 'Status & Admin' && renderPartnerAdmin(partner)}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'orders': return renderDeliveryOrders();
      case 'locations': return renderLocations();
      case 'issues': return renderQueries();
      case 'feedback': return renderFeedback();
      case 'partners': return renderPartnersList();
      default: return renderOverview();
    }
  };

  return (
    <DataState loading={loading} error={error}>
      <div className="space-y-6 pb-8 animate-fade-in text-gray-800 dark:text-gray-100">
        {selectedPartner ? renderPartnerProfile(selectedPartner) : (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isDark ? 'bg-brand/20' : 'bg-brand/10'}`}><Truck size={32} className="text-brand" /></div>
                <div>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Delivery Partners</h2>
                  <p className={`text-sm font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage deliveries, track performance, and resolve customer queries</p>
                </div>
              </div>
            </div>

            <div className={`p-2 rounded-2xl border flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap ${isDark ? 'bg-[#212529] border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${
                    activeTab === tab.id ? 'bg-brand text-white shadow-lg shadow-brand-light' : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-brand-light/50 hover:text-brand')
                  }`}
                >{tab.icon} {tab.label}</button>
              ))}
            </div>

            {renderActiveTab()}
          </>
        )}
      </div>
    </DataState>
  );
};

export default DeliveryPartners;
