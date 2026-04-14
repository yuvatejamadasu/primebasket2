// ===========================================
//  src/components/RowDropdown.jsx
//  Per-row action menu
// ===========================================

import { useState, useRef, useEffect } from 'react';
import { Icon, icons } from './Icons';

const RowDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="dropdown-row" ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn-more"
        onClick={() => setOpen(o => !o)}
        title="More actions"
        style={{ border: '1px solid var(--border-color)', borderRadius: 10, width: 36, height: 36, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <Icon d={icons.moreH} size={16} />
      </button>

      {open && (
        <div className="dropdown-panel" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, boxShadow: 'var(--shadow-md)', zIndex: 50, minWidth: 140 }}>
          <button className="dropdown-item" type="button" style={{ width: '100%', textAlign: 'left' }} onClick={e => e.preventDefault()}>View detail</button>
          <button className="dropdown-item" type="button" style={{ width: '100%', textAlign: 'left' }} onClick={e => e.preventDefault()}>Edit info</button>
          <button className="dropdown-item danger" type="button" style={{ width: '100%', textAlign: 'left' }} onClick={e => e.preventDefault()}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default RowDropdown;
