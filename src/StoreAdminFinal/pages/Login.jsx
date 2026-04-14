import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import logo from '../assets/logo.png';

/* ── Demo credentials ─────────────────────────────────────── */
const VALID_USERS = [
  { email: 'admin@primebasket.com', password: 'admin123', name: 'Admin', initials: 'AD', role: 'Super Admin' },
  { email: 'manager@primebasket.com', password: 'manager123', name: 'Manager', initials: 'MG', role: 'Manager' },
];

const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = typeof location.state?.from === 'string' ? location.state.from : '/dashboard';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let hasError = false;
    const newErrors = {};

    // Basic validations
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setLoading(true);

    /* Simulate network delay */
    await new Promise(r => setTimeout(r, 800));

    const matched = VALID_USERS.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (matched) {
      login({ name: matched.name, email: matched.email, initials: matched.initials, role: matched.role });
      navigate(redirectTo, { replace: true });
    } else {
      setLoading(false);
      setErrors({ global: 'Invalid email or password. Please try again.' });
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="login-page">
      {/* ── Animated background blobs ── */}
      <div className="login-blob blob-1" />
      <div className="login-blob blob-2" />
      <div className="login-blob blob-3" />

      {/* ── Theme toggle top-right ── */}
      <button
        className="login-theme-btn"
        onClick={toggleTheme}
        title="Toggle theme"
      >
        <span className="material-icons">
          {theme === 'dark' ? 'light_mode' : 'nights_stay'}
        </span>
      </button>

      <div className="login-center">
        {/* ── Brand panel ── */}
        <div className="login-brand-panel">
          <div className="login-brand-logo">
            <img
              src={logo}
              alt="Prime-Basket"
              style={{ width: 56, height: 56, objectFit: 'contain' }}
            />
          </div>
          <h1 className="login-brand-name">Prime-Basket</h1>
          <p className="login-brand-tagline">
            Your complete eCommerce management hub
          </p>

          <div className="login-feature-list">
            {[
              { icon: 'bar_chart',      text: 'Real-time analytics & reports'   },
              { icon: 'inventory_2',    text: 'Full product & order management'  },
              { icon: 'storefront',     text: 'Multi-seller marketplace control' },
              { icon: 'account_balance',text: 'Financial transactions overview'  },
            ].map((f, i) => (
              <div className="login-feature-item" key={i}>
                <div className="login-feature-icon">
                  <span className="material-icons">{f.icon}</span>
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form card ── */}
        <div className={`login-card${shake ? ' shake' : ''}`}>
          {/* Header */}
          <div className="login-card-header">
            <div className="login-card-logo-sm">
              <img
                src={logo}
                alt="PB"
                style={{ width: 32, height: 32, objectFit: 'contain' }}
              />
            </div>
            <h2>Welcome back</h2>
            <p>Sign in to your dashboard</p>
          </div>



          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <div className={`login-input-wrap ${errors.email ? 'has-error' : ''}`}>
                <span className="material-icons login-input-icon">mail_outline</span>
                <input
                  id="email"
                  type="text"
                  placeholder="admin@primebasket.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({...prev, email: null, global: null})); }}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="login-field-error">
                  <span className="material-icons">error_outline</span>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field-row">
                <label htmlFor="password">Password</label>
                <button type="button" className="login-forgot">Forgot password?</button>
              </div>
              <div className={`login-input-wrap ${errors.password ? 'has-error' : ''}`}>
                <span className="material-icons login-input-icon">lock_outline</span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({...prev, password: null, global: null})); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  <span className="material-icons" style={{ fontSize: 20 }}>
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <div className="login-field-error">
                  <span className="material-icons">error_outline</span>
                  {errors.password}
                </div>
              )}

              {errors.global && (
                <div className="login-field-error global-err">
                  <span className="material-icons">error_outline</span>
                  {errors.global}
                </div>
              )}
            </div>

            {/* Remember me */}
            <div className="login-remember">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember me 
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Logining in…
                </>
              ) : (
                <>
                  <span className="material-icons" style={{ fontSize: 18 }}>login</span>
                  Login
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
         

          <p className="login-footer-note">
            © {new Date().getFullYear()} Prime-Basket. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        /* ── LOGIN PAGE STYLES ─────────────────────── */

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-body);
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
        }

        /* animated gradient blobs */
        .login-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: blobFloat 8s ease-in-out infinite alternate;
          pointer-events: none;
        }
        [data-theme="dark"] .login-blob { opacity: 0.12; }

        .blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #2563eb, #1d5ba0);
          top: -120px; left: -120px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #10b981, #059669);
          bottom: -80px; right: -80px;
          animation-delay: 2s;
        }
        .blob-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, #8b5cf6, #6d28d9);
          top: 40%; left: 40%;
          animation-delay: 4s;
        }

        @keyframes blobFloat {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.08); }
        }

        /* theme toggle */
        .login-theme-btn {
          position: fixed;
          top: 20px; right: 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all 0.2s;
          z-index: 10;
        }
        .login-theme-btn:hover {
          color: var(--primary);
          border-color: var(--primary);
        }

        /* centre wrapper */
        .login-center {
          display: flex;
          align-items: stretch;
          gap: 0;
          width: 100%;
          max-width: 960px;
          min-height: 580px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0,0,0,0.18);
          position: relative;
          z-index: 1;
        }

        /* ── Brand left panel ── */
        .login-brand-panel {
          flex: 1;
          background: #1d5ba0;
          color: white;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-brand-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          // background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .login-brand-logo {
          width: 72px; height: 72px;
          background: white;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
        }

        .login-brand-name {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
          color: white;
        }

        .login-brand-tagline {
          font-size: 15px;
          opacity: 0.8;
          margin-bottom: 36px;
          line-height: 1.6;
          max-width: 300px;
        }

        .login-feature-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 14px;
          opacity: 0.9;
        }

        .login-feature-icon {
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          backdrop-filter: blur(4px);
        }
        .login-feature-icon .material-icons { font-size: 18px; }

        /* ── Form card right panel ── */
        .login-card {
          width: 420px;
          flex-shrink: 0;
          background: var(--bg-card);
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
        }

        .login-card.shake {
          animation: shakeAnim 0.5s ease;
        }
        @keyframes shakeAnim {
          0%, 100% { transform: translateX(0); }
          15%  { transform: translateX(-8px); }
          30%  { transform: translateX(8px); }
          45%  { transform: translateX(-6px); }
          60%  { transform: translateX(6px); }
          75%  { transform: translateX(-4px); }
          90%  { transform: translateX(4px); }
        }

        .login-card-logo-sm {
          display: none; /* visible only on mobile */
          width: 44px; height: 44px;
          background: var(--primary-light);
          border-radius: 12px;
          align-items: center; justify-content: center;
          margin-bottom: 14px;
        }

        .login-card-header {
          margin-bottom: 28px;
        }
        .login-card-header h2 {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }
        .login-card-header p {
          font-size: 14px;
          color: var(--text-muted);
        }

        /* error banner */
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: var(--danger-light);
          color: var(--danger);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
          animation: fadeIn 0.2s ease;
          border: 1px solid rgba(220,38,38,0.2);
        }
        .login-error .material-icons { font-size: 18px; flex-shrink: 0; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* form layout */
        .login-form { display: flex; flex-direction: column; gap: 18px; }

        .login-field { display: flex; flex-direction: column; gap: 7px; }

        .login-field label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 0.2px;
        }

        .login-field-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-forgot {
          background: none;
          border: none;
          font-size: 12.5px;
          color: #1d5ba0;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          padding: 0;
          transition: opacity 0.2s;
        }
        .login-forgot:hover { opacity: 0.7; }

        .login-input-wrap {
          display: flex;
          align-items: center;
          background: var(--bg-body);
          border: 1.5px solid var(--border-color);
          border-radius: 11px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input-wrap:focus-within {
          border-color: #1d5ba0;
          box-shadow: 0 0 0 3px rgba(29,91,160,0.12);
          background: var(--bg-card);
        }

        .login-input-icon {
          padding: 0 12px;
          color: var(--text-muted);
          font-size: 20px;
          flex-shrink: 0;
          pointer-events: none;
        }
        .login-input-wrap:focus-within .login-input-icon {
          color: #1d5ba0;
        }

        .login-input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 0;
          font-size: 13.5px;
          color: var(--text-primary);
          font-family: inherit;
          outline: none;
          min-width: 0;
        }
        .login-input-wrap input::placeholder { color: var(--text-muted); }

        .login-eye-btn {
          background: none;
          border: none;
          padding: 0 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-eye-btn:hover { color: var(--text-primary); }

        /* remember me */
        .login-remember {
          display: flex;
          align-items: center;
        }
        .login-checkbox-label {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 500;
        }

        /* submit button */
        .login-submit-btn {
          width: 100%;
          padding: 13px;
          background: #1d5ba0;
          color: white;
          border: none;
          border-radius: 11px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s;
          box-shadow: 0 4px 14px rgba(29,91,160,0.35);
          margin-top: 4px;
          letter-spacing: 0.2px;
        }
        .login-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1a4f8f, #1d4ed8);
          box-shadow: 0 6px 20px rgba(29,91,160,0.45);
          transform: translateY(-1px);
        }
        .login-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .login-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .login-spinner {
          width: 17px; height: 17px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* demo section */
        .login-demo {
          margin-top: 24px;
        }
        .login-demo-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .login-demo-label::before,
        .login-demo-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-color);
        }
        .login-demo-label span {
          font-size: 11.5px;
          color: var(--text-muted);
          white-space: nowrap;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .login-demo-buttons {
          display: flex;
          gap: 10px;
        }
        .login-demo-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          background: var(--bg-body);
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .login-demo-btn:hover {
          border-color: #1d5ba0;
          color: #1d5ba0;
          background: var(--primary-light);
        }

        .login-input-wrap.has-error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }
        .login-input-wrap.has-error:focus-within {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        .login-field-error {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ef4444;
          font-size: 13px;
          font-weight: 500;
          margin-top: 6px;
          animation: slideIn 0.2s ease;
        }
        .login-field-error .material-icons {
          font-size: 16px;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-field-error.global-err {
          background: rgba(239, 68, 68, 0.08);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-top: 12px;
        }

        .login-footer-note {
          margin-top: 24px;
          text-align: center;
          font-size: 11.5px;
          color: var(--text-muted);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 820px) {
          .login-brand-panel { display: none; }
          .login-card {
            width: 100%;
            max-width: 440px;
            border-radius: 24px;
          }
          .login-center {
            border-radius: 24px;
            max-width: 440px;
          }
          .login-card-logo-sm { display: flex; }
        }

        @media (max-width: 480px) {
          .login-card { padding: 32px 24px; }
        }
      `}</style>
    </div>
  );
};

export default Login;
