import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(credentials);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-lock me-2"></i>
                Connexion
              </h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
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
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Se connecter
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-3">
            <Link to="/signup" className="btn btn-link">
              Pas de compte ? S'inscrire
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;