import React from 'react';
import DynamicForm from '../Components/DynamicForm';
import { storeSignupConfig } from '../config/formConfigs';

const StoreSignup = () => {
  return <DynamicForm config={storeSignupConfig} />;
};

export default StoreSignup;
