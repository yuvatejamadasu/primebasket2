import React from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';

const AddButton = ({ onClick, isAdded }) => {
  return (
    <button
      onClick={onClick}
      disabled={isAdded}
      className={`hub-add-btn ${isAdded ? 'hub-add-btn--added' : ''}`}
    >
      {isAdded ? (
        <>
          <CheckCircle2 size={15} />
          <span>Added</span>
        </>
      ) : (
        <>
          <Plus size={15} />
          <span>Add</span>
        </>
      )}
    </button>
  );
};

export default AddButton;
