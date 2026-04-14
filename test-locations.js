import { getStates, getRegions, getBranches, getHubs, getStores, LOCATIONS } from './src/constants/locations.js';

console.log("States:", getStates());
const state = "Andhra Pradesh";
const regions = getRegions(state);
console.log(`Regions in ${state}:`, regions);

regions.forEach(region => {
  const branches = getBranches(state, region);
  console.log(`  Branches in ${region}:`, branches);
  
  branches.forEach(branch => {
    const hubs = getHubs(state, region, branch);
    console.log(`    Hubs in ${branch}:`, hubs);
    
    hubs.forEach(hub => {
      const stores = getStores(state, region, branch, hub);
      console.log(`      Stores in ${hub}:`, stores);
    });
  });
});

const ts = "Telangana";
console.log(`\nTesting ${ts}:`);
getRegions(ts).forEach(r => {
  console.log(`  Region: ${r}, Branches:`, getBranches(ts, r));
});
