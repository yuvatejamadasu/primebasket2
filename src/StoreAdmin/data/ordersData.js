// ===========================================
//  src/data/ordersData.js
//  Static orders dataset for dashboard order list
// ===========================================

const now = new Date();
const yr = now.getFullYear();
const mo = now.getMonth();

export const pad2 = n => String(n).padStart(2, '0');
export const mkDate = d => `${yr}-${pad2(mo + 1)}-${pad2(d)}`;
export const todayStr = `${yr}-${pad2(mo + 1)}-${pad2(now.getDate())}`;
export const currentYear = yr;
export const currentMonth = mo;

export const ordersData = [
  { id: 452, customer: 'Devon Lane',        price: '$948.55', status: 'Received', isoDate: mkDate(1) },
  { id: 478, customer: 'Leslie Alexander',  price: '$293.01', status: 'Pending',  isoDate: mkDate(1) },
  { id: 589, customer: 'Albert Flores',     price: '$105.55', status: 'Pending',  isoDate: mkDate(3) },
  { id: 345, customer: 'Eleanor Pena',      price: '$779.58', status: 'Received', isoDate: mkDate(5) },
  { id: 456, customer: 'Dianne Russell',    price: '$576.28', status: 'Received', isoDate: mkDate(5) },
  { id: 768, customer: 'Savannah Nguyen',   price: '$589.99', status: 'Received', isoDate: mkDate(7) },
  { id: 977, customer: 'Kathryn Murphy',    price: '$169.43', status: 'Received', isoDate: mkDate(9) },
  { id: 687, customer: 'Jacob Jones',       price: '$219.78', status: 'Received', isoDate: mkDate(9) },
  { id: 688, customer: 'Sandra Lee',        price: '$319.00', status: 'Pending',  isoDate: mkDate(11) },
  { id: 699, customer: 'Tom Harris',        price: '$450.20', status: 'Received', isoDate: mkDate(12) },
  { id: 700, customer: 'Anna White',        price: '$88.50',  status: 'Pending',  isoDate: mkDate(14) },
  { id: 701, customer: 'Chris Brown',       price: '$660.00', status: 'Received', isoDate: mkDate(15) },
  { id: 702, customer: 'Mia Davis',         price: '$199.99', status: 'Received', isoDate: mkDate(15) },
  { id: 703, customer: 'Leo Wilson',        price: '$340.75', status: 'Pending',  isoDate: mkDate(17) },
  { id: 704, customer: 'Grace Kim',         price: '$520.40', status: 'Received', isoDate: mkDate(18) },
  { id: 705, customer: 'Ethan Clark',       price: '$275.00', status: 'Received', isoDate: mkDate(20) },
  { id: 706, customer: 'Olivia Hall',       price: '$189.60', status: 'Pending',  isoDate: mkDate(21) },
  { id: 707, customer: 'Noah Young',        price: '$730.25', status: 'Received', isoDate: mkDate(22) },
  { id: 708, customer: 'Sophia Martinez',   price: '$410.80', status: 'Received', isoDate: mkDate(22) },
  { id: 709, customer: 'James Anderson',    price: '$560.30', status: 'Pending',  isoDate: mkDate(24) },
  { id: 710, customer: 'Ava Thomas',        price: '$305.55', status: 'Received', isoDate: todayStr },
  { id: 711, customer: 'William Jackson',   price: '$895.00', status: 'Received', isoDate: todayStr },
];
