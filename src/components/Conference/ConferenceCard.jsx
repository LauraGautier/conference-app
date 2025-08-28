import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ConferenceCard = ({ conference }) => {
  const {
    id,
    title,
    date,
    description,
    img,
    duration,
    speakers = [],
    design = { mainColor: '#007bff', secondColor: '#6c757d' }
  } = conference;

  const cardStyle = {
    borderLeft: `4px solid ${design.mainColor}`,
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const badgeStyle = {
    backgroundColor: design.mainColor,
    color: '#fff'
  };

  return (
    <Card 
      className="h-100 shadow-sm conference-card" 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
      }}
    >
      {img && (
        <Card.Img 
          variant="top" 
          src={img} 
          alt={title}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge style={badgeStyle} className="mb-2">
            <i className="bi bi-calendar3 me-1"></i>
            {new Date(date).toLocaleDateString('fr-FR')}
          </Badge>
          {duration && (
            <Badge bg="secondary" className="ms-2">
              <i className="bi bi-clock me-1"></i>
              {duration}
            </Badge>
          )}
        </div>

        <Card.Title 
          className="h5 mb-3"
          style={{ color: design.mainColor }}
        >
          {title}
        </Card.Title>

        <Card.Text className="text-muted flex-grow-1">
          {description.length > 150 
            ? `${description.substring(0, 150)}...` 
            : description
          }
        </Card.Text>

        {speakers.length > 0 && (
          <div className="mb-3">
            <small className="text-muted">
              <i className="bi bi-person-badge me-1"></i>
              Intervenants :
            </small>
            <div className="mt-1">
              {speakers.slice(0, 2).map((speaker, index) => (
                <Badge 
                  key={index} 
                  bg="light" 
                  text="dark" 
                  className="me-1"
                >
                  {speaker.firstname} {speaker.lastname}
                </Badge>
              ))}
              {speakers.length > 2 && (
                <Badge bg="light" text="dark">
                  +{speakers.length - 2} autres
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button 
          as={Link} 
          to={`/conferences/${id}`}
          variant="outline-primary"
          className="mt-auto"
          style={{ 
            borderColor: design.mainColor, 
            color: design.mainColor 
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = design.mainColor;
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = design.mainColor;
          }}
        >
          <i className="bi bi-eye me-2"></i>
          Voir les détails
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ConferenceCard;