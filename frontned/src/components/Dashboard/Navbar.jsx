import React from 'react';
import './dashboard.css';
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <div className="actions">
        <div><i className="fas fa-bell"></i></div>
        <div><i className="fas fa-user-circle"></i></div>
      </div>
    </div>
  );
};

export default Navbar;