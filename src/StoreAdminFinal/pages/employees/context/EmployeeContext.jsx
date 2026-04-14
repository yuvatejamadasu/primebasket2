import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'prime-basket-employees';
const EmployeeContext = createContext(null);

const sortEmployees = (items) =>
  [...items].sort((left, right) =>
    left.employeeId.localeCompare(right.employeeId, undefined, { numeric: true, sensitivity: 'base' })
  );

const readStoredEmployees = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? sortEmployees(parsed) : null;
  } catch (error) {
    console.error('Unable to read stored employees:', error);
    return null;
  }
};

const persistEmployees = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error('useEmployees must be used within EmployeeProvider');
  }

  return context;
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      const storedEmployees = readStoredEmployees();

      if (storedEmployees) {
        if (isMounted) {
          setEmployees(storedEmployees);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/data/employees.json');

        if (!response.ok) {
          throw new Error('Failed to load employee data.');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Employee data is not in the expected format.');
        }

        const normalized = sortEmployees(data);

        if (isMounted) {
          setEmployees(normalized);
          setLoading(false);
        }

        persistEmployees(normalized);
      } catch (loadError) {
        console.error('Error loading employees:', loadError);

        if (isMounted) {
          setError(loadError.message || 'Unable to load employees.');
          setLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateEmployees = (updater) => {
    setEmployees((current) => {
      const next = sortEmployees(typeof updater === 'function' ? updater(current) : updater);
      persistEmployees(next);
      return next;
    });
  };

  const addEmployee = (employeeData) => {
    const nextEmployee = {
      ...employeeData,
      id: `${Date.now()}`,
    };

    updateEmployees((current) => [...current, nextEmployee]);
    return nextEmployee;
  };

  const updateEmployee = (id, employeeData) => {
    updateEmployees((current) =>
      current.map((employee) =>
        employee.id === id ? { ...employee, ...employeeData } : employee
      )
    );
  };

  const value = useMemo(
    () => ({
      employees,
      loading,
      error,
      addEmployee,
      updateEmployee,
    }),
    [employees, loading, error]
  );

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};
