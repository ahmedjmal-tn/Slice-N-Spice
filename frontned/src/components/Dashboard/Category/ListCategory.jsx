import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import '../list.css';

const ListCategory = () => {
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5047/api/Categorie', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('There was an error fetching the categories!', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5047/api/Categorie/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(categories.filter(category => category.id !== id));
        } catch (error) {
            console.error('There was an error deleting the category!', error);
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
                    <h1 className="mb-4 text-primary">Category List</h1>
                    <Link to="/categorie/add" className="btn btn-success btn-sm mb-3 action-btn">Add Category</Link>
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <Link to={`/categorie/edit/${category.id}`} className="btn btn-primary btn-sm me-2 action-btn">Edit</Link>
                                        <button
                                            className="btn btn-danger btn-sm action-btn"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Delete
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
                        font-size: 14px; /* Adjust font size */
                        padding: 6px 16px; /* Add horizontal padding for width */
                        height: auto;
                        max-width: 120px; /* Limit button width */
                        text-align: center; /* Ensure text is centered */
                        word-wrap: break-word; /* Prevent text overflow */
                    }
                    .btn-sm {
                        font-size: 12px; /* Smaller font for small buttons */
                        padding: 4px 8px;
                    }
                    .action-btn {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .btn:hover {
                        transform: scale(1.05); /* Slight scaling effect */
                        transition: all 0.3s ease;
                    }
                `}
            </style>
        </div>
    );
};

export default ListCategory;
