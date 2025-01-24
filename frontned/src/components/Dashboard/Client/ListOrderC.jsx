import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet';
import { jsPDF } from "jspdf"; // Import jsPDF
import '../list.css';

const ListOrderC = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // For storing the selected order
  const token = localStorage.getItem('token');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user) {
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5047/api/Order/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(response.data);
        } catch (error) {
          console.error('There was an error fetching the orders!', error);
        }
      }
    };

    fetchOrders();
  }, [token, userId]);

  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Invoice for Order #${selectedOrder.id}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date(selectedOrder.dateCreation).toLocaleString()}`, 20, 30);
    doc.text(`Status: ${selectedOrder.status === 1 ? 'Delivered' : 'Not Delivered'}`, 20, 40);
    
    let y = 50;
    doc.text("Items:", 20, y);
    y += 10;
    selectedOrder.orderItems.forEach((item) => {
        doc.text(`Item ID: ${item.itemId}, Quantity: ${item.quantite}, Unit Price: ${item.prixUnitaire} €`, 20, y);
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
        <div className="order-list">
          <h1 className="text-primary mb-4">My Orders</h1>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.dateCreation).toLocaleString()}</td>
                  <td style={{ color: order.status === 1 ? 'green' : 'red' }}>
                    {order.status === 1 ? 'Delivered' : 'Not Delivered'}
                  </td>

                  <td>
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
                <h6>Date: {new Date(selectedOrder.dateCreation).toLocaleString()}</h6>
                <h6>Status: {selectedOrder.status === 1 ? 'Delivered' : 'Not Delivered'}</h6>
                <h6>Items:</h6>
                <ul>
                  {selectedOrder.orderItems.map(item => (
                    <li key={item.id}>
                      {`Item ID: ${item.itemId}, Quantity: ${item.quantite}, Unit Price: ${item.prixUnitaire} €`}
                    </li>
                  ))}
                </ul>
                <h6>Total: {selectedOrder.orderItems.reduce((acc, item) => acc + (item.quantite * item.prixUnitaire), 0).toFixed(2)} €</h6>
             </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .order-list {
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
          .table-dark th {
            background-color: #343a40;
            color: white;
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
        `}
      </style>
    </div>
  );
};

export default ListOrderC;