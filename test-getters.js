import { getStates, getRegions, getBranches, getHubs, getStores } from './src/constants/locations.js';

console.log('States:', getStates());
console.log('Regions in Telangana:', getRegions('Telangana'));
console.log('Branches in TS -> Hyderabad:', getBranches('Telangana', 'Hyderabad'));
console.log('Hubs in TS -> Hyd -> Madhapur:', getHubs('Telangana', 'Hyderabad', 'Madhapur'));
console.log('Stores in TS -> Hyd -> Madh -> Hitech Hub:', getStores('Telangana', 'Hyderabad', 'Madhapur', 'Hitech Hub'));
