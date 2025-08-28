import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      const token = response.data.Token || response.data.token || response.data;
      
      localStorage.setItem('token', token);
      
      try {
        const isAdminResponse = await authAPI.isAdmin();
        const userData = {
          id: credentials.id,
          type: isAdminResponse.data.isAdmin ? 'admin' : 'user'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        const userData = { id: credentials.id, type: 'user' };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur de connexion complète:', error);
      console.error('📄 Réponse détaillée:', error.response?.data);
      console.error('🔢 Status code:', error.response?.status);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data || 'Erreur de connexion' 
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user && user.type === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};