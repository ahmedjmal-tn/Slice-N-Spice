import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns'; // Bibliothèque pour le formatage des dates
import '../list.css';

const ListReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [userNames, setUserNames] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:5047/api/Reservation', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReservations(response.data);
                response.data.forEach(reservation => fetchUserName(reservation.userId));
            } catch (error) {
                console.error('There was an error fetching the reservations!', error);
            }
        };

        fetchReservations();
    }, [token]);

    const fetchUserName = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5047/api/Account/GetUserById/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserNames(prevState => ({ ...prevState, [userId]: `${response.data.nom} ${response.data.prenom}` }));
        } catch (error) {
            console.error(`There was an error fetching the user name for user ID ${userId}!`, error);
        }
    };

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

    const getUserName = (userId) => {
        return userNames[userId] || 'Unknown User';
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
                <div className="dashboard-content">
                    <h1 className="mb-4 text-primary">Liste des Réservations</h1>
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Date de Début</th>
                                <th>Date de Fin</th>
                                <th>Table ID</th>
                                <th>Nom d'Utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(reservation => (
                                <tr key={reservation.id}>
                                    <td>{formatDate(reservation.startTime)}</td>
                                    <td>{formatDate(reservation.endTime)}</td>
                                    <td>{reservation.tableId}</td>
                                    <td>{getUserName(reservation.userId)}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm action-btn"
                                            onClick={() => handleCancel(reservation.id)}
                                        >
                                            Annuler
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>
                {`
                    .dashboard-content {
                        padding: 20px;
                        background-color: #f4f7fc;
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        font-size: 24px;
                        font-weight: bold;
                        color: #343a40;
                    }
                    .table {
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .table-hover tbody tr:hover {
                        background-color: #f1f1f1;
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
    );
};

export default ListReservation;