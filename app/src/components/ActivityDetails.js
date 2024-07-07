import React, { useState } from 'react';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';

const ActivityDetails = ({ activities, setActivities }) => {
  const [activityName, setActivityName] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [activityDuration, setActivityDuration] = useState('');

  const addActivity = () => {
    const newActivity = {
      name: activityName,
      date: activityDate,
      time: activityTime,
      duration: activityDuration,
    };
    setActivities([...activities, newActivity]);

    setActivityName('');
    setActivityDate('');
    setActivityTime('');
    setActivityDuration('');
  };

  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h2 className="card-title">Activity Details</h2>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Activity Name</Form.Label>
            <Form.Control
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              value={activityTime}
              onChange={(e) => setActivityTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (hours)</Form.Label>
            <Form.Control
              type="number"
              value={activityDuration}
              onChange={(e) => setActivityDuration(e.target.value)}
            />
          </Form.Group>
          <Button onClick={addActivity} className="mb-3">Add Activity</Button>
        </Form>
      </Card.Body>
      <Card.Footer>
        <ListGroup variant="flush">
          {activities.map((activity, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Activity:</strong> {activity.name} <br />
                <strong>Date:</strong> {activity.date} <br />
                <strong>Time:</strong> {activity.time} <br />
                <strong>Duration:</strong> {activity.duration} hours
              </div>
              <Button variant="danger" size="sm" onClick={() => removeActivity(index)}>Remove</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Footer>
    </Card>
  );
};

export default ActivityDetails;
