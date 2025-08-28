import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UserAdmin = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoteConfirm, setPromoteConfirm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      await userAPI.promoteToAdmin(userId);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, type: 'admin' } : user
      ));
      setPromoteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la promotion:', error);
      setError('Impossible de promouvoir l\'utilisateur.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Impossible de supprimer l\'utilisateur.');
    }
  };

  const canDeleteUser = (user) => {
    return currentUser && user.id !== currentUser.id;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des utilisateurs...</p>
      </Container>
    );
  }

  const adminUsers = users.filter(user => user.type === 'admin');
  const regularUsers = users.filter(user => user.type !== 'admin');

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-people me-2"></i>
          Gestion des utilisateurs
        </h1>
        <div>
          <Badge bg="primary" className="me-2">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
          </Badge>
          <Badge bg="warning">
            dont {adminUsers.length} administrateur{adminUsers.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Avertissement de sécurité */}
      <Alert variant="info" className="mb-4">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Information :</strong> Vous ne pouvez évidemment pas supprimer votre propre compte !
      </Alert>

      {/* Statistiques rapides */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #28a745' }}>
            <Card.Body className="text-center">
              <i className="bi bi-shield-check display-6 text-success mb-2"></i>
              <h3 className="text-success">{adminUsers.length}</h3>
              <p className="text-muted mb-0">Administrateurs</p>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #007bff' }}>
            <Card.Body className="text-center">
              <i className="bi bi-person display-6 text-primary mb-2"></i>
              <h3 className="text-primary">{regularUsers.length}</h3>
              <p className="text-muted mb-0">Utilisateurs standards</p>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <i className="bi bi-list me-2"></i>
            Liste complète des utilisateurs
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {users.length === 0 ? (
            <div className="text-center p-5">
              <i className="bi bi-person-x display-4 text-muted mb-3"></i>
              <h5 className="text-muted">Aucun utilisateur</h5>
              <p className="text-muted">La liste des utilisateurs est vide.</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <i className="bi bi-person me-1"></i>
                    Identifiant
                  </th>
                  <th>
                    <i className="bi bi-shield me-1"></i>
                    Type
                  </th>
                  <th>
                    <i className="bi bi-gear me-1"></i>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Afficher d'abord les admins */}
                {adminUsers.map((user) => (
                  <tr key={user.id} className={user.id === currentUser?.id ? "table-success" : "table-warning"}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shield-fill-check text-warning me-2"></i>
                        <strong>{user.id}</strong>
                        {user.id === currentUser?.id && (
                          <Badge bg="success" className="ms-2">
                            <i className="bi bi-person-check me-1"></i>
                            Vous
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg="warning" text="dark">
                        <i className="bi bi-star me-1"></i>
                        Administrateur
                      </Badge>
                    </td>
                    <td>
                      {canDeleteUser(user) ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setDeleteConfirm(user)}
                          title="Supprimer l'utilisateur"
                        >
                          <i className="bi bi-trash me-1"></i>
                          Supprimer l'utilisateur
                        </Button>
                      ) : (
                        <span className="text-muted">
                          <i className="bi bi-lock me-1"></i>
                          Auto-suppression interdite
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Puis les utilisateurs standards */}
                {regularUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-circle text-primary me-2"></i>
                        {user.id}
                      </div>
                    </td>
                    <td>
                      <Badge bg="primary">
                        <i className="bi bi-person me-1"></i>
                        Utilisateur
                      </Badge>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => setPromoteConfirm(user)}
                          title="Promouvoir en administrateur"
                          className="me-2"
                        >
                          <i className="bi bi-arrow-up-circle me-1"></i>
                          Promouvoir
                        </Button>
                        {canDeleteUser(user) ? (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteConfirm(user)}
                            title="Supprimer l'utilisateur"
                          >
                            <i className="bi bi-trash me-1"></i>
                            Supprimer
                          </Button>
                        ) : (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled
                            title="Vous ne pouvez pas vous supprimer vous-même"
                          >
                            <i className="bi bi-lock me-1"></i>
                            Protégé
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Informations supplémentaires */}
      <Card className="mt-4 shadow-sm">
        <Card.Header className="bg-info text-white">
          <h6 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Informations importantes
          </h6>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <h6>
                <i className="bi bi-shield-check me-2"></i>
                Droits des administrateurs
              </h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-1"></i> Gestion complète des conférences</li>
                <li><i className="bi bi-check text-success me-1"></i> Promotion d'utilisateurs</li>
                <li><i className="bi bi-check text-success me-1"></i> Accès au tableau de bord admin</li>
                <li><i className="bi bi-x text-danger me-1"></i> Auto-suppression interdite</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>
                <i className="bi bi-person me-2"></i>
                Droits des utilisateurs standards
              </h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-eye text-primary me-1"></i> Consultation des conférences</li>
                <li><i className="bi bi-book text-primary me-1"></i> Accès aux détails complets</li>
                <li><i className="bi bi-x text-muted me-1"></i> Pas d'accès admin</li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmation de promotion */}
      <Modal show={!!promoteConfirm} onHide={() => setPromoteConfirm(null)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-warning">
            <i className="bi bi-arrow-up-circle me-2"></i>
            Promotion administrateur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="bi bi-shield-plus display-4 text-warning"></i>
          </div>
          <p className="text-center">
            Êtes-vous sûr de vouloir promouvoir l'utilisateur :
          </p>
          <div className="text-center">
            <strong className="fs-5">{promoteConfirm?.id}</strong>
          </div>
          <p className="text-center text-muted mt-3">
            Cet utilisateur aura accès à toutes les fonctionnalités d'administration.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPromoteConfirm(null)}>
            Annuler
          </Button>
          <Button 
            variant="warning" 
            onClick={() => handlePromoteToAdmin(promoteConfirm.id)}
          >
            <i className="bi bi-shield-check me-2"></i>
            Promouvoir administrateur
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Supprimer l'utilisateur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="bi bi-person-x display-4 text-danger"></i>
          </div>
          <p className="text-center">
            Êtes-vous sûr de vouloir supprimer l'utilisateur :
          </p>
          <div className="text-center">
            <strong className="fs-5">{deleteConfirm?.id}</strong>
          </div>
          <p className="text-center text-muted mt-3">
            Cette action est irréversible. Toutes les données de cet utilisateur seront perdues.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDeleteUser(deleteConfirm.id)}
          >
            <i className="bi bi-trash me-2"></i>
            Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserAdmin;