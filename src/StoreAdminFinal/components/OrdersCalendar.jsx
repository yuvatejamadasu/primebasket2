// ===========================================
//  src/components/OrdersCalendar.jsx
//  Date picker with order indicators
// ===========================================

import { useState, useRef, useEffect } from 'react';
import { Icon, icons } from './Icons';
import { pad2, todayStr, currentYear, currentMonth } from '../data/ordersData';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const OrdersCalendar = ({ orders, selectedDate, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(currentYear);
  const [viewMonth, setViewMonth] = useState(currentMonth);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const countMap = {};
  orders.forEach(o => {
    if (!countMap[o.isoDate]) countMap[o.isoDate] = { total: 0, received: 0, pending: 0 };
    countMap[o.isoDate].total++;
    if (o.status === 'Received') countMap[o.isoDate].received++;
    else countMap[o.isoDate].pending++;
  });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cellDate = day => `${viewYear}-${pad2(viewMonth + 1)}-${pad2(day)}`;

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handlePrev = e => {
    e.stopPropagation();
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const handleNext = e => {
    e.stopPropagation();
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const btnLabel = selectedDate
    ? (() => {
        const [y, m, d] = selectedDate.split('-');
        return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      })()
    : 'All Dates';

  return (
    <div className="cal-wrapper" ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className={`cal-trigger-btn${selectedDate ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 14px', background: 'var(--bg-card)', cursor: 'pointer' }}
      >
        <Icon d={icons.calIcon} size={15} />
        <span>{btnLabel}</span>
        {selectedDate && (
          <span
            className="cal-clear"
            onClick={e => { e.stopPropagation(); onSelect(null); }}
            style={{ marginLeft: 8, cursor: 'pointer' }}
          >
            ✕
          </span>
        )}
      </button>

      {open && (
        <div className="cal-popover" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, boxShadow: 'var(--shadow-md)', padding: 16, zIndex: 100 }}>
          <div className="cal-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button type="button" className="cal-nav-btn" onClick={handlePrev} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <Icon d={icons.chevronL} size={18} />
            </button>
            <span className="cal-month-label" style={{ fontWeight: 600 }}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" className="cal-nav-btn" onClick={handleNext} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <Icon d={icons.chevronR} size={18} />
            </button>
          </div>

          <div className="cal-day-names" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            {DAY_LABELS.map(name => <div key={name} className="cal-day-name">{name}</div>)}
          </div>

          <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} className="cal-cell empty" style={{ minHeight: 50 }} />;

              const ds = cellDate(day);
              const info = countMap[ds];
              const isToday = ds === todayStr;
              const isSel = ds === selectedDate;

              return (
                <div
                  key={idx}
                  className={`cal-cell${isToday ? ' today' : ''}${isSel ? ' selected' : ''}`}
                  style={{ minHeight: 60, padding: 8, borderRadius: 12, background: isSel ? 'rgba(29, 91, 160, 0.08)' : 'transparent', border: isSel ? '1px solid var(--primary)' : '1px solid transparent', cursor: 'pointer', position: 'relative' }}
                  onClick={() => { onSelect(isSel ? null : ds); setOpen(false); }}
                >
                  <span className="cal-day-num" style={{ display: 'block', fontSize: 13, fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--primary)' : 'var(--text-primary)' }}>{day}</span>

                  {info && info.total <= 3 && (
                    <div className="cal-dots" style={{ display: 'flex', gap: 3, marginTop: 6, justifyContent: 'center' }}>
                      {Array.from({ length: info.received }).map((_, i) => (
                        <span key={`r${i}`} className="cal-dot dot-received" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                      ))}
                      {Array.from({ length: info.pending }).map((_, i) => (
                        <span key={`p${i}`} className="cal-dot dot-pending" style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                      ))}
                    </div>
                  )}

                  {info && info.total > 3 && (
                    <div className="cal-count" style={{ position: 'absolute', bottom: 8, right: 8, padding: '2px 6px', borderRadius: 9999, background: 'rgba(29, 91, 160, 0.12)', color: 'var(--primary)', fontSize: 11 }}>
                      +{info.total}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="cal-legend" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, gap: 8 }}>
            <div className="cal-legend-item" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span className="cal-legend-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              Received
            </div>
            <div className="cal-legend-item" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span className="cal-legend-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              Pending
            </div>
            <div className="cal-legend-item" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span className="cal-legend-dot" style={{ width: 10, height: 10, borderRadius: '4px', background: '#1d5ba0' }} />
              Today
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersCalendar;
