import React from 'react';
import { Outlet } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
import '../../styles/Employees.css';

const EmployeeLayout = () => (
  <EmployeeProvider>
    <Outlet />
  </EmployeeProvider>
);

export default EmployeeLayout;
