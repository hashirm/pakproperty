'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const savedToken = localStorage.getItem('pakproperty_token');
      if (savedToken) {
        setToken(savedToken);
        const res = await api.auth.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.warn('Error loading user profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.success && res.token && res.user) {
      localStorage.setItem('pakproperty_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success && res.token && res.user) {
      localStorage.setItem('pakproperty_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('pakproperty_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
