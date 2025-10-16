import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User, LoginData, SignupData } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and token from storage on mount
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);

      
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginData): Promise<User> => {
    try {
      const response = await authService.login(data);
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      storage.setToken(token);
      storage.setUser(user);

      return user; // ✅ return user object
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await authService.signup(data);
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      storage.setToken(token);
      storage.setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.clearAll();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};