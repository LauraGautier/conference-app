import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Signup = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.signup(credentials);
      setSuccess(`Compte "${credentials.id}" créé avec succès ! Vous pouvez maintenant vous connecter.`);
      setCredentials({ id: '', password: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création du compte');
    }
    
    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Créer un compte
              </h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="d-flex align-items-center">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-person me-1"></i>
                    Identifiant
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={credentials.id}
                    onChange={handleChange}
                    placeholder="Votre identifiant"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-key me-1"></i>
                    Mot de passe
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    required
                  />
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Création...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Créer le compte
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <Link to="/login" className="btn btn-link">
                  Déjà un compte ? Se connecter
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;