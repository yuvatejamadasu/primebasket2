import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import '../styles/SidebarForm.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const categoryProducts = {
  Grocery:   ['Rice', 'Wheat', 'Dal', 'Sugar', 'Atta', 'Oil'],
  Dairy:     ['Milk', 'Curd', 'Butter', 'Paneer', 'Ghee', 'Cheese'],
  Beverages: ['Orange Juice', 'Mango Juice', 'Coconut Water', 'Cold Coffee', 'Lemon Soda'],
  Snacks:    ['Biscuits', 'Chips', 'Namkeen', 'Cookies', 'Popcorn'],
};

// Product-to-Brand mapping
const productBrands = {
  Rice: ['India Gate', 'Daawat', 'Kohinoor', 'Local'],
  Wheat: ['Aashirvaad', 'Pillsbury', 'Patanjali', 'Local'],
  Dal: ['Tata Sampann', 'Rajdhani', 'Local'],
  Sugar: ['Madhur', 'Parry', 'Local'],
  Atta: ['Aashirvaad', 'Pillsbury', 'Fortune', 'Local'],
  Oil: ['Fortune', 'Saffola', 'Sundrop', 'Dhara'],
  Milk: ['Amul', 'Nestle', 'Heritage', 'Mother Dairy'],
  Curd: ['Amul', 'Milky Mist', 'Nestle', 'Mother Dairy'],
  Butter: ['Amul', 'Nutralite', 'Mother Dairy'],
  Paneer: ['Amul', 'Gowardhan', 'Local'],
  Ghee: ['Amul', 'Patanjali', 'Gowardhan'],
  Cheese: ['Amul', 'Go', 'Britannia', 'Laughing Cow'],
  'Orange Juice': ['Tropicana', 'Real', 'B Natural'],
  'Mango Juice': ['Maaza', 'Slice', 'Frooti'],
  'Coconut Water': ['Paper Boat', 'Raw Pressery'],
  'Cold Coffee': ['Nescafe', 'Amul', 'Starbucks'],
  'Lemon Soda': ['Sprite', '7UP', 'Limca'],
  Biscuits: ['Parle-G', 'Britannia', 'Sunfeast', 'Oreo'],
  Chips: ['Lays', 'Bingo', 'Uncle Chipps', 'Doritos'],
  Namkeen: ['Haldiram', 'Bikano', 'Balaji'],
  Cookies: ['Hide & Seek', 'Good Day', "Mom's Magic"],
  Popcorn: ['Act II', '4700BC', 'PVR Popcorn'],
};

// Product-type classification
const liquidProducts = new Set(['Milk', 'Orange Juice', 'Mango Juice', 'Coconut Water', 'Cold Coffee', 'Lemon Soda', 'Oil', 'Ghee']);
const packProducts   = new Set(['Biscuits', 'Chips', 'Namkeen', 'Cookies', 'Popcorn', 'Cheese', 'Butter']);

// Unit suggestions per product type
const unitSuggestions = {
  liquid: { presets: ['250 ml', '500 ml', '1 L', '2 L', '5 L'], units: ['ml', 'L'] },
  pack:   { presets: ['1 Pack', '2 Packs', '5 Packs', '10 Packs'], units: ['Pack', 'Packs', 'Box', 'Pieces'] },
  weight: { presets: ['250 g', '500 g', '1 kg', '5 kg'], units: ['g', 'kg'] },
};

function getWeightType(product) {
  if (!product) return 'weight';
  if (liquidProducts.has(product)) return 'liquid';
  if (packProducts.has(product))   return 'pack';
  return 'weight';
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  category:     '',
  productName:  '',
  brand:        '',
  weight:       '',   // free-text — the single source of truth
  sellingPrice: '',
  mrp:          '',
  itemsCount:   '',
  details:      '',
};

// ─── Component ────────────────────────────────────────────────────────────────

const SidebarForm = ({ onAddProduct }) => {
  const { isDark } = useTheme();
  const [formData,     setFormData]     = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors,       setErrors]       = useState({});
  const [unitHelper,   setUnitHelper]   = useState('');   // unit dropdown — optional helper

  const weightInputRef = useRef(null);

  // Derived
  const availableProducts = formData.category ? categoryProducts[formData.category] : [];
  const availableBrands   = formData.productName ? productBrands[formData.productName] || [] : [];
  const weightType        = getWeightType(formData.productName);
  const { presets, units } = unitSuggestions[weightType];

  // Reset weight + unit helper when product changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, weight: '', brand: '' }));
    setUnitHelper('');
  }, [formData.productName]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { productName: '', brand: '', weight: '' } : {}),
      ...(name === 'productName' ? { brand: '' } : {}),
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // Preset chip click → set weight textbox directly
  const handlePresetClick = (preset) => {
    setFormData(prev => ({ ...prev, weight: preset }));
    if (errors.weight) setErrors(prev => ({ ...prev, weight: null }));
    weightInputRef.current?.focus();
  };

  // Unit helper dropdown → append unit to whatever numeric prefix is in the textbox
  const handleUnitHelperChange = (e) => {
    const unit = e.target.value;
    setUnitHelper(unit);
    if (!unit) return;

    // Extract numeric portion already in the box (strip old unit suffix)
    const current = formData.weight.trim();
    const numeric  = current.replace(/[a-zA-Z\s]+$/, '').trim();
    const newValue = numeric ? `${numeric} ${unit}` : unit;

    setFormData(prev => ({ ...prev, weight: newValue }));
    if (errors.weight) setErrors(prev => ({ ...prev, weight: null }));
    // Reset helper so user can re-pick
    setTimeout(() => setUnitHelper(''), 300);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file));
      if (errors.imageFile) setErrors(prev => ({ ...prev, imageFile: null }));
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.category)     errs.category     = 'Category is required';
    if (!formData.productName)  errs.productName  = 'Product is required';
    if (formData.productName && availableBrands.length > 0 && !formData.brand) errs.brand = 'Brand is required';
    if (!formData.weight.trim()) errs.weight       = 'Weight / Qty is required';
    if (!formData.sellingPrice) errs.sellingPrice  = 'Selling price is required';
    if (!formData.mrp)          errs.mrp           = 'MRP is required';
    if (!imagePreview)          errs.imageFile     = 'Product image is required';

    if (formData.sellingPrice && formData.mrp &&
        Number(formData.sellingPrice) > Number(formData.mrp)) {
      errs.sellingPrice = 'Selling price cannot exceed MRP';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddProduct({
      id:       Date.now().toString(),
      ...formData,
      weight:   formData.weight.trim(),
      weightType,
      imageUrl: imagePreview,
    });

    setFormData(INITIAL_FORM);
    setImagePreview(null);
    setUnitHelper('');
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const typeLabel = weightType === 'liquid' ? 'Volume' : weightType === 'pack' ? 'Qty / Pack' : 'Weight';
  const typeBadge = weightType === 'liquid' ? 'Liquid' : weightType === 'pack' ? 'Pack' : 'Weight';

  return (
    <div className={`sidebar-container transition-all duration-300 ${isDark ? 'sidebar-dark' : ''}`}>

      {/* ── Header ── */}
      <div className={`sidebar-header border-b transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className={`sidebar-logo ${isDark ? 'bg-brand/20 text-brand-lightdark' : 'bg-brand text-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div>
          <h2 className={isDark ? 'text-white' : 'text-slate-800'}>Product Add Form</h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Fill in the details to add a product</p>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="sidebar-content">
        <form onSubmit={handleSubmit} className="product-form">

          {/* 1. Category */}
          <div className="form-group">
            <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Category <span className="required">*</span></label>
            <div className={`select-wrapper ${isDark ? 'dark-select' : ''}`}>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              >
                <option value="">Select Category</option>
                {Object.keys(categoryProducts).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {errors.category && <span className="error-msg">{errors.category}</span>}
          </div>

          {/* 2. Product */}
          <div className="form-group">
            <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Product <span className="required">*</span></label>
            <div className={`select-wrapper ${isDark ? 'dark-select' : ''}`}>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                disabled={!formData.category}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white disabled:opacity-50' : ''}
              >
                <option value="">Select Product</option>
                {availableProducts.map(prod => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </div>
            {errors.productName && <span className="error-msg">{errors.productName}</span>}
          </div>

          {/* 2.5 Brand */}
          <div className="form-group">
            <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Brand <span className="required">*</span></label>
            <div className={`select-wrapper ${isDark ? 'dark-select' : ''}`}>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                disabled={!formData.productName || availableBrands.length === 0}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white disabled:opacity-50' : ''}
              >
                <option value="">Select Brand</option>
                {availableBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            {errors.brand && <span className="error-msg">{errors.brand}</span>}
          </div>

          {/* 3. Quantity / Weight — free-text + unit helper */}
          <div className="form-group">
            <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              {typeLabel} <span className="required">*</span>
              {formData.productName && (
                <span className={`unit-badge unit-${weightType} ${isDark ? 'opacity-90 shadow-none' : ''}`}>{typeBadge}</span>
              )}
            </label>

            {/* Preset chips (quick-fill shortcuts) */}
            {formData.productName && (
              <div className="preset-chips">
                {presets.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`chip ${formData.weight === p ? 'chip--active' : ''} ${isDark ? 'chip-dark focus:ring-brand shadow-none' : ''}`}
                    onClick={() => handlePresetClick(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Main row: text input + unit helper dropdown */}
            <div className="qty-row">
              <div className="qty-textbox-wrapper text-white">
                <input
                  ref={weightInputRef}
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g. 750g, 1.5 kg, 2 L, 3 packs"
                  className={`qty-input ${errors.weight ? 'input-error' : ''} ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : ''}`}
                  disabled={!formData.productName}
                  autoComplete="off"
                />
                {formData.weight && (
                  <button
                    type="button"
                    className={`qty-clear ${isDark ? 'text-slate-400 hover:text-white' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, weight: '' }));
                      setUnitHelper('');
                      weightInputRef.current?.focus();
                    }}
                    title="Clear"
                  >✕</button>
                )}
              </div>

              {/* Unit helper — optional, appends unit to textbox */}
              <div className="unit-helper-wrapper">
                <select
                  className={`unit-helper-select ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : ''}`}
                  value={unitHelper}
                  onChange={handleUnitHelperChange}
                  disabled={!formData.productName}
                  title="Pick a unit to append"
                >
                  <option value="">Unit</option>
                  {units.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {errors.weight && <span className="error-msg">{errors.weight}</span>}

            {/* Live preview of entered value */}
            {formData.weight.trim() && (
              <div className="weight-preview">
                <span className="weight-preview-label">Entered:</span>
                <span className="weight-preview-value">{formData.weight.trim()}</span>
              </div>
            )}
          </div>

          {/* 4 & 5. Prices */}
          <div className="form-row">
            <div className="form-group half">
              <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Selling Price <span className="required">*</span></label>
              <div className="input-with-prefix">
                <span className={`prefix ${isDark ? 'text-slate-400 bg-slate-700 border-slate-600' : ''}`}>₹</span>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="1"
                  min="0"
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : ''}
                />
              </div>
              {errors.sellingPrice && <span className="error-msg">{errors.sellingPrice}</span>}
            </div>

            <div className="form-group half">
              <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>MRP <span className="required">*</span></label>
              <div className="input-with-prefix">
                <span className={`prefix ${isDark ? 'text-slate-400 bg-slate-700 border-slate-600' : ''}`}>₹</span>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="1"
                  min="0"
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : ''}
                />
              </div>
              {errors.mrp && <span className="error-msg">{errors.mrp}</span>}
            </div>
          </div>

          {/* 6. Number of Items */}
          <div className="form-group">
            <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Number of Items</label>
            <input
              type="number"
              name="itemsCount"
              value={formData.itemsCount}
              onChange={handleInputChange}
              placeholder="e.g. 50"
              min="1"
              className={isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : ''}
            />
          </div>

          {/* 7. Image Upload */}
          <div className="form-group">
            <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Product Image <span className="required">*</span></label>
            <div className={`file-upload-wrapper ${imagePreview ? 'has-image' : ''} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {!imagePreview && (
                <div className={`upload-placeholder ${isDark ? 'text-slate-500 hover:text-slate-400' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" strokeWidth="1.5"
                       strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-slate-600' : ''}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className={isDark ? 'text-slate-400 font-bold' : ''}>Click to upload image</span>
                  <small>PNG, JPG, WEBP supported</small>
                </div>
              )}
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <div className="change-image-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Change</span>
                  </div>
                </div>
              )}
            </div>
            {errors.imageFile && <span className="error-msg">{errors.imageFile}</span>}
          </div>

          {/* 8. Details */}
          <div className="form-group">
            <label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter product description..."
              className={isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : ''}
            />
          </div>

        </form>
      </div>

      {/* ── Sticky footer ── */}
      <div className={`sidebar-footer border-t transition-all duration-300 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100'}`}>
        <button type="button" className={`btn-submit shadow-xl ${isDark ? 'shadow-brand/20' : ''}`} onClick={handleSubmit}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>
    </div>
  );
};

export default SidebarForm;
