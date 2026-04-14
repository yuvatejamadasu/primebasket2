// ── Local product image imports ──────────────────────────────────────────────
import p01 from '../assets/seller-profile3.jpg';
import p02 from '../assets/seller-profile4.jpg';
import p03 from '../assets/seller-profile5.jpg';
import p04 from '../assets/seller-profile6.jpg';
import p05 from '../assets/seller-profile7.jpg';
import p06 from '../assets/seller-profile8.jpg';
import p07 from '../assets/seller-profile9.jpg';
import p08 from '../assets/seller-profile10.jpg';
import p09 from '../assets/seller-profile11.jpg';
import p10 from '../assets/seller-profile12.jpg';
import p11 from '../assets/seller-profile13.jpg';
import p12 from '../assets/seller-profile14.jpg';
import p13 from '../assets/seller-profile3.jpg';
import p14 from '../assets/seller-profile4.jpg';
import p15 from '../assets/seller-profile5.jpg';
import p16 from '../assets/seller-profile6.jpg';
import p17 from '../assets/seller-profile7.jpg';
import p18 from '../assets/seller-profile8.jpg';

export const sellerData = {
  id: 1,
  name: 'Noodles Co.',
  address: '3891 Ranchview Dr. Richardson, California 62639',
  totalSales: 238,
  revenue: 2380,
  manager: 'Jerome Bell',
  email: 'info@example.com',
  phones: ['(229) 555-0109', '(808) 555-0111'],
  country: 'California',
  street: 'Ranchview Dr.',
  city: 'Richardson',
  postal: '62639',
};

const originalProducts = [
  { id: 1,  name: 'Randy Blend Herbal Mix',        price: 179.00, image: p01 },
  { id: 2,  name: 'Sahale Raspberry Crumble',      price: 179.00, image: p02 },
  { id: 3,  name: 'All Natural Italian-Style',     price: 179.00, image: p03 },
  { id: 4,  name: 'Boomchick apop Sweet & Salty',  price: 179.00, image: p04 },
  { id: 5,  name: 'Unsweetened Coconut Flakes',    price: 179.00, image: p05 },
  { id: 6,  name: 'Mighty Muffin With Probiotics', price: 179.00, image: p06 },
  { id: 7,  name: 'Wilderness Pesto Pistachio',    price: 179.00, image: p07 },
  { id: 8,  name: 'Cafe Altura Organic Coffee',    price: 179.00, image: p08 },
  { id: 9,  name: 'Talenti Gelato Layers',         price: 179.00, image: p09 },
  { id: 10, name: 'Unsweetened Coconut Flakes',    price: 179.00, image: p10 },
  { id: 11, name: 'Reishi Coffee Blend',           price: 179.00, image: p11 },
  { id: 12, name: 'Boomchick apop Sweet & Salty',  price: 179.00, image: p12 },
];

const newProducts = [
  { id: 13, name: 'Hydro Spring Water Bottle',     price: 199.00, image: p13 },
  { id: 14, name: 'Granola Crunch Breakfast Box',  price: 149.00, image: p14 },
  { id: 15, name: 'Matcha Green Tea Premium Can',  price: 219.00, image: p15 },
  { id: 16, name: 'Rose Hip Berry Jam Jar',        price: 159.00, image: p16 },
  { id: 17, name: 'Lavender Honey Protein Pouch',  price: 189.00, image: p17 },
  { id: 18, name: 'Peach Mango Dried Fruit Bag',   price: 139.00, image: p18 },
];

const allTemplates = [...originalProducts, ...newProducts];

export const productsData = Array.from({ length: 96 }, (_, i) => ({
  ...allTemplates[i % allTemplates.length],
  id: i + 1,
}));
