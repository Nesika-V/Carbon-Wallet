import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { storageService } from '@/services/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = storageService.getUserByEmail(email);
    if (existingUser) {
      return false;
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    storageService.createUser(newUser);
    storageService.setCurrentUser(newUser);
    setUser(newUser);
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const existingUser = storageService.getUserByEmail(email);
    if (!existingUser) {
      return false;
    }

    const passwordHash = await hashPassword(password);
    if (existingUser.passwordHash !== passwordHash) {
      return false;
    }

    storageService.setCurrentUser(existingUser);
    setUser(existingUser);
    return true;
  };

  const logout = () => {
    storageService.setCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
