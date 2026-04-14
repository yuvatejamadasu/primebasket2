import React from 'react';
import DynamicForm from '../Components/DynamicForm';
import { storeFormConfig } from '../config/formConfigs';

const StoreForm = () => {
  return <DynamicForm config={storeFormConfig} />;
};

export default StoreForm;
