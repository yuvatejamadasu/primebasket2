import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Admin',
    email: 'admin@primebasket.com',
    role: 'Administrator',
  });

  const login = (userData) => {
    // Skip localStorage for this version
    setUser(userData);
  };

  const logout = () => {
    // In this "no-login" version, logout just clears the user or can be disabled
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
