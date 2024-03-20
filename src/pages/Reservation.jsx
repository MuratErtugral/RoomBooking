import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ReservationForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [trin, setTrin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [error, setError] = useState('');
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const roomNumber = params.get('roomNumber');
  const startDate = params.get('startDate');
  const endDate = params.get('endDate');
  const roomCapacity = params.get('capacity');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !surname || !phoneNumber || !email || !trin) {
      setError('Please fill out all fields.');
    } else if (trin.length !== 11 || isNaN(trin)) {
      setError('Please enter a valid TR Identity Number with exactly 11 digits.');
    } else {
      setError('');
    
      const reservationData = {
        name: name,
        surname: surname,
        email: email,
        phone: phoneNumber,
        trin: trin,
        check_in: startDate,
        check_out: endDate,
        room: roomNumber
      };
  
      axios.post('http://127.0.0.1:8000/reservation/create/', reservationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Reservation created successfully:', response.data);
        const queryString = `roomNumber=${roomNumber}&capacity=${roomCapacity}&startDate=${startDate}&endDate=${endDate}`;
        navigate(`/info?${queryString}`); 
        
      })
      .catch(error => {
        console.error('Error creating reservation:', error);
        setError('An error occurred while creating the reservation. Please try again.');
      });
    
    }
  };
  const handleFormValidation = () => {
    if (name && surname && trin && phoneNumber && email) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  };

  const validateTRIN = (input) => {
    return /^\d{0,11}$/.test(input);
  };

  return (
    <Container>
      <h1 className="text-center">Reservation Form</h1>
      <Row>
        <Col>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => {setName(e.target.value); handleFormValidation();}}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="surname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            value={surname}
            onChange={(e) => {setSurname(e.target.value); handleFormValidation();}}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="trin">
          <Form.Label>TR Identity Number</Form.Label>
          <Form.Control
            type="text"
            value={trin}
            onChange={(e) => {
              const input = e.target.value;
              if (validateTRIN(input)) {
                setTrin(input);
                handleFormValidation();
              }
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            value={phoneNumber}
            onChange={(e) => {setPhoneNumber(e.target.value); handleFormValidation();}}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => {setEmail(e.target.value); handleFormValidation();}}
          />
        </Form.Group>
        <Col className="text-end">
          <Button variant="primary" type="submit" disabled={submitButtonDisabled}>
            Submit Reservation
          </Button>
        </Col>
      </Form>
    </Container>
  );
};

export default ReservationForm;
