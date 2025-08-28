import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Alert, Modal, Badge } from 'react-bootstrap';
import { conferenceAPI } from '../../services/api';
import ConferenceForm from './ConferenceForm';

const ConferenceAdmin = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingConference, setEditingConference] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
      setError('Impossible de charger les conférences.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingConference(null);
    setShowModal(true);
  };

  const handleEdit = (conference) => {
    setEditingConference(conference);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await conferenceAPI.delete(id);
      setConferences(conferences.filter(conf => conf.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      setError('Impossible de supprimer la conférence.');
    }
  };

  const handleSave = async (conferenceData) => {
    
    try {
      if (editingConference) {
        
        const updatedConference = {
          ...editingConference,
          ...conferenceData
        };
        
        setConferences(conferences.map(conf => 
          conf.id === editingConference.id ? updatedConference : conf
        ));
      } else {
        const response = await conferenceAPI.create(conferenceData);
      
        const newConference = typeof response.data === 'string' 
          ? { ...conferenceData, _id: response.data } 
          : response.data;
        
        setConferences([...conferences, newConference]);
      }
      
      setShowModal(false);
      setEditingConference(null);

      await loadConferences();
      
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('🔐 Problème d\'authentification - Token invalide?');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Impossible de sauvegarder la conférence.'
      );
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des conférences...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-calendar-plus me-2"></i>
          Gestion des conférences
        </h1>
        <Button variant="primary" onClick={handleCreate}>
          <i className="bi bi-plus-circle me-2"></i>
          Nouvelle conférence
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <i className="bi bi-list me-2"></i>
            Liste des conférences ({conferences.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {conferences.length === 0 ? (
            <div className="text-center p-5">
              <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
              <h5 className="text-muted">Aucune conférence</h5>
              <p className="text-muted">Cliquez sur "Nouvelle conférence" pour commencer.</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Durée</th>
                  <th>Intervenants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conferences.map((conference) => (
                  <tr key={conference.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="me-3" 
                          style={{
                            width: '4px',
                            height: '40px',
                            backgroundColor: conference.design?.mainColor || '#007bff',
                            borderRadius: '2px'
                          }}
                        ></div>
                        <div>
                          <strong>{conference.title}</strong>
                          <div className="text-muted small">
                            {conference.description?.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="secondary">
                        {new Date(conference.date).toLocaleDateString('fr-FR')}
                      </Badge>
                    </td>
                    <td>
                      {conference.duration || (
                        <span className="text-muted">Non définie</span>
                      )}
                    </td>
                    <td>
                      {conference.speakers?.length > 0 ? (
                        <Badge bg="info">
                          {conference.speakers.length} intervenant{conference.speakers.length > 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <span className="text-muted">Aucun</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          className='me-2'
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(conference)}
                          title="Modifier"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setDeleteConfirm(conference)}
                          title="Supprimer"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal de création/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi ${editingConference ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
            {editingConference ? 'Modifier la conférence' : 'Nouvelle conférence'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ConferenceForm 
            conference={editingConference}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Confirmer la suppression
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer la conférence :</p>
          <strong>"{deleteConfirm?.title}"</strong>
          <p className="mt-2 text-muted">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(deleteConfirm.id)}
          >
            <i className="bi bi-trash me-2"></i>
            Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ConferenceAdmin;