import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import AuthService from '../utils/auth.js'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = AuthService.loggedIn();
  const [showNotification, setShowNotification] = useState(false); // Track notification state

  // Function to handle logout
  const handleLogout = () => {
    console.log('logout was clicked')
    AuthService.logout(); // Update authentication state
  };

  // Function to show notification
  const showLoginNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Hide the notification after 3 seconds
  };

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState); // Toggle isOpen
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${isOpen ? 'open' : ''}`}></div>
        <div className={`hamburger ${isOpen ? 'open' : ''}`}></div>
        <div className={`hamburger ${isOpen ? 'open' : ''}`}></div>
      </button>
      {isOpen && (
        <ul className="menu-items">
          <li className='background-nav-container'><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li className='background-nav-container'><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
          <li className='background-nav-container'><Link to="/blog" onClick={closeMenu}>Forum</Link></li>
          <li className='background-nav-container'><Link to="/news" onClick={closeMenu}>News</Link></li>
        </ul>
      )}
      {showNotification && (
        <div className="notification">
          <p>User is not logged in!</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
