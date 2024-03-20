import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const [roomCapacity, setRoomCapacity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

   if (formattedStartDate < today || formattedEndDate < today) {
      setError('Please select a date starting from today.');
    } else if (formattedEndDate < formattedStartDate) {
      setError('End date must be greater than or equal to start date.');
    } else {
      setError('');
      
      const url = `http://127.0.0.1:8000/room/availablerooms/?check_in_date=${startDate}&check_out_date=${endDate}&capacity=${roomCapacity}`;
      
      try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
          const firstRoom = response.data[0];
          const queryString = `roomNumber=${firstRoom?.id}&capacity=${roomCapacity}&startDate=${startDate}&endDate=${endDate}`;
          navigate(`/reservation?${queryString}`); 
        } else {
          setError('Sorry, no rooms available for the selected dates or capacity.');
        }
      } catch (error) {
        console.error('Error fetching available rooms:', error);
        setError('An error occurred while fetching available rooms.');
      }
    }
  };

  return (
    <Container className='container'>
      <Row>
        <Col>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group controlId="numAttendees">
            <Form.Label>Room Capacity</Form.Label>
            <Form.Select
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
            >
              <option value="">Select</option>
              <option value="1">1 Person</option>
              <option value="2">2 Persons</option>
              <option value="3">3 Persons</option>
              <option value="4">4 Persons</option>
              <option value="6">6 Persons</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Col className="text-end">
            <Button variant="primary" type="submit" disabled={!roomCapacity || !startDate || !endDate}>
              See Available Rooms
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default BookingForm;
