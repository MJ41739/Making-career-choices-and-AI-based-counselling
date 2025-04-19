import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Navigation hook

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove user token
    alert("Logout successful");
    navigate("/login"); // Redirect to login page
  };
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">CareerGuide</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
      </div>

      <div className="nav-right">
        <div 
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FontAwesomeIcon icon={faUser} />
            
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/history" className="dropdown-item">Profile</Link>
            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
