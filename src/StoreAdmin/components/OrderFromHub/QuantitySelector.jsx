import React from 'react';

const QuantitySelector = ({ value, onChange, disabled }) => {
  const handleChange = (e) => {
    // Only allow numbers
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      val = 1;
    }
    onChange(val);
  };

  return (
    <div className="qty-stepper" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        min="1"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="form-control"
        style={{ width: '60px', padding: '0.2rem 0.5rem', textAlign: 'center', height: '30px' }}
      />
    </div>
  );
};

export default QuantitySelector;
