import React from 'react';
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-calendar-event me-2"></i>
          CyberConf
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated() && (
              <Nav.Link as={Link} to="/">
                <i className="bi bi-house me-1"></i>
                Accueil
              </Nav.Link>
            )}
            
            {isAuthenticated() && isAdmin() && (
              <>
                <Nav.Link as={Link} to="/admin">
                  <i className="bi bi-gear me-1"></i>
                  Tableau d'administration
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/conferences">
                  <i className="bi bi-calendar-plus me-1"></i>
                  Gestion des conférences
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/users">
                  <i className="bi bi-people me-1"></i>
                  Gestion des utilisateurs
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated() ? (
              <div className="d-flex align-items-center">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.id} 
                    {isAdmin() && <span className="badge bg-warning text-dark ms-1">Admin</span>}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/change-password">
                      <i className="bi bi-key me-2"></i>
                      Changer le mot de passe
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Déconnexion
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <Button as={Link} to="/login" variant="outline-light">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Connexion
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;