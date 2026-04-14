import React from 'react';
import DynamicForm from '../Components/DynamicForm';
import { hubFormConfig } from '../config/formConfigs';

const HubForm = () => {
  return <DynamicForm config={hubFormConfig} />;
};

export default HubForm;
