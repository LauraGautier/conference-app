import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { userAPI } from '../../services/api';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validations
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    if (passwords.newPassword.length < 3) {
      setError('Le nouveau mot de passe doit contenir au moins 3 caractères.');
      setLoading(false);
      return;
    }

    try {
      await userAPI.changePassword(passwords.oldPassword, passwords.newPassword);
      setSuccess('Mot de passe modifié avec succès !');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification du mot de passe');
    }
    
    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-key me-2"></i>
                Changer le mot de passe
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
                    <i className="bi bi-lock me-1"></i>
                    Mot de passe actuel
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handleChange}
                    placeholder="Votre mot de passe actuel"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-lock-fill me-1"></i>
                    Nouveau mot de passe
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    placeholder="Votre nouveau mot de passe"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="bi bi-lock-fill me-1"></i>
                    Confirmer le nouveau mot de passe
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre nouveau mot de passe"
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
                      Modification...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Changer le mot de passe
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;