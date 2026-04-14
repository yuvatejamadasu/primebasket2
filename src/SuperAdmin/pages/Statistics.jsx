import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, ArrowUp, ArrowDown, User, Mail, Shield, Calendar, Search } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import useFetch from '../hooks/useFetch';
import DataState from '../components/DataState';
import { API } from '../config/api';



const Statistics = () => {
  const { isDark } = useTheme();

  const [fetchedStats, setFetchedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API.STATISTICS);
        setFetchedStats(res.data);
      } catch (err) {
        console.error("Error loading stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);
  
  const [selectedHub, setSelectedHub] = useState("All Hubs");
  const [selectedStore, setSelectedStore] = useState("All Stores");

  const storesByHub = {
    "Hub 1": ["Store 1", "Store 2"],
    "Hub 2": ["Store 3"]
  };
  
  const allStores = ["Store 1", "Store 2", "Store 3"];
  const filteredStores = allStores;

  const hubStats = {
    "Hub 1": { 
      kpi: [{ change: '12%', up: true, value: '$124,500' }, { change: '5%', up: true, value: '8,420' }, { change: '2%', up: false, value: '1,200' }, { change: '10%', up: true, value: '$45.20' }],
      monthly: [
        {name: 'Jan', revenue: 10000}, {name: 'Feb', revenue: 12000}, {name: 'Mar', revenue: 11500},
        {name: 'Apr', revenue: 15600}, {name: 'May', revenue: 18000}, {name: 'Jun', revenue: 16500}
      ],
      categories: [
        {name: 'Electronics', value: 35, color: '#3b82f6'},
        {name: 'Clothing', value: 25, color: '#10b981'},
        {name: 'Home', value: 40, color: '#f59e0b'}
      ]
    },
    "Hub 2": { 
      kpi: [{ change: '8%', up: true, value: '$92,100' }, { change: '1%', up: false, value: '5,100' }, { change: '4%', up: true, value: '950' }, { change: '8%', up: true, value: '$52.00' }],
      monthly: [
        {name: 'Jan', revenue: 8000}, {name: 'Feb', revenue: 8500}, {name: 'Mar', revenue: 9800},
        {name: 'Apr', revenue: 9200}, {name: 'May', revenue: 11000}, {name: 'Jun', revenue: 13500}
      ],
      categories: [
        {name: 'Electronics', value: 50, color: '#3b82f6'},
        {name: 'Clothing', value: 30, color: '#10b981'},
        {name: 'Home', value: 20, color: '#f59e0b'}
      ]
    }
  };

  const storeStats = {
    "Store 1": { 
      kpi: [{ change: '15%', up: true, value: '$45,000' }, { change: '8%', up: true, value: '3,200' }, { change: '5%', up: true, value: '450' }, { change: '12%', up: true, value: '$38.50' }],
      monthly: [
        {name: 'Jan', revenue: 4000}, {name: 'Feb', revenue: 4200}, {name: 'Mar', revenue: 5100},
        {name: 'Apr', revenue: 5800}, {name: 'May', revenue: 6000}, {name: 'Jun', revenue: 6500}
      ],
      categories: [
        {name: 'Electronics', value: 20, color: '#3b82f6'},
        {name: 'Clothing', value: 60, color: '#10b981'},
        {name: 'Home', value: 20, color: '#f59e0b'}
      ],
      details: { manager: 'Mike Ross', branchId: 'BR-101', location: 'Hyderabad West', employees: 15, topProduct: 'Organic Coffee' }
    },
    "Store 2": { 
      kpi: [{ change: '3%', up: false, value: '$22,400' }, { change: '2%', up: false, value: '1,800' }, { change: '1%', up: true, value: '210' }, { change: '5%', up: true, value: '$41.80' }],
      monthly: [
        {name: 'Jan', revenue: 2000}, {name: 'Feb', revenue: 1800}, {name: 'Mar', revenue: 2200},
        {name: 'Apr', revenue: 2500}, {name: 'May', revenue: 2300}, {name: 'Jun', revenue: 2800}
      ],
      categories: [
        {name: 'Electronics', value: 45, color: '#3b82f6'},
        {name: 'Clothing', value: 15, color: '#10b981'},
        {name: 'Home', value: 40, color: '#f59e0b'}
      ],
      details: { manager: 'Stefan Salvatore', branchId: 'BR-102', location: 'Hyderabad Central', employees: 12, topProduct: 'Wireless Headphones' }
    },
    "Store 3": { 
      kpi: [{ change: '10%', up: true, value: '$31,500' }, { change: '4%', up: true, value: '2,400' }, { change: '2%', up: true, value: '310' }, { change: '7%', up: true, value: '$43.20' }],
      monthly: [
        {name: 'Jan', revenue: 3100}, {name: 'Feb', revenue: 3500}, {name: 'Mar', revenue: 4100},
        {name: 'Apr', revenue: 4500}, {name: 'May', revenue: 4800}, {name: 'Jun', revenue: 5200}
      ],
      categories: [
        {name: 'Electronics', value: 30, color: '#3b82f6'},
        {name: 'Clothing', value: 30, color: '#10b981'},
        {name: 'Home', value: 40, color: '#f59e0b'}
      ],
      details: { manager: 'Bonnie Bennett', branchId: 'BR-103', location: 'Hyderabad East', employees: 8, topProduct: 'Running Shoes' }
    }
  };

  // Determine which data to show. 
  // Store takes precedence if selected, otherwise Hub, otherwise fetched global stats
  const activeStats = selectedStore !== "All Stores" && storeStats[selectedStore]
    ? storeStats[selectedStore]
    : selectedHub !== "All Hubs" && hubStats[selectedHub]
      ? hubStats[selectedHub]
      : fetchedStats;

  const activeStatsKpi = activeStats?.kpi || [];
  const monthlyData = activeStats?.monthly || fetchedStats?.monthly || [];
  const categoryData = activeStats?.categories || fetchedStats?.categories || [];

  // Mock Data for Profiles
  const mockUsers = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@primebasket.com', role: 'Hub Manager', hub: 'Hub 1', store: '', joined: 'Mar 12, 2024', status: 'Active' },
    { id: 2, name: 'Sarah Miller', email: 'sarah.m@primebasket.com', role: 'Inventory Specialist', hub: 'Hub 1', store: '', joined: 'Jan 28, 2024', status: 'Active' },
    { id: 3, name: 'Mike Ross', email: 'mike.r@primebasket.com', role: 'Store Lead', hub: 'Hub 1', store: 'Store 1', joined: 'Feb 15, 2024', status: 'Active' },
    { id: 4, name: 'Elena Gilbert', email: 'elena.g@primebasket.com', role: 'Associate', hub: 'Hub 1', store: 'Store 1', joined: 'Mar 05, 2024', status: 'Active' },
    { id: 5, name: 'Stefan Salvatore', email: 'stefan.s@primebasket.com', role: 'Store Lead', hub: 'Hub 1', store: 'Store 2', joined: 'Jan 10, 2024', status: 'Inactive' },
    { id: 6, name: 'Damon Salvatore', email: 'damon.s@primebasket.com', role: 'Hub Admin', hub: 'Hub 2', store: '', joined: 'Dec 15, 2023', status: 'Active' },
    { id: 7, name: 'Bonnie Bennett', email: 'bonnie.b@primebasket.com', role: 'Store Manager', hub: 'Hub 2', store: 'Store 3', joined: 'Feb 20, 2024', status: 'Active' },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredUsers = mockUsers.filter(user => {
    // Exact string matching for robustness
    const isAllHubs = selectedHub === "All Hubs";
    const isAllStores = selectedStore === "All Stores";

    const matchesHub = isAllHubs || user.hub === selectedHub;
    const matchesStore = isAllStores || user.store === selectedStore;
    
    // Case-insensitive search on Name and Email
    const term = searchTerm.trim().toLowerCase();
    const nameMatch = user.name.toLowerCase().includes(term);
    const emailMatch = user.email.toLowerCase().includes(term);
    const matchesSearch = term === "" || nameMatch || emailMatch;

    return matchesHub && matchesStore && matchesSearch;
  });

  const kpiCards = [
    { label: 'Total Revenue', value: activeStatsKpi?.[0]?.value ?? '—', change: activeStatsKpi?.[0]?.change ?? '', up: activeStatsKpi?.[0]?.up ?? true, icon: <DollarSign size={22} className="text-brand" />, bg: 'bg-brand/10' },
    { label: 'Total Orders',  value: activeStatsKpi?.[1]?.value ?? '—', change: activeStatsKpi?.[1]?.change ?? '', up: activeStatsKpi?.[1]?.up ?? true, icon: <ShoppingBag size={22} className="text-violet-500" />, bg: 'bg-violet-500/10' },
    { label: 'New Customers', value: activeStatsKpi?.[2]?.value ?? '—', change: activeStatsKpi?.[2]?.change ?? '', up: activeStatsKpi?.[2]?.up ?? true, icon: <Users size={22} className="text-emerald-500" />, bg: 'bg-emerald-500/10' },
    { label: 'Avg. Order Value', value: activeStatsKpi?.[3]?.value ?? '—', change: activeStatsKpi?.[3]?.change ?? '', up: activeStatsKpi?.[3]?.up ?? false, icon: <TrendingUp size={22} className="text-amber-500" />, bg: 'bg-amber-500/10' },
  ];

  return (
    <DataState loading={loading} error={error}>
    <div className="space-y-8 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Statistics</h2>
          <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Overall performance overview for the current year</p>
        </div>
        
        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative min-w-[160px]">
            <select
              value={selectedHub}
              onChange={(e) => {
                setSelectedHub(e.target.value);
                setSelectedStore("All Stores"); // reset store when hub changes
              }}
              className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold cursor-pointer transition-colors ${
                isDark ? 'bg-[#2c3136] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="All Hubs">All Hubs</option>
              <option value="Hub 1">Hub 1</option>
              <option value="Hub 2">Hub 2</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               ▼
            </div>
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={selectedStore}
              onChange={(e) => {
                setSelectedStore(e.target.value);
              }}
              className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold cursor-pointer transition-colors ${
                isDark ? 'bg-[#2c3136] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="All Stores">All Stores</option>
              {filteredStores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               ▼
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map(card => (
          <div key={card.label} className={`p-6 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-xl ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bg}`}>{card.icon}</div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${card.up ? 'bg-brand/10 text-brand' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                {card.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {card.change}
              </span>
            </div>
            <h4 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{card.value}</h4>
            <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue trend */}
        <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h5 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Annual Revenue Trend</h5>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d5ba0" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d5ba0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#212529' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#1d5ba0" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#1d5ba0' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h5 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Sales by Category</h5>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#212529' : '#fff', borderRadius: '12px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{cat.name}</span>
                </div>
                <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STORE SPECIFIC DETAILS - DRILL DOWN */}
      {selectedStore !== "All Stores" && activeStats?.details && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
           <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#212529]/50 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Store Manager</p>
              <h6 className={`text-base font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{activeStats.details.manager}</h6>
           </div>
           <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#212529]/50 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Branch ID</p>
              <h6 className={`text-base font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{activeStats.details.branchId}</h6>
           </div>
           <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#212529]/50 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Top Selling Product</p>
              <h6 className={`text-base font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{activeStats.details.topProduct}</h6>
           </div>
           <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#212529]/50 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Time Employees</p>
              <h6 className={`text-base font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{activeStats.details.employees} Members</h6>
           </div>
        </div>
      )}

      {/* PROFILES SECTION */}
      <div className={`mt-8 p-8 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h5 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Users size={22} className="text-brand" /> Entity Profiles
            </h5>
            <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Showing users for {selectedStore !== "All Stores" ? selectedStore : selectedHub !== "All Hubs" ? selectedHub : "Global Network"}
            </p>
          </div>
          
          <div className="relative group max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${
                isDark ? 'bg-[#1a1d21] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b text-[11px] font-black uppercase tracking-wider ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                <th className="px-4 py-4">User Details</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Admin</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-brand/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isDark ? 'bg-slate-800 text-brand' : 'bg-brand/10 text-brand'}`}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.name}</p>
                          <p className="text-[11px] font-medium text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                        <Shield size={12} className="text-brand" /> {user.store || user.hub}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Users size={32} />
                      </div>
                      <div>
                        <p className={`text-base font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No matching personnel found</p>
                        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>We couldn't find any users matching your current hub, store, or search criteria.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedHub("All Hubs");
                          setSelectedStore("All Stores");
                          setSearchTerm("");
                        }}
                        className="mt-2 px-6 py-2 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 active:scale-95"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </DataState>
  );
};

export default Statistics;
