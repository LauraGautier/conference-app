import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ConferenceCard from './ConferenceCard';
import { conferenceAPI } from '../../services/api';

const ConferenceList = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConferences();
  }, []);

  const loadConferences = async () => {
    try {
      setLoading(true);
      const response = await conferenceAPI.getAll();
      setConferences(response.data);
      setError('');
    } catch (error) {
      console.error('Erreur lors du chargement des conférences:', error);
      setError('Impossible de charger les conférences. Vérifiez que l\'API est démarrée.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" className="me-2">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des conférences...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <div>
            <h5>Erreur de chargement</h5>
            <p className="mb-0">{error}</p>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-calendar-event me-2"></i>
          Conférences disponibles
        </h1>
        <span className="badge bg-primary fs-6">
          {conferences.length} conférence{conferences.length > 1 ? 's' : ''}
        </span>
      </div>

      {conferences.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Aucune conférence disponible pour le moment.
        </Alert>
      ) : (
        <Row>
          {conferences.map((conference) => (
            <Col key={conference.id} md={6} lg={4} className="mb-4">
              <ConferenceCard conference={conference} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ConferenceList;