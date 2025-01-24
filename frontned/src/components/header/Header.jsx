import React, { useRef, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './header.css';
import { Container } from 'reactstrap';
import { AuthContext } from "../Authentification/AuthContext";
import axios from "axios";

const navLinks = [
    {
        display: 'Home',
        url: '/'
    },
    {
        display: 'Menu',
        url: '/menu'
    },
    {
        display: 'Reservation',
        url: '/reservation'
    },
    // Display Dashboard link only for Admin users
    // This should be handled dynamically based on the user's role
];

function Header() {
    const menuRef = useRef();
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchCartItems = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:5047/api/Cart/user/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCartItems(response.data.cartItems);
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                }
            }
        };

        fetchCartItems();
    }, [user]);

    const calculateTotalItems = () => {
        return cartItems.length;
    };

    const menuToggle = () => menuRef.current.classList.toggle("active__menu");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };



    return (
        <header className="header">
            <Container>
                <div className="navigation">
                    <div className="logo">
                        <h2 className="d-flex align-items-center gap-1" style={{ color: "#F5B70A" }}>
                            <span><i className="ri-restaurant-2-line"></i></span>Slice N Spice
                        </h2>
                    </div>

                    <div className="nav__menu" ref={menuRef}>
                        <div className="nav__list__wrapper d-flex align-items-center gap-5">
                            <ul className="nav__list">
                                {navLinks.map((item, index) => (
                                    <li className="nav__item" key={index}>
                                        <Link to={item.url} onClick={menuToggle}>{item.display}</Link>
                                    </li>
                                ))}
                                {
                                    <li className="nav__item">
                                         <Link to="/dash" className="nav-item"><i className="fas fa-chair"></i><span>Dashboard</span></Link>
                                    </li>
                                }
                            </ul>
                            <div className="menu__right">
                                <div className="custom_search">
                                    <input type="text" placeholder="search item..." />
                                    <span><i className="ri-search-line"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center" style={{ gap: '10px', padding: '10px' }}>
                        <Link to="/cart">
                            <span className="cart__icon">
                                <i className="ri-shopping-basket-line"></i>
                                <span className="badge">{calculateTotalItems()}</span>
                            </span>
                        </Link>
                        {user ? (
                            <button className="btn" onClick={handleLogout} style={{ color: "#F5B70A" }}>Logout</button>
                        ) : (
                            <Link to="/login">
                                <button className="btn" style={{ color: "#F5B70A" }}>Login</button>
                            </Link>
                        )}
                    </div>

                    <div className="mobile_menu">
                        <span><i className="ri-menu-line" onClick={menuToggle}></i></span>
                    </div>
                </div>
            </Container>
        </header>
    );
}

export default Header;