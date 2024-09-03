import React, { useState } from 'react';
import './App.css';

const App = () => {
  const totalSeats = 80;
  const seatsPerRow = 7;
  const lastRowSeats = 3;

  const [seats, setSeats] = useState(Array.from({ length: totalSeats }, (_, i) => ({
    seatNumber: i + 1,
    isBooked: false,
    bookedBy: null,
  })));

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    numSeats: ''
  });

  // Function to handle booking seats
  const bookSeats = () => {
    const { name, age, phoneNumber, numSeats } = formData;
    const numSeatsInt = parseInt(numSeats);

    if (numSeatsInt < 1 || numSeatsInt > 7) {
      alert('You can book between 1 and 7 seats only.');
      return;
    }

    const availableSeats = seats.filter(seat => !seat.isBooked);
    if (availableSeats.length < numSeatsInt) {
      alert('Not enough seats available.');
      return;
    }

    const newSeats = [...seats];
    let seatsBooked = [];
    let startIndex = null;

    // Find seats in a single row
    for (let i = 0; i < totalSeats; i += seatsPerRow) {
      const rowSeats = newSeats.slice(i, i + seatsPerRow);
      const rowAvailableSeats = rowSeats.filter(seat => !seat.isBooked);
      if (rowAvailableSeats.length >= numSeatsInt) {
        startIndex = i + (seatsPerRow - rowAvailableSeats.length);
        break;
      }
    }

    // If no full row is found, book nearby seats
    if (startIndex === null) {
      startIndex = newSeats.findIndex(seat => !seat.isBooked);
    }

    for (let i = startIndex; seatsBooked.length < numSeatsInt && i < totalSeats; i++) {
      if (!newSeats[i].isBooked) {
        newSeats[i].isBooked = true;
        newSeats[i].bookedBy = { name, age, phoneNumber };
        seatsBooked.push(newSeats[i].seatNumber);
      }
    }

    setSeats(newSeats);
    alert(`Seats booked: ${seatsBooked.join(', ')}`);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    bookSeats();
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="App">
      <h1>Train Seat Booking System...</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Age:
          <input type="number" name="age" value={formData.age} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Number of Seats:
          <input type="number" name="numSeats" value={formData.numSeats} onChange={handleInputChange} min="1" max="7" required />
        </label>
        <br />
        <button type="submit">Book Seats</button>
      </form>

      <div className="seats-container">
        {seats.map((seat, index) => (
          <div
            key={seat.seatNumber}
            className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
            title={seat.isBooked ? `Booked by: ${seat.bookedBy.name}, Age: ${seat.bookedBy.age}, Phone: ${seat.bookedBy.phoneNumber}` : 'Available'}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
