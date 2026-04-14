import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── Single-entry helpers ───────────────────────────────────────────────────

const buildInitialData = (fields, lockedFields = {}) =>
  fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
    return acc;
  }, { ...lockedFields });

const resolveLockedFields = (fields) => {
  const locked = {};
  const initial = {};
  fields.forEach((field) => {
    if (field.lockedByAuth) {
      const sources = Array.isArray(field.lockedByAuth) ? field.lockedByAuth : [field.lockedByAuth];
      for (const source of sources) {
        const auth = JSON.parse(localStorage.getItem(source.key) || 'null');
        if (auth && auth.loggedIn && auth[source.field]) {
          initial[field.name] = auth[source.field];
          locked[field.name] = true;
          break;
        }
      }
    }
  });
  return { locked, initial };
};

// ─── Field renderer (shared between single + multi) ─────────────────────────

const FieldRenderer = ({ field, value, error, onChange, isLocked, formData, compact = false }) => {
  const baseInput = `w-full px-4 py-3 border rounded-xl outline-none transition-all`;
  const lockedStyle = `bg-gray-100 text-gray-500 font-semibold cursor-not-allowed border-gray-200`;
  const normalStyle = `bg-gray-50 focus:ring-2 focus:ring-[#1d5ba0]/20 focus:border-[#1d5ba0] border-gray-200 hover:bg-white`;
  const errorStyle = `border-red-400 bg-red-50/10`;
  const labelStyle = compact
    ? `block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1`
    : `block text-sm font-semibold text-gray-700 mb-1`;

  const isDisabled = isLocked || (field.dependsOn && !formData[field.dependsOn]);

  const className = `${baseInput} ${isDisabled ? lockedStyle : normalStyle} ${error ? errorStyle : ''}`;

  const options = field.optionsSource ? field.optionsSource(formData) : field.options || [];

  return (
    <div key={field.name}>
      <label className={labelStyle}>{field.label}</label>
      {field.type === 'select' ? (
        <select
          name={field.name}
          value={value || ''}
          onChange={onChange}
          disabled={isDisabled}
          className={className}
        >
          <option value="">{field.placeholder || `Select ${field.label}`}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          name={field.name}
          value={value || ''}
          onChange={onChange}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          disabled={isDisabled}
          className={className}
        />
      )}
      {error && (
        <p className="text-red-500 text-xs font-medium mt-1.5 ml-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  MULTI-ENTRY MODE
// ════════════════════════════════════════════════════════════════════════════

const MultiEntryForm = ({ config }) => {
  const {
    title,
    description,
    fields,
    storageKey,
    authKey,
    redirectPath = -1,
    successTitle = 'Accounts Submitted!',
    successMessage = 'You will be redirected shortly...',
    addLabel = 'Add Another',
    profileLabel = 'Profile',
    initialStatus,
    targetRole,
    approvalChain,
    alsoSaveTo = [],
  } = config;

  const navigate = useNavigate();
  const location = useLocation();
  const inHubDashboard = location.pathname.includes('/hub-dashboard');
  const isSuperAdmin = !inHubDashboard && (location.state?.creatorRole === 'super' || localStorage.getItem('superAdminAuth') === 'true');
  const isHubAdmin = localStorage.getItem('hubAdminAuth') !== null || inHubDashboard;
  const creatorRole = isSuperAdmin ? 'super' : (isHubAdmin ? 'hub' : (location.state?.creatorRole || null));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Auto-hide popup
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Resolve locked fields once (same for all entries)
  const { locked: lockedFields, initial: lockedInitial } = resolveLockedFields(fields);

  const makeEmptyEntry = () => ({
    id: `${Date.now()}-${Math.random()}`,
    ...buildInitialData(fields),
    ...lockedInitial,
  });

  const [entries, setEntries] = useState([makeEmptyEntry()]);
  const [errors, setErrors] = useState([{}]);

  const handleAddEntry = () => {
    setEntries((prev) => [...prev, makeEmptyEntry()]);
    setErrors((prev) => [...prev, {}]);
  };

  const handleRemoveEntry = (idx) => {
    if (entries.length === 1) return;
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (entryIdx, e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[entryIdx], [name]: finalValue };

      // Reset dependents recursively
      const resetDependents = (fieldName) => {
        fields.forEach((f) => {
          if (f.dependsOn === fieldName && !lockedFields[f.name]) {
            entry[f.name] = '';
            resetDependents(f.name);
          }
        });
      };
      resetDependents(name);
      updated[entryIdx] = entry;
      return updated;
    });

    setErrors((prev) => {
      const updated = [...prev];
      if (updated[entryIdx][name]) {
        updated[entryIdx] = { ...updated[entryIdx], [name]: '' };
      }
      return updated;
    });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = entries.map(() => ({}));
    const seenEmails = [];
    const seenPhones = [];

    entries.forEach((entry, idx) => {
      fields.forEach((field) => {
        const value = entry[field.name];
        if (field.validation?.required && (!value || (typeof value === 'string' && !value.trim()))) {
          newErrors[idx][field.name] = field.validation.required;
          isValid = false;
        } else if (field.validation?.pattern && value && !field.validation.pattern.value.test(value)) {
          newErrors[idx][field.name] = field.validation.pattern.message;
          isValid = false;
        } else if (field.validation?.minLength && value && value.length < field.validation.minLength.value) {
          newErrors[idx][field.name] = field.validation.minLength.message;
          isValid = false;
        }


      });

      // Cross-entry duplicate checks
      if (entry.email) {
        const normalized = entry.email.trim().toLowerCase();
        if (seenEmails.includes(normalized)) {
          newErrors[idx].email = 'Duplicate email within form';
          isValid = false;
        }
        seenEmails.push(normalized);
      }
      if (entry.phone) {
        const normalized = entry.phone.trim();
        if (seenPhones.includes(normalized)) {
          newErrors[idx].phone = 'Duplicate phone within form';
          isValid = false;
        }
        seenPhones.push(normalized);
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (config.onSubmitOverride) {
      setIsSubmitting(true);
      await config.onSubmitOverride(entries);
      setIsSubmitting(false);
      setShowPopup(true);
      return;
    }

    setIsSubmitting(true);

    const isHubAdminCreatingStore = isHubAdmin && title.toLowerCase().includes('store');
    const shouldRequireApproval = isHubAdminCreatingStore || (!isSuperAdmin && title.toLowerCase().includes('store'));
    const status = isSuperAdmin ? 'Approved' : (shouldRequireApproval ? 'Pending' : 'Approved');

    const newEntries = entries.map((entry) => ({
      ...entry,
      id: `req-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status,
      targetRole: shouldRequireApproval ? 'super-admin' : (targetRole || null),
      approvalChain: approvalChain || [],
      storageKey,
      type: title.includes('Store') ? 'STORE' : title.replace('Create ', '').replace(' Account', ''),
      createdAt: new Date().toISOString(),
    }));

    if (status === 'Pending') {
      const pending = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
      localStorage.setItem('pendingRequests', JSON.stringify([...pending, ...newEntries]));
      
      // TRIGGER EMAIL TO SUPER ADMIN FOR HUB ADMIN CREATION
      if (isHubAdmin && title.includes('Store')) {
        import('../utils/emailMock').then(({ sendStoreRequestToSuperEmail }) => {
          newEntries.forEach(entry => sendStoreRequestToSuperEmail(entry));
        });
      }
    } else {
      // Save to primary storage key
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...existing, ...newEntries]));

      // Also save to any additional keys (e.g. approvedUsers for login lookup)
      alsoSaveTo.forEach((extraKey) => {
        const extraData = JSON.parse(localStorage.getItem(extraKey) || '[]');
        localStorage.setItem(extraKey, JSON.stringify([...extraData, ...newEntries]));
      });

      // TRIGGER EMAIL FOR SUPER ADMIN DIRECT CREATION
      if (isSuperAdmin) {
        const { sendDirectCreationEmail } = await import('../utils/emailMock');
        newEntries.forEach(entry => {
          sendDirectCreationEmail(entry);
        });
      }
    }

    setIsSubmitting(false);
    setShowPopup(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center py-20 pb-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{successTitle}</h2>
          <p className="text-gray-500">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-transparent mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className="p-6 bg-white rounded-3xl shadow-xl border border-gray-100 relative animate-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
              <h3 className="font-bold tracking-tight text-[#1d5ba0]">
                {profileLabel} {idx + 1}
              </h3>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEntry(idx)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.filter((f) => f.type !== 'checkbox').map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={entry[field.name]}
                  error={errors[idx]?.[field.name]}
                  onChange={(e) => handleChange(idx, e)}
                  isLocked={!!lockedFields[field.name]}
                  formData={entry}
                  compact
                />
              ))}
            </div>

            {/* Checkboxes */}
            {fields.filter((f) => f.type === 'checkbox').map((field) => (
              <div key={field.name} className="flex items-center gap-3 py-2 px-1 mt-3">
                <input
                  type="checkbox"
                  id={`${field.name}-${idx}`}
                  name={field.name}
                  checked={!!entry[field.name]}
                  onChange={(e) => handleChange(idx, e)}
                  className="w-4 h-4 text-[#1d5ba0] border-gray-300 rounded focus:ring-[#1d5ba0]"
                />
                <label htmlFor={`${field.name}-${idx}`} className="text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleAddEntry}
            className="w-full py-4 bg-white border-2 border-dashed border-gray-200 text-gray-500 rounded-3xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#1d5ba0] group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            {addLabel}
          </button>

          <button
            type="submit"
            disabled={isSubmitting || showPopup}
            className={`w-full py-4 bg-[#1d5ba0] text-white rounded-3xl font-bold transition-all hover:shadow-xl hover:shadow-[#1d5ba0]/20 active:scale-[0.99] text-lg ${
              (isSubmitting || showPopup) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#164d8a]'
            }`}
          >
            {isSubmitting ? 'Processing...' : `Generate Approval Requests (${entries.length})`}
          </button>
        </div>
      </form>

      {/* Success Popup Notification (Only triggers for Store accounts when approval logic applies) */}
      {showPopup && title.toLowerCase().includes('store') && (isHubAdmin || !isSuperAdmin) && (
        <div className="fixed top-8 right-8 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 font-bold border-l-4 border-emerald-300">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
           </svg>
           {isHubAdmin ? "approvals send to super admin" : "approvals send to super admin"}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SINGLE-ENTRY MODE (original behaviour)
// ════════════════════════════════════════════════════════════════════════════

const SingleEntryForm = ({ config }) => {
  const {
    title,
    description,
    fields,
    storageKey,
    authKey,
    redirectPath = -1,
    successTitle = 'Account Created Successfully!',
    successMessage = 'Redirecting to login...',
    maxWidth = 'max-w-lg',
    initialStatus,
    targetRole,
    approvalChain,
  } = config;

  const navigate = useNavigate();
  const location = useLocation();
  const inHubDashboard = location.pathname.includes('/hub-dashboard');
  const isSuperAdmin = !inHubDashboard && (location.state?.creatorRole === 'super' || localStorage.getItem('superAdminAuth') === 'true');
  const isHubAdmin = localStorage.getItem('hubAdminAuth') !== null || inHubDashboard;
  const creatorRole = isSuperAdmin ? 'super' : (isHubAdmin ? 'hub' : (location.state?.creatorRole || null));
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lockedFields, setLockedFields] = useState({});

  useEffect(() => {
    const { locked, initial } = resolveLockedFields(fields);
    const base = buildInitialData(fields);
    setFormData({ ...base, ...initial });
    setLockedFields(locked);
  }, [fields]);

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = formData[field.name];
      if (field.validation?.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = field.validation.required;
      } else if (field.validation?.pattern && value && !field.validation.pattern.value.test(value)) {
        newErrors[field.name] = field.validation.pattern.message;
      } else if (field.validation?.minLength && value && value.length < field.validation.minLength.value) {
        newErrors[field.name] = field.validation.minLength.message;
      }

    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };
      const resetDependents = (fieldName) => {
        fields.forEach((f) => {
          if (f.dependsOn === fieldName && !lockedFields[f.name]) {
            updated[f.name] = '';
            resetDependents(f.name);
          }
        });
      };
      resetDependents(name);
      return updated;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const status = creatorRole === 'super' ? 'Approved' : (initialStatus || 'Pending');
    const newData = {
      ...formData,
      id: `req-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status,
      targetRole: targetRole || null,
      approvalChain: approvalChain || [],
      storageKey,
      type: title.includes('Store') ? 'STORE' : title.split(' ')[1],
      createdAt: new Date().toISOString(),
    };

    if (status === 'Pending') {
      const pending = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
      localStorage.setItem('pendingRequests', JSON.stringify([...pending, newData]));

      // TRIGGER EMAIL TO SUPER ADMIN FOR HUB ADMIN CREATION
      if (isHubAdmin && title.includes('Store')) {
        import('../utils/emailMock').then(({ sendStoreRequestToSuperEmail }) => {
          sendStoreRequestToSuperEmail(newData);
        });
      }
    } else {
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...existing, newData]));
      if (authKey && status === 'Approved') {
        localStorage.setItem(authKey, JSON.stringify({ ...newData, loggedIn: true }));
      }
      
      // TRIGGER EMAIL FOR SUPER ADMIN DIRECT CREATION
      if (isSuperAdmin) {
        import('../utils/emailMock').then(({ sendDirectCreationEmail }) => {
          sendDirectCreationEmail(newData);
        });
      }
    }

    setIsSubmitted(true);
    setTimeout(() => {
      if (redirectPath === -1) navigate(-1);
      else navigate(redirectPath);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center py-20 pb-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{successTitle}</h2>
          <p className="text-gray-500">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${maxWidth} mx-auto p-6 bg-white rounded-3xl shadow-xl border border-gray-100 mb-12`}>
      <h2 className="text-3xl font-bold mb-3">{title}</h2>
      <p className="text-sm text-gray-600 mb-5">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {fields.filter((f) => f.type !== 'checkbox').map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={formData[field.name]}
              error={errors[field.name]}
              onChange={handleChange}
              isLocked={!!lockedFields[field.name]}
              formData={formData}
            />
          ))}
        </div>

        {fields.filter((f) => f.type === 'checkbox').map((field) => (
          <div key={field.name} className="flex items-center gap-3 py-2 px-1">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={!!formData[field.name]}
              onChange={handleChange}
              className="w-4 h-4 text-[#1d5ba0] border-gray-300 rounded focus:ring-[#1d5ba0]"
            />
            <label htmlFor={field.name} className="text-sm font-semibold text-gray-700">
              {field.label}
            </label>
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 bg-[#1d5ba0] text-white rounded-xl font-bold hover:bg-[#164d8a] transition-all active:scale-95 mt-2"
        >
          {fields.some((f) => f.name === 'email') ? 'Create Account' : 'Submit Form'}
        </button>
      </form>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ROOT EXPORT — routes to multi or single based on config.multiEntry
// ════════════════════════════════════════════════════════════════════════════

const DynamicForm = ({ config }) => {
  if (config.multiEntry) {
    return <MultiEntryForm config={config} />;
  }
  return <SingleEntryForm config={config} />;
};

export default DynamicForm;
