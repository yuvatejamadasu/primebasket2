import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, ShoppingCart, PlusSquare, Plus,
  Loader2, Users,
  ShieldCheck, UserPlus, FileText, CheckCircle2, XCircle,
  Clock, Activity, Shield, Trash2, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import { useTheme } from '../context/ThemeContext';
import { getDeletionRequestsForUser, approveDeletion, rejectDeletion, notifySubordinates } from '../../utils/notifications';
import { processApproval, processRejection } from '../../utils/approvalUtils';
import RequestDetailsModal from '../../Components/RequestDetailsModal';

const SuperAdminDashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [hubs, setHubs] = useState([]);
  const [stores, setStores] = useState([]);
  const [counts, setCounts] = useState({ hub: 0, store: 0 });
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [pendingReqs, setPendingReqs] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("hubAccounts") || "[]");
    const st = JSON.parse(localStorage.getItem("storeAccounts") || "[]");
    const pr = JSON.parse(localStorage.getItem("pendingRequests") || "[]");
    
    setHubs(h);
    setStores(st);
    setPendingReqs(pr);

    setCounts({
      hub: h.filter(acc => acc.status === 'Approved').length,
      store: st.filter(acc => acc.status === 'Approved').length
    });

    setDeletionRequests(getDeletionRequestsForUser('super-admin', {}));
  }, []);

  const filteredHubs = hubs.filter(acc => acc.status === 'Approved').slice(0, 5);
  const filteredStores = stores.filter(acc => acc.status === 'Approved').slice(0, 5);

  const allPending = [
    ...pendingReqs.filter(req => !req.targetRole || req.targetRole === 'super-admin' || req.targetRole === 'Super Admin').map(acc => ({ ...acc, type: acc.type || 'Account', key: 'pendingRequests' })),
    ...hubs.filter(acc => acc.status === 'Pending' || acc.status === 'Pending Super').map(acc => ({ ...acc, type: 'Hub', key: 'hubAccounts' })),
    ...stores.filter(acc => acc.status === 'Pending' || acc.status === 'Pending Super').map(acc => ({ ...acc, type: 'Store', key: 'storeAccounts' }))
  ];

  const pendingCount = allPending.length;

  const handleApprove = (email, storageKey, requestId) => {
    if (storageKey === 'pendingRequests') {
        const result = processApproval(requestId);
        if (result.success) {
            window.location.reload();
        } else {
            alert(result.message || 'Approval failed');
        }
        return;
    }

    const accounts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = accounts.map(acc => {
      if (acc.email?.trim().toLowerCase() === email?.trim().toLowerCase()) {
        return { ...acc, status: 'Approved' };
      }
      return acc;
    });
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.location.reload();
  };

  const handleReject = (email, storageKey, requestId) => {
    if(!window.confirm("Are you sure you want to reject/delete this request?")) return;

    if (storageKey === 'pendingRequests') {
        const result = processRejection(requestId);
        if (result.success) {
            window.location.reload();
        }
        return;
    }

    const accounts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = accounts.filter(acc => acc.email?.trim().toLowerCase() !== email?.trim().toLowerCase());
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.location.reload();
  };

  const handleApproveDeletion = (id) => {
    if(!window.confirm("Approve this deletion? Final deletion only occurs when all required administrators have approved.")) return;
    const isFinal = approveDeletion(id, 'super-admin');
    if (isFinal) {
      alert("Final approval received. The entity and its subordinates have been permanently deleted.");
    } else {
      alert("Your approval (Super Admin) has been recorded. Waiting for other required approvals.");
    }
    window.location.reload();
  };

  const handleRejectDeletion = (id) => {
    rejectDeletion(id);
    window.location.reload();
  };

  const handleDeleteEntity = (type, index) => {
    if (!window.confirm(`Are you sure you want to permanently delete this ${type}?`)) return;
    
    const key = type === 'Hub' ? 'hubAccounts' : 'storeAccounts';
    const accounts = JSON.parse(localStorage.getItem(key) || '[]');
    
    const itemToDelete = type === 'Hub' ? filteredHubs[index] : filteredStores[index];
    
    const strToDelete = JSON.stringify(itemToDelete);
    let deleted = false;
    const filtered = accounts.filter(acc => {
      if (!deleted && JSON.stringify(acc) === strToDelete) {
        deleted = true;
        return false;
      }
      return true;
    });
    
    localStorage.setItem(key, JSON.stringify(filtered));
    
    if (itemToDelete.email) {
      const pending = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
      localStorage.setItem('pendingRequests', JSON.stringify(pending.filter(p => p.email !== itemToDelete.email)));
    }
    
    window.location.reload();
  };

  // Mock Data for System Logs (could implement actual logging in future)
  const systemLogs = [
    { id: 1, action: 'System Setup Initialization', performedBy: 'System', role: 'System', timestamp: 'Just now', status: 'Success' },
  ];

  return (
    <div className="space-y-8 pb-8 transition-colors duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in relative z-10">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Super Admin Dashboard</h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium`}>Global overview and system management</p>
        </div>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={24} className="text-brand" />} 
          label="Total Hubs" 
          value={counts.hub.toString() || '0'} 
          subtext="Approved Hub Accounts" 
          colorClass="bg-brand/10" 
          className="animate-slide-up" 
        />
        <StatCard 
          icon={<ShoppingCart size={24} className="text-orange-500" />} 
          label="Total Stores" 
          value={counts.store.toString() || '0'} 
          subtext="Approved Store Accounts" 
          colorClass="bg-orange-500/10" 
          className="animate-slide-up animate-stagger-1" 
        />
        <StatCard 
          icon={<Clock size={24} className="text-amber-500" />} 
          label="Pending Approvals" 
          value={pendingCount.toString() || '0'} 
          subtext="Awaiting Action" 
          colorClass="bg-amber-500/10" 
          className="animate-slide-up animate-stagger-2" 
        />
        <StatCard 
          icon={<Activity size={24} className="text-emerald-500" />} 
          label="System Logs" 
          value="1,284" 
          subtext="Recent Actions" 
          colorClass="bg-emerald-500/10" 
          className="animate-slide-up animate-stagger-3" 
        />
      </div>

      {/* Pending Deletion Approvals */}
      {deletionRequests.length > 0 && (
        <div className={`p-6 rounded-2xl border animate-fade-in transition-all duration-300 ${isDark ? 'bg-rose-900/10 border-rose-500/20 shadow-xl' : 'bg-rose-50 border-rose-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h5 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-rose-400' : 'text-rose-900'}`}>
              <AlertTriangle size={20} className="text-rose-500" /> Pending Deletion Approvals
            </h5>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-500">{deletionRequests.length} Pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${isDark ? 'text-rose-400/50 border-rose-500/10' : 'text-rose-800 border-rose-100'} border-b text-xs font-bold uppercase tracking-wider`}>
                  <th className="px-4 py-4">Entity</th>
                  <th className="px-4 py-4">Requested By</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 dark:divide-rose-500/10">
                {deletionRequests.map((req) => (
                  <tr key={req.id} className="group hover:bg-rose-50/50 dark:hover:bg-rose-500/5 transition-colors">
                    <td className="px-4 py-4">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{req.entityType}: {req.entityData.fullName || req.entityData.hubName || req.entityData.storeName}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{req.entityData.email}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium uppercase text-rose-600 dark:text-rose-400">{req.requesterRole.replace('-', ' ')}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleApproveDeletion(req.id)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-all text-xs font-bold shadow-sm">
                          Approve Deletion
                        </button>
                        <button onClick={() => handleRejectDeletion(req.id)} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${isDark ? 'bg-[#1a1d21] border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <div className="space-y-8">
        
        {/* 1. Approval Management */}
        <div className={`p-6 rounded-2xl border animate-fade-in transition-all duration-300 ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-6">
            <h5 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <ShieldCheck size={20} className="text-brand" /> Pending Approvals
            </h5>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500">{allPending.length} Pending</span>
          </div>
          <div className="overflow-x-auto">
            {allPending.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className={`${isDark ? 'text-slate-400 border-slate-700' : 'text-slate-500 border-slate-100'} border-b text-xs font-bold uppercase tracking-wider`}>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Details</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {allPending.map((req, idx) => (
                    <tr key={idx} onClick={() => setSelectedRequest(req)} className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className={`px-4 py-4 text-xs font-bold ${isDark ? 'text-brand' : 'text-brand-dark'} uppercase tracking-wider`}>{req.type}</td>
                      <td className="px-4 py-4">
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{req.name || req.fullName || req.hubName || req.storeName}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500 font-medium">
                        {req.email} <br/>
                        <span className="text-xs text-slate-400 capitalize">{req.state}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500 font-medium">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleApprove(req.email, req.key, req.id); }} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all text-xs font-bold shadow-sm flex items-center gap-1">
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleReject(req.email, req.key, req.id); }} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${isDark ? 'bg-[#1a1d21] border-rose-500/20 text-rose-400 hover:bg-rose-500/10' : 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'}`}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
               <div className="text-center py-8">
                 <p className="text-slate-500 italic text-sm">No pending approvals.</p>
               </div>
            )}
          </div>
        </div>

        {/* Admin Portals Overview replacing hubs/stores tables for brevity in modern layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Hubs */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <h5 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <Users size={20} className="text-brand" /> Recent Hubs
              </h5>
              <button onClick={() => navigate('/hub-dashboard')} className="text-xs font-bold text-brand hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto min-h-[150px]">
              <table className="w-full text-left">
                <thead>
                  <tr className={`${isDark ? 'text-slate-400' : 'text-slate-500'} border-b border-slate-100 dark:border-slate-700/50 text-xs font-bold uppercase tracking-wider`}>
                    <th className="px-4 py-4">Hub Name</th>
                    <th className="px-4 py-4">Branch</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredHubs.length > 0 ? filteredHubs.map((row, idx) => (
                    <tr key={idx} className="text-sm">
                      <td className={`px-4 py-4 font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{row.hubName}</td>
                      <td className="px-4 py-4 font-medium text-slate-500">{row.branchName}</td>
                      <td className="px-4 py-4">
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                           row.status === 'Pending Deletion' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                         }`}>
                           {row.status || 'Approved'}
                         </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteEntity('Hub', idx)}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                          title="Delete Hub"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-400 italic">No approved hubs found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Stores */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <h5 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <ShoppingCart size={20} className="text-orange-500" /> Recent Stores
              </h5>
              <button onClick={() => navigate('/store-dashboard')} className="text-xs font-bold text-orange-500 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto min-h-[150px]">
              <table className="w-full text-left">
                <thead>
                  <tr className={`${isDark ? 'text-slate-400' : 'text-slate-500'} border-b border-slate-100 dark:border-slate-700/50 text-xs font-bold uppercase tracking-wider`}>
                    <th className="px-4 py-4">Store Name</th>
                    <th className="px-4 py-4">Hub</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredStores.length > 0 ? filteredStores.map((row, idx) => (
                    <tr key={idx} className="text-sm">
                      <td className={`px-4 py-4 font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{row.storeName}</td>
                      <td className="px-4 py-4 font-medium text-slate-500">{row.hubName}</td>
                      <td className="px-4 py-4">
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                           row.status === 'Pending Deletion' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                         }`}>
                           {row.status || 'Approved'}
                         </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteEntity('Store', idx)}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                          title="Delete Store"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-400 italic">No approved stores found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. System Logs (New Section) */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-6">
            <h5 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <FileText size={20} className="text-brand" /> System Logs
            </h5>
            <button className="text-xs font-bold text-brand hover:underline">View All Logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${isDark ? 'text-slate-400' : 'text-slate-500'} border-b border-slate-100 dark:border-slate-700/50 text-xs font-bold uppercase tracking-wider`}>
                  <th className="px-4 py-4">Action</th>
                  <th className="px-4 py-4">Performed By</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Timestamp</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {systemLogs.map((log) => (
                  <tr key={log.id} className="text-sm">
                    <td className="px-4 py-4 text-slate-500"><span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{log.action}</span></td>
                    <td className="px-4 py-4 font-medium text-slate-500">{log.performedBy}</td>
                    <td className="px-4 py-4"><span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 tracking-tighter">{log.role}</span></td>
                    <td className="px-4 py-4 text-slate-500 font-medium">{log.timestamp}</td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-black uppercase ${log.status === 'Success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <RequestDetailsModal 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
      />
    </div>
  );
};

export default SuperAdminDashboard;
