import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';

const EditCategory = () => {
    const { id } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:5047/api/Categorie/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategoryName(response.data.name);
            } catch (error) {
                console.error('There was an error fetching the category!', error);
            }
        };
        fetchCategory();
    }, [id, token]);

    const handleEdit = async () => {
        try {
            await axios.put(`http://localhost:5047/api/Categorie`, { id, name: categoryName }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/categorie'); // Optionally, redirect to the list page or show a success message
        } catch (error) {
            console.error('There was an error editing the category!', error);
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
                    <h1>Edit Category</h1>
                    <div>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Category Name"
                        />
                        <button className="btn btn-primary btn-sm action-btn" onClick={handleEdit}>Edit</button>
                    </div>
                </div>
            </div>
            <style>
                {`
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

export default EditCategory;