import React, { createContext, useContext, useState } from 'react';
import { Employee } from '@/types/hr';
import { employees } from '@/data/mockData';

interface AuthContextType {
  currentUser: Employee;
  setCurrentUser: (user: Employee) => void;
  allEmployees: Employee[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee>(employees[0]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, allEmployees: employees }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
