import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { conferenceAPI } from '../../services/api';

const ConferenceDetail = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadConference = async () => {
      try {
        setLoading(true);
        const response = await conferenceAPI.getById(id);
        setConference(response.data);
        setError('');
      } catch (error) {
        console.error('Erreur lors du chargement de la conférence:', error);
        setError('Conférence non trouvée ou erreur de chargement.');
      } finally {
        setLoading(false);
      }
    };

    loadConference();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" className="me-2">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement de la conférence...</p>
      </Container>
    );
  }

  if (error || !conference) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <div>
            <h5>Erreur</h5>
            <p className="mb-2">{error}</p>
            <Button as={Link} to="/" variant="primary" size="sm">
              <i className="bi bi-arrow-left me-1"></i>
              Retour à l'accueil
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const {
    title,
    date,
    description,
    img,
    content,
    duration,
    osMap,
    speakers = [],
    stakeholders = [],
    design = { mainColor: '#007bff', secondColor: '#6c757d' }
  } = conference;

  const themeStyle = {
    '--theme-color': design.mainColor,
    '--theme-secondary': design.secondColor
  };

  return (
    <div style={themeStyle}>
      <Container className="mt-4">
        {/* Bouton retour */}
        <Button 
          as={Link} 
          to="/" 
          variant="outline-secondary" 
          className="mb-4"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Retour aux conférences
        </Button>

        {/* Image et titre principal */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="shadow-sm" style={{ borderLeft: `5px solid ${design.mainColor}` }}>
              {img && (
                <Card.Img 
                  variant="top" 
                  src={img} 
                  alt={title}
                  style={{ height: '300px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <Card.Body>
                <h1 className="display-6 mb-3" style={{ color: design.mainColor }}>
                  {title}
                </h1>
                
                <div className="mb-3">
                  <Badge 
                    style={{ backgroundColor: design.mainColor }} 
                    className="me-2 fs-6"
                  >
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Badge>
                  {duration && (
                    <Badge bg="secondary" className="fs-6">
                      <i className="bi bi-clock me-1"></i>
                      {duration}
                    </Badge>
                  )}
                </div>

                <p className="lead text-muted">
                  {description}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar avec informations */}
          <Col lg={4}>
            {/* Intervenants */}
            {speakers.length > 0 && (
              <Card className="mb-3 shadow-sm">
                <Card.Header style={{ backgroundColor: design.mainColor, color: 'white' }}>
                  <h5 className="mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Intervenants
                  </h5>
                </Card.Header>
                <Card.Body>
                  {speakers.map((speaker, index) => (
                    <div key={index} className="mb-2">
                      <strong>{speaker.firstname} {speaker.lastname}</strong>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Parties prenantes */}
            {stakeholders.length > 0 && (
              <Card className="mb-3 shadow-sm">
                <Card.Header style={{ backgroundColor: design.secondColor, color: 'white' }}>
                  <h5 className="mb-0">
                    <i className="bi bi-people me-2"></i>
                    Organisateurs
                  </h5>
                </Card.Header>
                <Card.Body>
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="mb-3 d-flex align-items-center">
                      {stakeholder.img && (
                        <img 
                          src={stakeholder.img} 
                          alt={`${stakeholder.firstname} ${stakeholder.lastname}`}
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <strong>{stakeholder.firstname} {stakeholder.lastname}</strong>
                        {stakeholder.job && (
                          <div className="text-muted small">{stakeholder.job}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Lieu */}
            {osMap && (
              <Card className="shadow-sm">
                <Card.Header bg="light">
                  <h5 className="mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    Lieu
                  </h5>
                </Card.Header>
                <Card.Body>
                  {osMap.addressl1 && <div>{osMap.addressl1}</div>}
                  {osMap.addressl2 && <div>{osMap.addressl2}</div>}
                  <div>
                    {osMap.postalCode} {osMap.city}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Contenu de la conférence */}
        {content && (
          <Row>
            <Col>
              <Card className="shadow-sm mb-5">
                <Card.Header style={{ backgroundColor: design.mainColor, color: 'white' }}>
                  <h4 className="mb-0">
                    <i className="bi bi-file-text me-2"></i>
                    Contenu de la conférence
                  </h4>
                </Card.Header>
                <Card.Body>
                  <div 
                    className="content-html"
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{ lineHeight: '1.6' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ConferenceDetail;
