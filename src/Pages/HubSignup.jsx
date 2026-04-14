import React from 'react';
import DynamicForm from '../Components/DynamicForm';
import { hubSignupConfig } from '../config/formConfigs';

const HubSignup = () => {
  return <DynamicForm config={hubSignupConfig} />;
};

export default HubSignup;
