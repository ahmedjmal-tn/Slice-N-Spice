import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import {  useNavigate } from 'react-router-dom';
const AddCategory = () => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:5047/api/Categorie', { name: newCategoryName }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            setNewCategoryName('');
            navigate('/categorie');// Optionally, redirect to the list page or show a success message
        } catch (error) {
            console.error('There was an error adding the category!', error);
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
                    <h1>Add Category</h1>
                    <div>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New Category Name"
                        />
                        <button className="btn btn-success btn-sm action-btn" onClick={handleAdd}>Add</button>
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

export default AddCategory;