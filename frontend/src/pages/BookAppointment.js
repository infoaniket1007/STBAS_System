import React, { useState } from 'react';

function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default BookAppointment; 