export const productList = [
  { id: 'P001', name: 'Apple iPhone 14 Pro', category: 'Cellphones', price: '$999', stock: 145, status: 'Active', sku: 'APL-IP14' },
  { id: 'P002', name: 'Samsung Galaxy S23', category: 'Cellphones', price: '$849', stock: 89, status: 'Active', sku: 'SAM-GS23' },
  { id: 'P003', name: 'Nike Air Max 270', category: 'Shoes', price: '$129', stock: 320, status: 'Active', sku: 'NK-AM270' },
  { id: 'P004', name: 'Sony WH-1000XM5', category: 'Consumer Electronics', price: '$349', stock: 67, status: 'Active', sku: 'SNY-WH5' },
  { id: 'P005', name: 'Adidas Ultraboost 23', category: 'Shoes', price: '$189', stock: 0, status: 'Out of Stock', sku: 'AD-UB23' },
  { id: 'P006', name: 'MacBook Pro 14"', category: 'Computer & Office', price: '$1,999', stock: 34, status: 'Active', sku: 'APL-MBP14' },
  { id: 'P007', name: 'Canon EOS R5', category: 'Consumer Electronics', price: '$3,899', stock: 12, status: 'Active', sku: 'CAN-R5' },
  { id: 'P008', name: "Levi's 501 Jeans", category: "Men's Clothing", price: '$69', stock: 450, status: 'Active', sku: 'LEV-501' },
  { id: 'P009', name: 'Zara Summer Dress', category: "Women's Clothing", price: '$49', stock: 0, status: 'Out of Stock', sku: 'ZR-SUM' },
  { id: 'P010', name: 'Kindle Paperwhite', category: 'Consumer Electronics', price: '$139', stock: 200, status: 'Active', sku: 'AMZ-KPW' },
];

export const categories = [
  { id: 21, name: 'Cake & Milk', description: 'Cake & Milk', slug: '/cake', order: 1 },
  { id: 2, name: 'Organic Kiwi', description: 'EU standard', slug: '/kiwi', order: 2 },
  { id: 3, name: 'Peach', description: 'Peach', slug: '/peach', order: 3 },
  { id: 4, name: 'Red Apple', description: 'Red Apple', slug: '/apple', order: 4 },
  { id: 5, name: 'Snack', description: 'Snack', slug: '/snack', order: 5 },
  { id: 6, name: 'Vegetables', description: 'Vegetables', slug: '/vegetables', order: 6 },
  { id: 7, name: 'Strawberry', description: 'Strawberry', slug: '/strawberry', order: 7 },
  { id: 8, name: 'Black plum', description: 'Black plum', slug: '/plum', order: 8 },
];

export const productCategories = ['All', ...new Set(productList.map((product) => product.category))];
