import React from 'react';
import DynamicLoginForm from '../Components/DynamicLoginForm';
import { storeLoginConfig } from '../config/formConfigs';

const StoreLogin = () => {
  return <DynamicLoginForm config={storeLoginConfig} />;
};

export default StoreLogin;
