import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Login = () => {
  // Using context available in current project
  const { isDark, toggleTheme } = useTheme();
  // Instead of 'theme', the existing system exposes 'isDark' and 'toggleTheme'
  const themeMode = isDark ? 'dark' : 'light';

  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    // Required by user Step 2: "Ensure login button still redirects: navigate('/super-admin-dashboard');"
    localStorage.setItem('superAdminAuth', 'true');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="login-page" data-theme={themeMode}>
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
          {themeMode === 'dark' ? 'light_mode' : 'nights_stay'}
        </span>
      </button>

      <div className="login-center">
        {/* ── Form card ── */}
        <div className={`login-card${shake ? ' shake' : ''}`}>
          {/* Header */}
          <div className="login-card-header">
            <h2>Login Form</h2>
            <p>Sign in to your dashboard</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="login-error">
              <span className="material-icons">error_outline</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <div className="login-input-wrap">
                <span className="material-icons login-input-icon">mail_outline</span>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@primebasket.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field-row">
                <label htmlFor="password">Password</label>
                <button type="button" className="login-forgot">Forgot password?</button>
              </div>
              <div className="login-input-wrap">
                <span className="material-icons login-input-icon">lock_outline</span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                  required
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

          <p className="login-footer-note">
            © {new Date().getFullYear()} Prime-Basket. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        /* ── LOGIN PAGE STYLES ─────────────────────── */
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-body, #f8fafc);
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
        }

        .login-page[data-theme="dark"] {
          background: #1a1d21;
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
        .login-page[data-theme="dark"] .login-blob { opacity: 0.12; }

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
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 50%;
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary, #64748b);
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.2s;
          z-index: 10;
        }
        .login-page[data-theme="dark"] .login-theme-btn {
          background: #2c3136;
          border-color: #374151;
          color: #9ca3af;
        }
        .login-theme-btn:hover {
          color: #1d5ba0;
          border-color: #1d5ba0;
        }

        /* centre wrapper */
        .login-center {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 440px;
          min-height: 520px;
          border-radius: 24px;
          position: relative;
          z-index: 1;
        }

        /* ── Form card right panel ── */
        .login-card {
          width: 100%;
          background: var(--bg-card, #ffffff);
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0,0,0,0.18);
          border-radius: 24px;
        }

        .login-page[data-theme="dark"] .login-card {
          background: #2c3136;
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
          background: #eff6ff;
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
          color: var(--text-primary, #1e293b);
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }
        .login-page[data-theme="dark"] .login-card-header h2 { color: #f8fafc; }

        .login-card-header p {
          font-size: 14px;
          color: var(--text-muted, #64748b);
        }
        .login-page[data-theme="dark"] .login-card-header p { color: #94a3b8; }

        /* error banner */
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: #fef2f2;
          color: #ef4444;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
          animation: fadeIn 0.2s ease;
          border: 1px solid rgba(220,38,38,0.2);
        }
        .login-page[data-theme="dark"] .login-error { background: rgba(239, 68, 68, 0.1); }
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
          color: var(--text-secondary, #64748b);
          letter-spacing: 0.2px;
        }
        .login-page[data-theme="dark"] .login-field label { color: #9ca3af; }

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
          background: var(--bg-body, #f8fafc);
          border: 1.5px solid var(--border-color, #e2e8f0);
          border-radius: 11px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-page[data-theme="dark"] .login-input-wrap {
          background: #1a1d21;
          border-color: #374151;
        }
        .login-input-wrap:focus-within {
          border-color: #1d5ba0;
          box-shadow: 0 0 0 3px rgba(29,91,160,0.12);
          background: var(--bg-card, #ffffff);
        }
        .login-page[data-theme="dark"] .login-input-wrap:focus-within { background: #2c3136; }

        .login-input-icon {
          padding: 0 12px;
          color: var(--text-muted, #94a3b8);
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
          color: var(--text-primary, #1e293b);
          font-family: inherit;
          outline: none;
          min-width: 0;
        }
        .login-page[data-theme="dark"] .login-input-wrap input { color: #f8fafc; }
        .login-input-wrap input::placeholder { color: var(--text-muted, #94a3b8); }

        .login-eye-btn {
          background: none;
          border: none;
          padding: 0 12px;
          color: var(--text-muted, #94a3b8);
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-eye-btn:hover { color: var(--text-primary, #1e293b); }
        .login-page[data-theme="dark"] .login-eye-btn:hover { color: #f8fafc; }

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
          color: var(--text-secondary, #64748b);
          cursor: pointer;
          font-weight: 500;
        }
        .login-page[data-theme="dark"] .login-checkbox-label { color: #9ca3af; }

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

        .login-footer-note {
          margin-top: 24px;
          text-align: center;
          font-size: 11.5px;
          color: var(--text-muted, #64748b);
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
