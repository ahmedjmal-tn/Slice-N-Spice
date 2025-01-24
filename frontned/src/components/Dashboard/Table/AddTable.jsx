import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const AddTable = () => {
    const [newTable, setNewTable] = useState({ number: '', capacity: '', availability: true });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:5047/api/Table', newTable, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewTable({ number: '', capacity: '', availability: true });
            navigate('/tables'); // Navigate to ListTable after successful addition
        } catch (error) {
            console.error('There was an error adding the table!', error);
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
                    <h1>Add Table</h1>
                    <div className="form-container">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={newTable.number}
                                onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                                placeholder="Table Number"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={newTable.capacity}
                                onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                                placeholder="Table Capacity"
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newTable.availability}
                                    onChange={(e) => setNewTable({ ...newTable, availability: e.target.checked })}
                                />
                                Available
                            </label>
                        </div>
                        <button className="btn btn-success btn-sm action-btn" onClick={handleAdd}>Add</button>
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

export default AddTable;