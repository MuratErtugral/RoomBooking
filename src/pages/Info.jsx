import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Info = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const roomNumber = searchParams.get('roomNumber');
  const capacity = searchParams.get('capacity');

  return (
    <Container>
      <Row >
        <Col xs={12} sm={10} md={8}>
          <div className="info-container">
            <div className="info-content">
              <h2>Reservation Details</h2>
              <p>{`You have reserved room number ${roomNumber} for ${startDate} to ${endDate}. Capacity: ${capacity}`}</p>
              <p>{`Thank you for choosing us!`}</p>
              <Link to="/" className="btn btn-primary">Go to Homepage</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Info;
