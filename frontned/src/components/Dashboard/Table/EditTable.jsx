import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';

const EditTable = () => {
    const { id } = useParams();
    const [table, setTable] = useState({ number: '', capacity: '', availability: true });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTable = async () => {
            try {
                const response = await axios.get(`http://localhost:5047/api/Table/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTable(response.data);
            } catch (error) {
                console.error('There was an error fetching the table!', error);
            }
        };
        fetchTable();
    }, [id, token]);

    const handleEdit = async () => {
        try {
            await axios.put(`http://localhost:5047/api/Table/${id}`, table, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/tables'); // Navigate to ListTable after successful edit
        } catch (error) {
            console.error('There was an error editing the table!', error);
        }
    };

    return (
        <div className="dashboard">
            <Helmet>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" />
            </Helmet>
            <Sidebar />
            <div className="content">
                <Navbar />
                <div className="dashboard-content">
                    <h1>Edit Table</h1>
                    <div className="form-container">
                        <div className="form-group">
                            <label htmlFor="tableNumber">Table Number</label>
                            <input
                                type="text"
                                id="tableNumber"
                                className="form-control"
                                value={table.number}
                                onChange={(e) => setTable({ ...table, number: e.target.value })}
                                placeholder="Table Number"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tableCapacity">Table Capacity</label>
                            <input
                                type="text"
                                id="tableCapacity"
                                className="form-control"
                                value={table.capacity}
                                onChange={(e) => setTable({ ...table, capacity: e.target.value })}
                                placeholder="Table Capacity"
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={table.availability}
                                    onChange={(e) => setTable({ ...table, availability: e.target.checked })}
                                />
                                Available
                            </label>
                        </div>
                        <button className="btn btn-primary btn-sm action-btn" onClick={handleEdit}>Edit</button>
                    </div>
                </div>
            </div>
            <style>
                {`
                    .dashboard-content {
                        padding: 20px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }
                    .form-container {
                        width: 100%;
                        max-width: 500px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .form-group {
                        width: 100%;
                        margin-bottom: 15px;
                    }
                    .form-control {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ced4da;
                        border-radius: 4px;
                        background-color: #ffffff; /* Ensure white background */
                    }
                    .action-btn {
                        max-width: 80px; /* Adjust the width as needed */
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                `}
            </style>
        </div>
    );
};

export default EditTable;