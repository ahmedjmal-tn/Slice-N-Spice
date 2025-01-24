import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';

const ListReservationC = () => {
  const [reservations, setReservations] = useState([]);
  const [userId, setUserId] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user) {
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5047/api/Reservation/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setReservations(response.data);
        } catch (error) {
          console.error('There was an error fetching the reservations!', error);
        }
      }
    };

    fetchReservations();
  }, [token, userId]);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5047/api/Reservation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(reservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error('There was an error canceling the reservation!', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="dashboard">
      <Helmet>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      </Helmet>
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="reservation-list">
          <h1 className="text-primary mb-4">My Reservations</h1>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Reservation ID</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Table ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{formatDate(reservation.startTime)}</td>
                  <td>{formatDate(reservation.endTime)}</td>
                  <td>{reservation.tableId}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm action-btn"
                      onClick={() => handleCancel(reservation.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <style>
            {`
              .reservation-list {
                padding: 20px;
                background-color: #f4f7fc;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                font-size: 24px;
                font-weight: bold;
              }
              .table-hover tbody tr:hover {
                background-color: #f1f1f1;
              }
              .table-dark th {
                background-color: #343a40;
                color: white;
              }
              .btn {
                transition: all 0.3s ease;
              }
              .btn:hover {
                transform: scale(1.1);
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default ListReservationC;