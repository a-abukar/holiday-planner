import React, { useState } from 'react';
import { format, eachDayOfInterval, startOfDay, endOfDay, parseISO, differenceInMinutes, isWithinInterval, addDays, getHours, getMinutes, addMinutes } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Card, Table, Button, ListGroup, Alert } from 'react-bootstrap';

const Calendar = ({ flights, setFlights, activities, setActivities }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calendarDays, setCalendarDays] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState('');

  const generateCalendar = () => {
    if (!startDate || !endDate) return;
    const interval = { start: parseISO(startDate), end: parseISO(endDate) };
    const days = eachDayOfInterval(interval);
    setCalendarDays(days);
    setShowCalendar(true);
  };

  const getDayActivities = (day) => {
    return [
      ...flights.filter(flight => {
        const depDate = parseISO(flight.departureDate);
        const arrDate = parseISO(flight.arrivalDate);
        return (
          isWithinInterval(depDate, { start: startOfDay(day), end: endOfDay(day) }) ||
          isWithinInterval(arrDate, { start: startOfDay(day), end: endOfDay(day) }) ||
          (depDate < startOfDay(day) && arrDate > endOfDay(day))
        );
      }).map(flight => ({ ...flight, type: 'flight' })),
      ...activities.filter(activity => {
        const activityStart = parseISO(`${activity.date}T${activity.time}`);
        const activityEnd = addMinutes(activityStart, activity.duration * 60);
        return (
          isWithinInterval(activityStart, { start: startOfDay(day), end: endOfDay(day) }) ||
          isWithinInterval(activityEnd, { start: startOfDay(day), end: endOfDay(day) }) ||
          (activityStart < startOfDay(day) && activityEnd > endOfDay(day))
        );
      }).map(activity => ({ ...activity, type: 'activity' }))
    ];
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const rows = [];

    calendarDays.forEach(day => {
      const dayActivities = getDayActivities(day);
      if (dayActivities.length > 0) {
        rows.push([format(day, 'yyyy-MM-dd'), '']);
        dayActivities.forEach(activity => {
          rows.push([
            '',
            activity.type === 'flight'
              ? `Flight: ${activity.flight}, Departure: ${activity.departureDate} at ${activity.departureTime}, Arrival: ${activity.arrivalDate} at ${activity.arrivalTime}, Check-In Begins: ${activity.checkInTime}`
              : `Activity: ${activity.name}, Date: ${activity.date}, Time: ${activity.time}, Duration: ${activity.duration} hours`
          ]);
        });
      }
    });

    doc.autoTable({
      head: [['Date', 'Details']],
      body: rows,
    });

    doc.save('holiday_calendar.pdf');
  };

  const removeFlight = (index) => {
    const updatedFlights = flights.filter((_, i) => i !== index);
    setFlights(updatedFlights);
  };

  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };
  

  const renderMiniCalendar = () => {
    const times = Array.from({ length: 24 }, (_, hour) => `${hour}:00`);
    return (
      <Table bordered>
        <thead>
          <tr>
            <th>Time</th>
            {calendarDays.map(day => (
              <th key={day}>{format(day, 'yyyy-MM-dd')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td>{time}</td>
              {calendarDays.map(day => {
                const dayStart = startOfDay(day);
                const dayEnd = endOfDay(day);
                const dayActivities = getDayActivities(day);
                const cells = [];
  
                dayActivities.forEach((activity, index) => {
                  const activityStart = activity.type === 'flight'
                    ? parseISO(`${activity.departureDate}T${activity.departureTime}`)
                    : parseISO(`${activity.date}T${activity.time}`);
                  let activityEnd = activity.type === 'flight'
                    ? parseISO(`${activity.arrivalDate}T${activity.arrivalTime}`)
                    : addMinutes(activityStart, activity.duration * 60);
  
                  // Handle events spanning to the next day
                  if (activityEnd <= activityStart) {
                    activityEnd = addDays(activityEnd, 1);
                  }
  
                  const start = isWithinInterval(activityStart, { start: dayStart, end: dayEnd }) ? activityStart : dayStart;
                  const end = isWithinInterval(activityEnd, { start: dayStart, end: dayEnd }) ? activityEnd : dayEnd;
  
                  // Calculate row span based on activity duration
                  const startHour = getHours(start);
                  const endHour = getHours(end);
                  const startMinutes = getMinutes(start);
                  const endMinutes = getMinutes(end);
                  const span = Math.ceil((differenceInMinutes(end, start) + startMinutes) / 60);
  
                  if (parseInt(time.split(':')[0]) === startHour && startMinutes === 0) {
                    cells.push(
                      <td
                        key={index}
                        rowSpan={span}
                        style={{
                          backgroundColor: '#d1ecf1',
                          border: '1px solid #bee5eb',
                          borderRadius: '4px',
                          padding: '2px 4px',
                          margin: '2px 0',
                          overflow: 'hidden',
                        }}
                      >
                        {activity.type === 'flight' ? `Flight: ${activity.flight}` : `Activity: ${activity.name}`}
                      </td>
                    );
                  }
                });
  
                if (cells.length === 0) {
                  cells.push(<td key={day}></td>);
                }
  
                return cells;
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  
  

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="mb-4 mt-4">
        <Card.Header>
          <h2 className="card-title">Calendar</h2>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button onClick={generateCalendar} className="mb-3">Generate Calendar</Button>
          <Button onClick={downloadPDF} className="mb-3 ms-2">Download as PDF</Button>
        </Card.Body>
      </Card>
      {showCalendar && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <h3>Table View</h3>
              <Table bordered className="mt-4">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarDays.map((day, dayIndex) => {
                    const dayActivities = getDayActivities(day);
                    return (
                      <tr key={dayIndex}>
                        <td>{format(day, 'yyyy-MM-dd')}</td>
                        <td>
                          <ListGroup>
                            {dayActivities.map((activity, index) => (
                              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                <div>
                                  {activity.type === 'flight' ? (
                                    <>
                                      <strong>Flight:</strong> {activity.flight} <br />
                                      <strong>Departure:</strong> {activity.departureDate} at {activity.departureTime} <br />
                                      <strong>Arrival:</strong> {activity.arrivalDate} at {activity.arrivalTime} <br />
                                      <strong>Check-In Begins:</strong> {activity.checkInTime}
                                    </>
                                  ) : (
                                    <>
                                      <strong>Activity:</strong> {activity.name} <br />
                                      <strong>Date:</strong> {activity.date} <br />
                                      <strong>Time:</strong> {activity.time} <br />
                                      <strong>Duration:</strong> {activity.duration} hours
                                    </>
                                  )}
                                </div>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => activity.type === 'flight' ? removeFlight(index) : removeActivity(index)}
                                >
                                  Remove
                                </Button>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <h3>Mini Calendar View</h3>
              <div className="mini-calendar">
                {renderMiniCalendar()}
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Calendar;
