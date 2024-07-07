import React, { useState } from 'react';
import Calendar from './components/Calendar';
import HotelDetails from './components/HotelDetails';
import FlightDetails from './components/FlightDetails';
import ActivityDetails from './components/ActivityDetails'; // Import ActivityDetails

const App = () => {
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activities, setActivities] = useState([]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Holiday Planner</h1>
      <div className="row">
        <div className="col-md-6">
          <FlightDetails flights={flights} setFlights={setFlights} />
        </div>
        <div className="col-md-6">
          <ActivityDetails activities={activities} setActivities={setActivities} /> {/* Add ActivityDetails */}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <HotelDetails hotels={hotels} setHotels={setHotels} />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <Calendar flights={flights} setFlights={setFlights} activities={activities} setActivities={setActivities} />
        </div>
      </div>
    </div>
  );
};

export default App;
