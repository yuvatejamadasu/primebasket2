import { getStates, getRegions, getBranches, getHubs, getStores } from '../constants/locations';

// --- Shared Fields ---
const commonCountryField = { 
  name: 'country', 
  label: 'Country', 
  type: 'select', 
  options: ['India', 'Kenya'], 
  placeholder: 'Select Country',
  validation: { required: 'Country is required' } 
};

const commonLoginFields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
];

const commonSignupFields = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name', validation: { required: 'Full Name is required' } },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email', validation: { required: 'Email is required' } },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter 10-digit phone number', validation: { required: 'Phone is required', pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' } } },
];

// --- Entity Creation Configs ---

export const hubFormConfig = {
  title: 'Hub Form',
  description: 'Add a new Hub.',
  storageKey: 'hubAccounts',
  redirectPath: '/',
  fields: [
    { ...commonCountryField },
    { name: 'hubName', label: 'Hub Name', type: 'text', placeholder: 'Enter hub name', validation: { required: 'Hub Name is required' } },
  ],
};

export const storeFormConfig = {
  title: 'Store Form',
  description: 'Add a new Store.',
  storageKey: 'storeAccounts',
  redirectPath: '/hub-dashboard',
  fields: [
    { ...commonCountryField, lockedByAuth: { key: 'hubAdminAuth', field: 'country' } },
    { name: 'storeName', label: 'Store Name', type: 'text', placeholder: 'Enter store name', validation: { required: 'Store Name is required' } },
  ],
};

// --- Auth Login Configs ---

export const hubLoginConfig = {
  title: 'Hub Login',
  accountsKey: 'hubAccounts',
  authKey: 'hubAdminAuth',
  redirectPath: '/hub-dashboard',
  fields: commonLoginFields,
};

export const storeLoginConfig = {
  title: 'Store Login',
  accountsKey: 'storeAccounts',
  authKey: 'storeAdminAuth',
  redirectPath: '/store-dashboard',
  fields: commonLoginFields,
};

// --- Signup Configs ---

export const hubSignupConfig = {
  title: 'Create Hub Account',
  description: 'Create your account to get started.',
  storageKey: 'hubAccounts',
  redirectPath: '/',
  checkDuplicates: true,
  initialStatus: 'Pending',
  targetRole: 'super-admin',
  approvalChain: [],
  multiEntry: true,
  addLabel: 'Add Another Hub Account',
  profileLabel: 'Hub Profile',
  successTitle: 'Requests Submitted!',
  successMessage: 'Pending approval from Super Admin...',
  fields: [
    { ...commonCountryField },
    { 
        name: 'hubName', 
        label: 'Hub Name', 
        type: 'select', 
        dependsOn: 'country', 
        optionsSource: (formData) => getHubs(formData.country),
        validation: { required: 'Hub is required' }
    },
    ...commonSignupFields,
  ],
};

export const storeSignupConfig = {
  title: 'Create Store Account',
  description: 'Create your account to get started.',
  storageKey: 'storeAccounts',
  redirectPath: '/',
  checkDuplicates: true,
  initialStatus: 'Pending',
  targetRole: 'super-admin',
  approvalChain: [],
  multiEntry: true,
  addLabel: 'Add Another Store Account',
  profileLabel: 'Store Profile',
  successTitle: 'Requests Submitted!',
  successMessage: 'Pending approval from Super Admin...',
  fields: [
    { ...commonCountryField, lockedByAuth: { key: 'hubAdminAuth', field: 'country' } },
    { 
        name: 'storeName', 
        label: 'Store Name', 
        type: 'select', 
        dependsOn: 'country', 
        optionsSource: (formData) => getStores(formData.country),
        validation: { required: 'Store is required' }
    },
    ...commonSignupFields,
  ],
};
