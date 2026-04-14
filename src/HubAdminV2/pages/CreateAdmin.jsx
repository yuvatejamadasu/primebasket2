import React, { useState } from 'react';
import { UserPlus, User, Mail, Shield, MapPin, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const CreateAdmin = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Store', // Restricted to Store
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
      setSuccessMsg('Active admin recorded. Proceeding to Store Account setup...');
      setTimeout(() => navigate('/store-signup', { state: { creatorRole: 'hub' } }), 1000);
    } else {
      setSuccessMsg('Store Admin successfully created as Inactive. Setup skipped.');
      // reset form 
      setFormData({
        name: '',
        email: '',
        role: 'Store',
        assignedArea: '',
        status: 'Inactive'
      });
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Create Store Admin</h2>
        <p className={`text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add a new store administrator for your hub.</p>
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

            {/* Role (Restricted) */}
            <div className="space-y-2">
              <label className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Role</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Shield size={18} />
                </div>
                <select 
                  name="role"
                  readOnly
                  disabled
                  value={formData.role}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border appearance-none transition-colors opacity-70 cursor-not-allowed ${
                    isDark ? 'bg-[#1a1d21] border-slate-700 text-white font-bold' : 'bg-slate-50 border-slate-200 text-slate-800 font-bold'
                  }`}
                >
                  <option value="Store">Store Admin</option>
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
                  placeholder="e.g. Store Location or Branch"
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

    </div>
  );
};

export default CreateAdmin;
