import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarForm from './components/SidebarForm';
import ProductPreview from './components/ProductPreview';
import { useTheme } from '../../context/ThemeContext';
import './styles/ProductPage.css';

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleFinalSubmit = () => {
    navigate('/hub-dashboard/final-summary', { state: { products } });
  };

  return (
    <div className={`add-product-page p-6 min-h-full transition-all duration-300 ${
      isDark ? 'bg-[#1a1d21]' : 'bg-slate-50'
    }`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT — sticky form: stays visible while right column scrolls */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden sticky self-start transition-all duration-300 ${
          isDark ? 'bg-[#2c3136] border-slate-700/50 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <SidebarForm onAddProduct={handleAddProduct} />
        </div>

        {/* RIGHT — capped height preview: scrolls internally */}
        <div className={`preview-panel-wrapper rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
          isDark ? 'bg-[#212529] border-slate-700/50 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <ProductPreview products={products} onFinalSubmit={handleFinalSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
