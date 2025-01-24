import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import '../list.css';

const ListTable = () => {
    const [tables, setTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get('http://localhost:5047/api/Table', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTables(response.data);
            } catch (error) {
                console.error('There was an error fetching the tables!', error);
            }
        };

        fetchTables();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5047/api/Table/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTables(tables.filter(table => table.id !== id));
        } catch (error) {
            console.error('There was an error deleting the table!', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTables = tables.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(tables.length / itemsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                    <h1 className="text-primary mb-4">Table List</h1>
                    <Link to="/tables/add" className="btn btn-success btn-sm mb-3 action-btn">Add Table</Link>
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Number</th>
                                <th>Capacity</th>
                                <th>Availability</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTables.map(table => (
                                <tr key={table.id}>
                                    <td>{table.number}</td>
                                    <td>{table.capacity}</td>
                                    <td>
                                        <span className="availability-badge">
                                            {table.availability ? 'Available' : 'Not Available'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/tables/edit/${table.id}`} className="btn btn-primary btn-sm me-2 action-btn">Edit</Link>
                                        <button
                                            className="btn btn-danger btn-sm action-btn"
                                            onClick={() => handleDelete(table.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handleClick(index + 1)}
                                className={`btn btn-sm action-btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
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
                    }
                    .table-hover tbody tr:hover {
                        background-color: #f1f1f1;
                    }
                    .btn {
                        font-size: 12px;
                        padding: 4px 8px;
                        height: 30px;
                    }
                    .btn-sm {
                        max-width: 80px;
                    }
                    .action-btn {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .pagination {
                        display: flex;
                        justify-content: center;
                        margin-top: 20px;
                    }
                    .pagination button {
                        margin: 0 5px;
                    }
                    /* Style for Availability badge */
                    .availability-badge {
                        display: inline-block;
                        padding: 5px 10px;
                        font-size: 12px;
                        text-align: center;
                        border-radius: 12px;
                    }
                `}
            </style>
        </div>
    );
};

export default ListTable;