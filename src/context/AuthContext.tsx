'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  picture: string;
  phone?: string;
  isOnboarded?: boolean;
  googleId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credential: string) => Promise<{ success: boolean; requiresWhatsApp?: boolean; message?: string }>;
  loginWithWhatsApp: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credential: string): Promise<{ success: boolean; requiresWhatsApp?: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (data.success) {
        const userData: User = {
          name: data.user.name,
          email: data.user.email,
          picture: data.user.picture,
          phone: data.user.phone,
          isOnboarded: data.user.isOnboarded,
          googleId: data.user.googleId,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else if (data.requiresWhatsApp) {
        return { success: false, requiresWhatsApp: true, message: data.message };
      } else {
        console.error('Login failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Auth error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  };

  const loginWithWhatsApp = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithWhatsApp, updateUser, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
