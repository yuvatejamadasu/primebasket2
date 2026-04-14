import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTPEmail, verifyOTP } from '../utils/emailMock';

const DynamicLoginForm = ({ config }) => {
  const { title, accountsKey, authKey, redirectPath } = config;

  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleToggleForgot = () => {
    // We repurpose this to simply reset the form state
    setStep('email');
    setMessage({ text: '', type: '' });
    setEmail('');
    setOtp('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 'email') {
      if (!email) {
        setMessage({ text: 'Email is required.', type: 'error' });
        return;
      }
      
      const emailInput = email?.trim().toLowerCase();
      const accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
      const user = accounts.find((acc) => acc.email?.trim().toLowerCase() === emailInput);
      
      if (user) {
        setMessage({ text: 'Sending OTP...', type: 'success' });
        const res = await sendOTPEmail(emailInput);
        if (res.success) {
          setMessage({ text: `OTP sent to ${emailInput}`, type: 'success' });
          setStep('otp');
        } else {
          setMessage({ text: res.message || 'Failed to send OTP.', type: 'error' });
        }
      } else {
        // Check if it's a pending request that hasn't been approved yet
        const pendingReqs = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
        const isPending = pendingReqs.some(r => r.email?.trim().toLowerCase() === emailInput);
        
        if (isPending) {
          setMessage({ 
            text: 'ACCESS DENIED: Your account is awaiting administrative approval.', 
            type: 'error' 
          });
        } else {
          // Check if they are trying to log into the wrong portal
          const otherKey = accountsKey === 'hubAccounts' ? 'storeAccounts' : 'hubAccounts';
          const otherPortalName = accountsKey === 'hubAccounts' ? 'Store' : 'Hub';
          const otherAccounts = JSON.parse(localStorage.getItem(otherKey) || '[]');
          const isOther = otherAccounts.some(r => r.email?.trim().toLowerCase() === emailInput);
          
          if (isOther) {
             setMessage({ text: `This email belongs to a ${otherPortalName} Account. Please use the ${otherPortalName} Login page.`, type: 'error' });
          } else {
             setMessage({ text: 'Email not found.', type: 'error' });
          }
        }
      }
    } else if (step === 'otp') {
      if (!otp) {
        setMessage({ text: 'OTP is required.', type: 'error' });
        return;
      }

      setMessage({ text: 'Verifying...', type: 'success' });
      const emailInput = email?.trim().toLowerCase();
      const res = await verifyOTP(emailInput, otp);
      
      if (res.success) {
        const accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
        const user = accounts.find((acc) => acc.email?.trim().toLowerCase() === emailInput);

        if (user) {
          // 1. Check for Pending Deletion status (Most restrictive)
          if (user.deleteStatus === 'Pending Deletion') {
            setMessage({ 
              text: 'ACCESS DENIED: Your account is currently pending a deletion approval and cannot be accessed.', 
              type: 'error' 
            });
            return;
          }

          // 2. Strict status check for all other accounts
          // Every new account must have status === 'Approved' to enter (Legacy accounts included if they lack status)
          const isApproved = user.status === 'Approved' || user.status === 'approved' || user.status === undefined;
          
          if (!isApproved) {
            setMessage({ 
              text: `ACCESS DENIED: Your account status is "${user.status || 'Pending'}". please contact an administrator for approval.`, 
              type: 'error' 
            });
            return;
          }

          localStorage.setItem(authKey, JSON.stringify({ ...user, loggedIn: true }));
          setMessage({ text: 'Access Authorized. Redirecting...', type: 'success' });
          setTimeout(() => navigate(redirectPath), 1000);
        }
      } else {
        setMessage({ text: res.message || 'Invalid OTP.', type: 'error' });
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100 mt-20">
      <h2 className="text-3xl font-bold mb-3 text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600 mb-6 font-medium">Verify your identity to log in or recover your account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 'email' && (
          <input
            type="email"
            placeholder="Enter Registered Email"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#1d5ba0]/20 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        {step === 'otp' && (
          <>
            <input
              type="text"
              placeholder="Enter 6-Digit OTP"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#1d5ba0]/20 outline-none transition-all"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <p className="text-green-600 text-sm font-semibold mt-2">OTP sent to {email}</p>
          </>
        )}
        
        {message.text && step === 'email' && (
          <p className={`text-sm font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</p>
        )}
        {message.text && step === 'otp' && message.text !== `OTP sent to ${email}` && (
           <p className={`text-sm font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</p>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-[#1d5ba0] text-white rounded-xl font-bold hover:bg-[#152436] transition-all"
          >
            {step === 'email' ? 'Get Verification Code' : 'Verify OTP'}
          </button>
          <button
            type="button"
            onClick={handleToggleForgot}
            className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicLoginForm;
