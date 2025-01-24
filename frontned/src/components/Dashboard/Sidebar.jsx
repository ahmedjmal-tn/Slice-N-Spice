import React, { useContext } from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthContext } from "../Authentification/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  return (
    
    <div className="sidebar" id="sidebar">
            <Helmet>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      </Helmet>
      <div className="logo">
      <Link to="/">
          <h2><i className="fas fa-utensils"></i> Slice N Spice</h2>
        </Link>
      </div>
      <div className="nav">
      <div className="nav-item">
            <Link to="/dash" className="nav-item"><i className="fas fa-chair"></i><span>Dashboard</span></Link>
          </div>
          {user && user.role === 'Client' && (
            <>
            
            <div className="nav-item">
                <Link to="/ordersC" className="nav-item"><i className="fas fa-chair"></i><span>Mes orders</span></Link>
              </div>
              <div className="nav-item">
                <Link to="/ListReservationC" className="nav-item"><i className="fas fa-list-ul"></i><span>Mes Reservation</span></Link>
              </div>
            </>)}
          {user && user.role === 'Admin' && (
            <>
        <div className="nav-item"><Link to="/tables" className="nav-item"><i className="fas fa-chair"></i><span>Tables</span></Link></div>
        <div className="nav-item"><Link to="/categorie" className="nav-item"><i className="fas fa-list-ul"></i><span>Food Category</span></Link></div>
        <div className="nav-item"><Link to="/food" className="nav-item"><i className="fas fa-pizza-slice"></i><span>Food</span></Link></div>
        <div className="nav-item"> <Link to="/reservations" className="nav-item"><i className="fas fa-calendar-check"></i><span>Reservation</span></Link></div>
        <div className="nav-item"><Link to="/orders" className="nav-item"><i className="fas fa-cart-arrow-down"></i><span>Order</span></Link></div>
        </>
          )}
      </div>
    </div>
  );
};

export default Sidebar;