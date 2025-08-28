import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';

const ConferenceForm = ({ conference, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    description: '',
    img: '',
    content: '',
    duration: '',
    osMap: {
      addressl1: '',
      addressl2: '',
      postalCode: '',
      city: '',
      coordinates: []
    },
    speakers: [{ firstname: '', lastname: '' }],
    stakeholders: [{ firstname: '', lastname: '', job: '', img: '' }],
    design: {
      mainColor: '#007bff',
      secondColor: '#6c757d'
    }
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conference) {
      setFormData({
        ...conference,
        osMap: conference.osMap || {
          addressl1: '',
          addressl2: '',
          postalCode: '',
          city: '',
          coordinates: []
        },
        speakers: conference.speakers?.length > 0 ? conference.speakers : [{ firstname: '', lastname: '' }],
        stakeholders: conference.stakeholders?.length > 0 ? conference.stakeholders : [{ firstname: '', lastname: '', job: '', img: '' }],
        design: conference.design || { mainColor: '#007bff', secondColor: '#6c757d' }
      });
    }
  }, [conference]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('osMap.')) {
      const mapField = name.split('.')[1];
      setFormData({
        ...formData,
        osMap: { ...formData.osMap, [mapField]: value }
      });
    } else if (name.startsWith('design.')) {
      const designField = name.split('.')[1];
      setFormData({
        ...formData,
        design: { ...formData.design, [designField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSpeakerChange = (index, field, value) => {
    const newSpeakers = [...formData.speakers];
    newSpeakers[index] = { ...newSpeakers[index], [field]: value };
    setFormData({ ...formData, speakers: newSpeakers });
  };

  const handleStakeholderChange = (index, field, value) => {
    const newStakeholders = [...formData.stakeholders];
    newStakeholders[index] = { ...newStakeholders[index], [field]: value };
    setFormData({ ...formData, stakeholders: newStakeholders });
  };

  const addSpeaker = () => {
    setFormData({
      ...formData,
      speakers: [...formData.speakers, { firstname: '', lastname: '' }]
    });
  };

  const removeSpeaker = (index) => {
    if (formData.speakers.length > 1) {
      const newSpeakers = formData.speakers.filter((_, i) => i !== index);
      setFormData({ ...formData, speakers: newSpeakers });
    }
  };

  const addStakeholder = () => {
    setFormData({
      ...formData,
      stakeholders: [...formData.stakeholders, { firstname: '', lastname: '', job: '', img: '' }]
    });
  };

  const removeStakeholder = (index) => {
    if (formData.stakeholders.length > 1) {
      const newStakeholders = formData.stakeholders.filter((_, i) => i !== index);
      setFormData({ ...formData, stakeholders: newStakeholders });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim() || !formData.date || !formData.description.trim()) {
      setError('Les champs titre, date et description sont obligatoires.');
      setLoading(false);
      return;
    }

    const cleanedData = {
      ...formData,
      speakers: formData.speakers.filter(s => s.firstname.trim() && s.lastname.trim()),
      stakeholders: formData.stakeholders.filter(s => s.firstname.trim() && s.lastname.trim())
    };

    try {
      await onSave(cleanedData);
    } catch (error) {
      setError(error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" className="mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Informations de base */}
      <Card className="mb-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Informations de base
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Identifiant *</Form.Label>
                <Form.Control
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  disabled={!!conference}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Titre *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image (URL) *</Form.Label>
                <Form.Control
                  type="url"
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Durée</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 2h30"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Contenu détaillé *</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Contenu HTML accepté..."
              required
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Design */}
      <Card className="mb-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-palette me-2"></i>
            Thème visuel
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Couleur principale *</Form.Label>
                <Form.Control
                  type="color"
                  name="design.mainColor"
                  value={formData.design.mainColor}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Couleur secondaire *</Form.Label>
                <Form.Control
                  type="color"
                  name="design.secondColor"
                  value={formData.design.secondColor}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Lieu */}
      <Card className="mb-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-geo-alt me-2"></i>
            Lieu
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Adresse ligne 1</Form.Label>
                <Form.Control
                  type="text"
                  name="osMap.addressl1"
                  value={formData.osMap.addressl1}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Adresse ligne 2</Form.Label>
                <Form.Control
                  type="text"
                  name="osMap.addressl2"
                  value={formData.osMap.addressl2}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Code postal</Form.Label>
                <Form.Control
                  type="text"
                  name="osMap.postalCode"
                  value={formData.osMap.postalCode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Ville</Form.Label>
                <Form.Control
                  type="text"
                  name="osMap.city"
                  value={formData.osMap.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Intervenants */}
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-person-badge me-2"></i>
            Intervenants *
          </h6>
          <Button variant="outline-primary" size="sm" onClick={addSpeaker}>
            <i className="bi bi-plus"></i>
          </Button>
        </Card.Header>
        <Card.Body>
          {formData.speakers.map((speaker, index) => (
            <Row key={index} className="mb-2 align-items-end">
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Prénom"
                  value={speaker.firstname}
                  onChange={(e) => handleSpeakerChange(index, 'firstname', e.target.value)}
                  required
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Nom"
                  value={speaker.lastname}
                  onChange={(e) => handleSpeakerChange(index, 'lastname', e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                {formData.speakers.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeSpeaker(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                )}
              </Col>
            </Row>
          ))}
        </Card.Body>
      </Card>

      {/* Organisateurs */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-people me-2"></i>
            Organisateurs *
          </h6>
          <Button variant="outline-primary" size="sm" onClick={addStakeholder}>
            <i className="bi bi-plus"></i>
          </Button>
        </Card.Header>
        <Card.Body>
          {formData.stakeholders.map((stakeholder, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <Row className="align-items-end">
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Prénom"
                    value={stakeholder.firstname}
                    onChange={(e) => handleStakeholderChange(index, 'firstname', e.target.value)}
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Nom"
                    value={stakeholder.lastname}
                    onChange={(e) => handleStakeholderChange(index, 'lastname', e.target.value)}
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Poste"
                    value={stakeholder.job}
                    onChange={(e) => handleStakeholderChange(index, 'job', e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  {formData.stakeholders.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeStakeholder(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <Form.Control
                    type="url"
                    placeholder="Image (URL)"
                    value={stakeholder.img}
                    onChange={(e) => handleStakeholderChange(index, 'img', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </Card.Body>
      </Card>

      {/* Boutons d'action */}
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Sauvegarde...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              {conference ? 'Modifier' : 'Créer'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default ConferenceForm;