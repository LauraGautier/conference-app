import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-shield-exclamation me-2"></i>
          <h4>Accès refusé</h4>
          <p className="mb-0">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            Seuls les administrateurs peuvent accéder à cette section.
          </p>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;