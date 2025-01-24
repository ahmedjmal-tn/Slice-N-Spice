import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { jsPDF } from "jspdf"; // Import jsPDF
import '../list.css';

const ListOrder = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedOrder, setSelectedOrder] = useState(null); // For storing the selected order
    const [userNames, setUserNames] = useState({});
    const [foodNames, setFoodNames] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5047/api/Order', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
                response.data.forEach(order => {
                    fetchUserName(order.userId);
                    order.orderItems.forEach(item => fetchFoodName(item.itemId));
                });
            } catch (error) {
                console.error('There was an error fetching the orders!', error);
            }
        };

        fetchOrders();
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

    const fetchFoodName = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:5047/api/Food/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFoodNames(prevState => ({ ...prevState, [itemId]: response.data.name }));
        } catch (error) {
            console.error(`There was an error fetching the food name for item ID ${itemId}!`, error);
        }
    };

    const handleDeliver = async (id) => {
        try {
            await axios.put(`http://localhost:5047/api/Order/${id}/deliver`, null, {
                headers: {
                    'accept': '*/*',
                    Authorization: `Bearer ${token}`,
                }
            });
            setOrders(orders.map(order => order.id === id ? { ...order, status: 1 } : order));
        } catch (error) {
            console.error('There was an error marking the order as delivered!', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getUserName = (userId) => {
        return userNames[userId] || 'Unknown User';
    };

    const getFoodName = (itemId) => {
        return foodNames[itemId] || 'Unknown Food';
    };

    // Function to generate the invoice PDF
    const generateInvoicePDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text(`Invoice for Order #${selectedOrder.id}`, 20, 20);
        
        doc.setFontSize(12);
        doc.text(`User: ${getUserName(selectedOrder.userId)}`, 20, 30);
        doc.text(`Date: ${new Date(selectedOrder.dateCreation).toLocaleString()}`, 20, 40);
        doc.text(`Status: ${selectedOrder.status === 1 ? 'Delivered' : 'Not Delivered'}`, 20, 50);
        
        let y = 60;
        doc.text("Items:", 20, y);
        y += 10;
        selectedOrder.orderItems.forEach((item) => {
            doc.text(`Food: ${getFoodName(item.itemId)}, Quantity: ${item.quantite}, Unit Price: ${item.prixUnitaire} €`, 20, y);
            y += 10;
        });

        const total = selectedOrder.orderItems.reduce((acc, item) => acc + (item.quantite * item.prixUnitaire), 0).toFixed(2);
        doc.text(`Total: ${total} €`, 20, y + 10);
        
        // Save the document as a PDF
        doc.save(`Invoice_Order_${selectedOrder.id}.pdf`);
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
                    <h1 className="text-primary mb-4">Order List</h1>
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{getUserName(order.userId)}</td>
                                    <td>{order.status === 1 ? 'Delivered' : 'Not Delivered'}</td>
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm action-btn"
                                            onClick={() => handleDeliver(order.id)}
                                            disabled={order.status === 1}
                                        >
                                            {order.status === 1 ? 'Delivered' : 'Deliver'}
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm action-btn"
                                            onClick={() => setSelectedOrder(order)} // Open modal to view the order details
                                        >
                                            View Invoice
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

            {/* Modal for viewing invoice */}
            {selectedOrder && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Invoice for Order #{selectedOrder.id}</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
                            </div>
                            <div className="modal-body">
                                <h6>User: {getUserName(selectedOrder.userId)}</h6>
                                <h6>Date: {new Date(selectedOrder.dateCreation).toLocaleString()}</h6>
                                <h6>Status: {selectedOrder.status === 1 ? 'Delivered' : 'Not Delivered'}</h6>
                                <h6>Items:</h6>
                                <ul>
                                    {selectedOrder.orderItems.map(item => (
                                        <li key={item.id}>
                                            {`Food: ${getFoodName(item.itemId)}, Quantity: ${item.quantite}, Unit Price: ${item.prixUnitaire} €`}
                                        </li>
                                    ))}
                                </ul>
                                <h6>Total: {selectedOrder.orderItems.reduce((acc, item) => acc + (item.quantite * item.prixUnitaire), 0).toFixed(2)} €</h6>
                                <button className="btn btn-primary" onClick={generateInvoicePDF}>Download PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                `}
            </style>
        </div>
    );
};

export default ListOrder;