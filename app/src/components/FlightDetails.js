import React, { useState } from 'react';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';

const FlightDetails = ({ flights, setFlights }) => {
  const [flight, setFlight] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalDate, setArrivalDate] = useState(''); // New arrival date state
  const [arrivalTime, setArrivalTime] = useState('');

  const addFlight = () => {
    const checkInTime = new Date(`${departureDate}T${departureTime}`);
    checkInTime.setHours(checkInTime.getHours() - 24);

    const newFlight = {
      flight,
      departureDate,
      departureTime,
      arrivalDate, // Include arrival date in the flight object
      arrivalTime,
      checkInTime: checkInTime.toISOString().split('T')[1].slice(0, 5),
    };
    setFlights([...flights, newFlight]);

    setFlight('');
    setDepartureDate('');
    setDepartureTime('');
    setArrivalDate(''); // Reset arrival date
    setArrivalTime('');
  };

  const removeFlight = (index) => {
    const updatedFlights = flights.filter((_, i) => i !== index);
    setFlights(updatedFlights);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h2 className="card-title">Flight Details</h2>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Flight</Form.Label>
            <Form.Control
              type="text"
              value={flight}
              onChange={(e) => setFlight(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Departure Date</Form.Label>
            <Form.Control
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Departure Time</Form.Label>
            <Form.Control
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Arrival Date</Form.Label>
            <Form.Control
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Arrival Time</Form.Label>
            <Form.Control
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </Form.Group>
          <Button onClick={addFlight} className="mb-3">Add Flight</Button>
        </Form>
      </Card.Body>
      <Card.Footer>
        <ListGroup variant="flush">
          {flights.map((flight, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Flight:</strong> {flight.flight}<br />
                <strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}<br />
                <strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}<br />
                <strong>Check-In Begins:</strong> {flight.checkInTime}
              </div>
              <Button variant="danger" size="sm" onClick={() => removeFlight(index)}>Remove</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Footer>
    </Card>
  );
};

export default FlightDetails;
