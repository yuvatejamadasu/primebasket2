const fs = require('fs');

const loginFiles = [
  'src/Pages/StateAdminLogin.jsx',
  'src/Pages/RegionLogin.jsx',
  'src/Pages/BranchLogin.jsx',
  'src/Pages/HubLogin.jsx',
  'src/Pages/StoreLogin.jsx'
];

loginFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix useState
  content = content.replace(/useState\(\{\s*fullName:\s*'',\s*email:\s*'',\s*password:\s*'',\s*confirmPassword:\s*'',\s*mobile:\s*''\s*\}\)/g, "useState({ email: '', password: '' })");

  // Fix validation blocks
  content = content.replace(/if \(!formData\.fullName\.trim\(\)\) newErrors\.fullName = 'Full Name is required';\n?/g, '');
  content = content.replace(/if \(!formData\.mobile\.trim\(\)\) \{\s*newErrors\.mobile = 'Mobile number is required';\s*\} else if \(!\/\^\\d\{10\}\$\/\.test\(formData\.mobile\)\) \{\s*newErrors\.mobile = 'Enter a valid 10-digit mobile number';\s*\}\n?/g, '');
  content = content.replace(/if \(!formData\.confirmPassword\) \{\s*newErrors\.confirmPassword = 'Confirm password is required';\s*\} else if \(formData\.password !== formData\.confirmPassword\) \{\s*newErrors\.confirmPassword = 'Passwords do not match';\s*\}\n?/g, '');

  content = content.replace(/<div>\s*<label className="block text-sm font-semibold text-gray-700 mb-1">Full Name<\/label>[\s\S]*?<\/div>\n?/g, '');
  content = content.replace(/<div>\s*<label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number<\/label>[\s\S]*?<\/div>\n?/g, '');
  content = content.replace(/<div>\s*<label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password<\/label>[\s\S]*?<\/div>\n?/g, '');

  // If there are duplicate checking logic in Logins with fullName or mobile, remove them
  content = content.replace(/if \(accounts\.some\(\(acc\) => acc\.fullName\.toLowerCase\(\) === formData\.fullName\.trim\(\)\.toLowerCase\(\)\)\) \{\s*dupErrors\.fullName = 'An account with this name already exists';\s*\}\n?/g, '');

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});

const signupFiles = [
  'src/Pages/StateAdminSignup.jsx',
  'src/Pages/RegionSignup.jsx',
  'src/Pages/BranchSignup.jsx',
  'src/Pages/HubSignup.jsx',
  'src/Pages/StoreSignup.jsx'
];

signupFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix useState
  content = content.replace(/mobile:\s*'',?\s*/g, "");

  // Fix validation
  content = content.replace(/if \(!formData\.mobile\.trim\(\)\) \{\s*newErrors\.mobile = 'Mobile number is required';\s*\} else if \(!\/\^\\d\{10\}\$\/\.test\(formData\.mobile\)\) \{\s*newErrors\.mobile = 'Enter a valid 10-digit mobile number';\s*\}\n?/g, '');
  
  // Also remove duplicate checking logic
  content = content.replace(/if \(accounts\.some\(\(acc\) => acc\.mobile === formData\.mobile\.trim\(\)\)\) \{\s*dupErrors\.mobile = 'An account with this mobile number already exists';\s*\}\n?/g, '');

  content = content.replace(/<div>\s*<label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number<\/label>[\s\S]*?<\/div>\n?/g, '');

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
