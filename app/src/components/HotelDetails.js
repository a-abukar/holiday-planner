import React, { useState } from 'react';

const HotelDetails = ({ hotels, setHotels }) => {
  const [hotelName, setHotelName] = useState('');
  const [hotelImage, setHotelImage] = useState(null);

  const addHotel = () => {
    setHotels([...hotels, { name: hotelName, image: URL.createObjectURL(hotelImage) }]);
    setHotelName('');
    setHotelImage(null);
  };

  return (
    <div>
      <h2>Hotel Details</h2>
      <input
        type="text"
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
        placeholder="Hotel Name"
      />
      <input
        type="file"
        onChange={(e) => setHotelImage(e.target.files[0])}
      />
      <button onClick={addHotel}>Add Hotel</button>
      <ul>
        {hotels.map((hotel, index) => (
          <li key={index}>
            {hotel.name}
            {hotel.image && <img src={hotel.image} alt={hotel.name} style={{ width: '100px', height: 'auto' }} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelDetails;
