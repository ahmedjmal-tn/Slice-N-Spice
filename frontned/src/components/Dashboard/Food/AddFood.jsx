import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddFood = () => {
    const [newFood, setNewFood] = useState({ name: '', price: '', imageUrl: '', categorieId: '' });
    const [files, setFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
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
        fetchCategories();
    }, [token]);

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:5047/api/Food', newFood, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewFood({ name: '', price: '', imageUrl: '', categorieId: '' });
            setFiles([]);
            navigate('/food'); // Navigate to ListFood after successful addition
        } catch (error) {
            console.error('There was an error adding the food!', error);
        }
    };

    const serverOptions = {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'frontend');
            data.append('cloud_name', 'dea3u12iy');
            data.append('publicid', file.name);

            axios.post('https://api.cloudinary.com/v1_1/dea3u12iy/image/upload', data)
                .then((response) => response.data)
                .then((data) => {
                    setNewFood((prevFood) => ({ ...prevFood, imageUrl: data.url }));
                    load(data);
                })
                .catch((err) => {
                    console.error('Error uploading file:', err);
                    error('Upload failed');
                    abort();
                });
        },
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
                    <h1>Add Food</h1>
                    <div className="form-container">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={newFood.name}
                                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                                placeholder="Food Name"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={newFood.price}
                                onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                                placeholder="Food Price"
                            />
                        </div>
                        <div className="form-group">
                            <select
                                className="form-control"
                                value={newFood.categorieId}
                                onChange={(e) => setNewFood({ ...newFood, categorieId: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <FilePond
                                files={files}
                                acceptedFileTypes="image/*"
                                onupdatefiles={setFiles}
                                allowMultiple={false}
                                server={serverOptions}
                                name="imageUrl"
                            />
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

export default AddFood;