import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import Layout from './components/Layout';

const SuperAdminWrapper = () => {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <Layout />
      </ProfileProvider>
    </ThemeProvider>
  );
};

export default SuperAdminWrapper;
