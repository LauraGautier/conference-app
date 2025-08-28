import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { conferenceAPI, userAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalConferences: 0,
    totalUsers: 0,
    totalAdmins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const conferencesResponse = await conferenceAPI.getAll();
      const conferences = conferencesResponse.data;
      
      const usersResponse = await userAPI.getAll();
      const users = usersResponse.data;
      
      const admins = users.filter(user => user.type === 'admin');
      
      setStats({
        totalConferences: conferences.length,
        totalUsers: users.length,
        totalAdmins: admins.length
      });
      
      setError('');
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setError('Impossible de charger les statistiques d\'administration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-gear me-2"></i>
          Tableau de bord administrateur
        </h1>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #007bff' }}>
            <Card.Body className="text-center">
              <i className="bi bi-calendar-event display-4 text-primary mb-3"></i>
              <h3 className="text-primary">{loading ? '...' : stats.totalConferences}</h3>
              <p className="text-muted mb-0">Conférences total</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #28a745' }}>
            <Card.Body className="text-center">
              <i className="bi bi-people display-4 text-success mb-3"></i>
              <h3 className="text-success">{loading ? '...' : stats.totalUsers}</h3>
              <p className="text-muted mb-0">Utilisateurs total</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #ffc107' }}>
            <Card.Body className="text-center">
              <i className="bi bi-shield-check display-4 text-warning mb-3"></i>
              <h3 className="text-warning">{loading ? '...' : stats.totalAdmins}</h3>
              <p className="text-muted mb-0">Administrateurs</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Actions rapides */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Actions rapides
              </h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Card className="h-100 border-primary">
                    <Card.Body className="d-flex flex-column align-items-center">
                      <i className="bi bi-calendar-plus display-6 text-primary mb-3"></i>
                      <h5>Gérer les conférences</h5>
                      <p className="text-center text-muted flex-grow-1">
                        Créer, modifier et supprimer des conférences
                      </p>
                      <Button 
                        as={Link} 
                        to="/admin/conferences" 
                        variant="primary"
                        className="w-100"
                      >
                        <i className="bi bi-arrow-right me-2"></i>
                        Accéder
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Card className="h-100 border-success">
                    <Card.Body className="d-flex flex-column align-items-center">
                      <i className="bi bi-people-fill display-6 text-success mb-3"></i>
                      <h5>Gérer les utilisateurs</h5>
                      <p className="text-center text-muted flex-grow-1">
                        Consulter et promouvoir les utilisateurs
                      </p>
                      <Button 
                        as={Link} 
                        to="/admin/users" 
                        variant="success"
                        className="w-100"
                      >
                        <i className="bi bi-arrow-right me-2"></i>
                        Accéder
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;