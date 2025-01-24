import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import '../list.css';

const ListFood = () => {
    const [foods, setFoods] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const token = localStorage.getItem('token');
    useEffect(() => {
        axios.get('http://localhost:5047/api/Food', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setFoods(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the foods!', error);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5047/api/Food/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFoods(foods.filter(food => food.id !== id));
        } catch (error) {
            console.error('There was an error deleting the food!', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(foods.length / itemsPerPage);

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
                    <h1 className="text-primary mb-4">Food List</h1>
                    <Link to="/food/add" className="btn btn-success btn-sm mb-3 action-btn">Add Food</Link>
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFoods.map(food => (
                                <tr key={food.id}>
                                    <td>
                                        <img src={food.imageUrl} alt={food.name} width="50" height="50" className="rounded" />
                                    </td>
                                    <td>{food.name}</td>
                                    <td>${food.price.toFixed(2)}</td>
                                    <td>
                                        <Link to={`/food/edit/${food.id}`} className="btn btn-primary btn-sm me-2 action-btn">Edit</Link>
                                        <button
                                            className="btn btn-danger btn-sm action-btn"
                                            onClick={() => handleDelete(food.id)}
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

export default ListFood;
