import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import './Home.css';


const Home = () => {
  const navigate = useNavigate(); // Hook to get the navigate function

  const gotodashboard = async () => {
    navigate("/dashboard"); // Navigate to /test route
  }

  return (
    <>
    <div className='nav' ><Navbar /></div>
    
    <div>
      <button type="submit" onClick={gotodashboard}>DashBoard</button>
    </div>
    </>
  );
}

export default Home