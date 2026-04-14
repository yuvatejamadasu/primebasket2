import React from 'react';
import BrandCard from '../components/BrandCard';
import '../styles/BrandPage.css';

const makeLogo = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const brandLogos = {
  cardinal: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><circle cx="160" cy="100" r="72" fill="#d12b2f"/><path d="M110 90 C130 50 190 50 210 90 C215 110 195 130 160 130 C130 130 110 110 110 90 Z" fill="#ffffff"/><circle cx="150" cy="90" r="10" fill="#000000"/></svg>`
  ),
  birdfly: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M80 120 C90 80 140 50 180 70 C210 85 230 110 230 135 C230 155 210 170 180 170 C140 170 110 150 90 130 C85 125 82 122 80 120 Z" fill="#f1c40f"/><path d="M120 100 C130 90 155 85 175 95" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/></svg>`
  ),
  cocorico: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M90 110 C90 60 120 35 170 35 C210 35 240 60 240 100 C240 130 215 160 170 160 C125 160 95 135 90 110 Z" fill="#f79b24"/><path d="M140 60 C145 45 160 38 175 45 C185 50 190 65 180 75" stroke="#c85f16" stroke-width="14" stroke-linecap="round" fill="none"/></svg>`
  ),
  yogilist: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M80 130 C110 80 160 60 160 60 C160 60 210 80 240 130 C210 120 170 85 160 85 C150 85 110 120 80 130 Z" fill="#7c3aed"/><path d="M90 140 C130 110 170 110 210 140" fill="#8b5cf6"/><circle cx="160" cy="120" r="15" fill="#ffffff"/></svg>`
  ),
  acerie: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#f4f7fb"/><path d="M80 110 Q140 45 210 110 T260 145 Q210 100 180 105 T120 140 Q90 160 80 110 Z" fill="#111827"/><path d="M90 105 Q140 70 190 105" stroke="#ffffff" stroke-width="14" fill="none"/></svg>`
  ),
  shivakin: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M160 40 Q190 40 210 70 Q225 95 210 120 Q190 155 160 170 Q130 155 110 120 Q95 95 110 70 Q130 40 160 40 Z" fill="#e11d48"/><path d="M100 70 L120 60 L140 75 L160 60 L180 75 L200 60 L220 70" stroke="#ffffff" stroke-width="10" fill="none"/></svg>`
  ),
  acera: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M160 40 L235 80 L210 150 L160 170 L110 150 L85 80 Z" fill="#dc2626"/><path d="M130 90 L165 130 L190 90" stroke="#ffffff" stroke-width="14" stroke-linecap="round" fill="none"/></svg>`
  ),
  lion: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M160 40 C205 40 235 75 235 105 C235 125 205 140 180 145 C190 150 190 165 170 170 C150 165 150 150 160 145 C130 142 105 125 105 105 C105 75 135 40 160 40 Z" fill="#111827"/><circle cx="150" cy="100" r="8" fill="#ffffff"/><circle cx="175" cy="100" r="8" fill="#ffffff"/><path d="M145 125 Q160 140 175 125" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`
  ),
  twohand: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M100 130 C90 80 135 65 170 70 C210 77 215 125 200 155 C170 190 120 190 100 130 Z" fill="#0ea5e9"/><path d="M220 115 C240 70 285 70 295 110 C305 150 270 180 240 150 C230 140 225 130 220 115 Z" fill="#22c55e"/></svg>`
  ),
  kiaomin: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M70 150 L140 60 L210 150 Z" fill="#ef4444"/><path d="M110 150 L160 95 L230 150 Z" fill="#2563eb"/><path d="M155 145 L170 125 L185 145 Z" fill="#ffffff"/></svg>`
  ),
  nokine: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M110 130 C130 80 160 60 180 90 C190 110 175 130 160 145 C145 160 125 165 110 130 Z" fill="#ef4444"/><path d="M170 100 C210 70 250 80 260 115 C267 140 242 165 215 160 C190 155 180 130 170 100 Z" fill="#0f766e"/></svg>`
  ),
  dobelt: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffe082"/><path d="M120 50 L210 50 C240 50 260 70 260 100 C260 130 240 150 210 150 L120 150 Z" fill="#111827"/><path d="M140 70 L200 70 C217 70 230 83 230 100 C230 117 217 130 200 130 L140 130 Z" fill="#ffe082"/></svg>`
  ),
  talius: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M160 35 L235 145 L85 145 Z" fill="#047857"/><path d="M160 55 L190 120 L130 120 Z" fill="#f0fdfa"/></svg>`
  ),
  bitmule: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><text x="160" y="120" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="88" font-weight="700" fill="#111827">B</text></svg>`
  ),
  zeleny: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><text x="160" y="110" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="800" fill="#16a34a">Zeleny</text><text x="160" y="145" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#16a34a">Kocur</text></svg>`
  ),
  lifespan: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M120 140 C110 110 130 90 150 90 C170 90 190 110 180 140 C170 170 130 170 120 140 Z" fill="#111827"/><path d="M150 90 C155 70 175 60 190 70 C205 82 220 100 215 120 C210 140 190 150 170 150 C155 150 145 140 150 90 Z" fill="#111827"/></svg>`
  ),
  shark: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M80 120 C120 40 210 40 240 120 C230 110 210 100 190 100 C160 100 140 120 110 120 C95 120 85 125 80 120 Z" fill="#dc2626"/><path d="M190 100 L220 70 L230 85" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`
  ),
  owl: makeLogo(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffffff"/><path d="M160 40 C190 40 210 70 210 90 C210 110 190 130 160 130 C130 130 110 110 110 90 C110 70 130 40 160 40 Z" fill="#d97706"/><circle cx="135" cy="95" r="14" fill="#ffffff"/><circle cx="185" cy="95" r="14" fill="#ffffff"/><path d="M140 120 C150 130 170 130 180 120" stroke="#ffffff" stroke-width="10" fill="none"/></svg>`
  ),
};

const brands = [
  { id: 1, name: 'Cardinal', logo: brandLogos.cardinal, products: 398 },
  { id: 2, name: 'BirdFly', logo: brandLogos.birdfly, products: 13 },
  { id: 3, name: 'Cocorico', logo: brandLogos.cocorico, products: 13 },
  { id: 4, name: 'Yogilist', logo: brandLogos.yogilist, products: 87 },
  { id: 5, name: 'Acerie', logo: brandLogos.acerie, products: 10 },
  { id: 6, name: 'Shivakin', logo: brandLogos.shivakin, products: 398 },
  { id: 7, name: 'Acera', logo: brandLogos.acera, products: 398 },
  { id: 8, name: 'Lion electronics', logo: brandLogos.lion, products: 398 },
  { id: 9, name: 'TwoHand', logo: brandLogos.twohand, products: 398 },
  { id: 10, name: 'Kiaomin', logo: brandLogos.kiaomin, products: 398 },
  { id: 11, name: 'Nokine', logo: brandLogos.nokine, products: 398 },
  { id: 12, name: 'Doblet', logo: brandLogos.dobelt, products: 13 },
  { id: 13, name: 'Talius', logo: brandLogos.talius, products: 398 },
  { id: 14, name: 'Bitmule', logo: brandLogos.bitmule, products: 13 },
  { id: 15, name: 'Zeleny Kocur', logo: brandLogos.zeleny, products: 398 },
  { id: 16, name: 'Lifespan', logo: brandLogos.lifespan, products: 13 },
  { id: 17, name: 'Shark Attack', logo: brandLogos.shark, products: 13 },
  { id: 18, name: 'Company name', logo: brandLogos.owl, products: 398 },
];

const BrandPage = () => {
  return (
    <div className="brand-page">
      <div className="content-header">
        <div>
          <h2>Brands</h2>
          <p>Brand and vendor management</p>
        </div>
        <div>
          <button className="btn btn-primary">
            <span className="material-icons" style={{ fontSize: 18 }}>post_add</span>
            Add New Brand
          </button>
        </div>
      </div>

      <div className="card mb-4 brand-filter-card">
        <div className="card-body brand-filter-bar">
          <input type="text" placeholder="Search..." className="form-control" />
          <select className="form-select">
            <option>Categories</option>
            <option>Technology</option>
            <option>Fashion</option>
            <option>Home Decor</option>
            <option>Healthy</option>
            <option>Travel</option>
            <option>Auto-car</option>
          </select>
          <input type="date" className="form-control" />
        </div>
      </div>

      <div className="brand-grid">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
};

export default BrandPage;
