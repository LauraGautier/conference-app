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
    // Fonction pour valider le token au démarrage
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        // Si pas de token ou pas d'user, on nettoie tout
        if (!token || !userData) {
          clearAuthData();
          setLoading(false);
          return;
        }

        // Vérifier que le token est encore valide en appelant l'API
        const isAdminResponse = await authAPI.isAdmin();
        
        // Si l'API répond positivement, le token est valide
        const parsedUser = JSON.parse(userData);
        const validatedUser = {
          ...parsedUser,
          type: isAdminResponse.data.isAdmin ? 'admin' : 'user'
        };
        
        setUser(validatedUser);
        localStorage.setItem('user', JSON.stringify(validatedUser));
        
      } catch (error) {
        // Si l'API rejette, le token est invalide
        console.warn('Token invalide détecté, déconnexion automatique');
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Tentative de connexion avec:', credentials);
      const response = await authAPI.login(credentials);
      console.log('✅ Réponse API login:', response.data);
      
      const token = response.data.Token || response.data.token || response.data;
      console.log('🎫 Token récupéré:', token);
      
      if (!token) {
        throw new Error('Aucun token reçu de l\'API');
      }
      
      localStorage.setItem('token', token);
      
      // Vérifier les droits administrateur
      try {
        const isAdminResponse = await authAPI.isAdmin();
        console.log('👑 Vérification admin:', isAdminResponse.data);
        const userData = {
          id: credentials.id,
          type: isAdminResponse.data.isAdmin ? 'admin' : 'user'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.log('⚠️ Erreur vérification admin:', error);
        // Si on ne peut pas vérifier le type, créer un utilisateur basique
        const userData = { id: credentials.id, type: 'user' };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur de connexion complète:', error);
      clearAuthData();
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data || 'Erreur de connexion' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion utilisateur');
    clearAuthData();
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const isAdmin = () => {
    return user && user.type === 'admin' && !!localStorage.getItem('token');
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