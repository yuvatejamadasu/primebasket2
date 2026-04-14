import React, { useState } from 'react';
import { UserPlus, User, Mail, Shield, MapPin, CheckCircle2, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const CreateAdmin = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Hub',
    assignedArea: '',
    status: 'Active'
  });
  
  const [admins, setAdmins] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdmins(prev => [...prev, { ...formData, id: Date.now() }]);
    
    if (formData.status === 'Active') {
      setSuccessMsg('Active admin recorded. Proceeding to Hub Account setup...');
      setTimeout(() => navigate('/hub-signup', { state: { creatorRole: 'super' } }), 1000);
    } else {
      setSuccessMsg('Admin successfully created as Inactive. Setup skipped.');
      // reset form (except role and status to defaults)
      setFormData({
        name: '',
        email: '',
        role: 'Hub',
        assignedArea: '',
        status: 'Inactive'
      });
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleDeleteAdmin = (id) => {
    setAdmins(prev => prev.filter(admin => admin.id !== id));
  };

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Create Admin</h2>
        <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add a new regional, hub or branch administrator.</p>
      </div>

      {successMsg && (
        <div className="p-4 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 animate-fade-in">
          <CheckCircle2 size={24} />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Admin Details</h3>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fill out the required information.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark ? 'bg-[#1a1d21] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`} 
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark ? 'bg-[#1a1d21] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`} 
                  placeholder="admin@primebasket.com"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Role</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Shield size={18} />
                </div>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none transition-colors opacity-75 cursor-not-allowed ${
                    isDark ? 'bg-[#1a1d21] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="Hub">Hub Admin</option>
                </select>
              </div>
            </div>

            {/* Assigned Area */}
            <div className="space-y-2">
              <label className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Assigned Area</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  name="assignedArea"
                  required
                  value={formData.assignedArea}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors ${
                    isDark ? 'bg-[#1a1d21] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`} 
                  placeholder="e.g. Hyderabad South"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2 md:col-span-2">
              <label className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</label>
              <div className="flex gap-4">
                <label className={`flex-1 p-4 rounded-xl border cursor-pointer flex items-center justify-center gap-3 transition-all ${
                  formData.status === 'Active' 
                    ? 'border-brand bg-brand/10 text-brand font-bold' 
                    : (isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500')
                }`}>
                  <input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={handleChange} className="hidden" />
                  Active
                </label>
                <label className={`flex-1 p-4 rounded-xl border cursor-pointer flex items-center justify-center gap-3 transition-all ${
                  formData.status === 'Inactive' 
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold' 
                    : (isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500')
                }`}>
                  <input type="radio" name="status" value="Inactive" checked={formData.status === 'Inactive'} onChange={handleChange} className="hidden" />
                  Inactive
                </label>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button 
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand/30 transition-all active:scale-95"
            >
              Create Administrator
            </button>
          </div>
        </form>
      </div>

      {/* Mock Table to show created admins temporarily */}
      {admins.length > 0 && (
        <div className={`p-8 rounded-2xl border transition-all mt-8 ${isDark ? 'bg-[#2c3136] border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Additions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-3 px-4 font-bold text-sm">Name</th>
                  <th className="py-3 px-4 font-bold text-sm">Role</th>
                  <th className="py-3 px-4 font-bold text-sm">Area</th>
                  <th className="py-3 px-4 font-bold text-sm">Email</th>
                  <th className="py-3 px-4 font-bold text-sm">Status</th>
                  <th className="py-3 px-4 font-bold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.id} className={`border-b last:border-0 ${isDark ? 'border-slate-700/50 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
                    <td className={`py-3 px-4 font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{admin.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-xs font-semibold dark:text-slate-300">{admin.role === 'Hub' ? 'Hub Admin' : 'Store Admin'}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{admin.assignedArea}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{admin.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${admin.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:bg-rose-500/10 hover:text-rose-500' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateAdmin;
