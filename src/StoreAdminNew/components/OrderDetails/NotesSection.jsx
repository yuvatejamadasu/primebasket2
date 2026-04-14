import { useState } from 'react';

const NotesSection = () => {
  const [note, setNote] = useState('');

  return (
    <div className="card">
      <div className="card-body">
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 14 }}>Notes</div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Type some note"
          style={{ width: '100%', minHeight: 110, border: '1px solid var(--border-color)', borderRadius: 12, padding: 14, fontSize: 14, color: 'var(--text-primary)', background: 'var(--bg-body)', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
        />
        <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: 14 }}>
          Save note
        </button>
      </div>
    </div>
  );
};

export default NotesSection;
