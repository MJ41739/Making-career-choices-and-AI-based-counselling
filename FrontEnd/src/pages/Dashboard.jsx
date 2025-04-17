import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to get the navigate function

  const startTest = async () => {
    navigate("/test"); // Navigate to /test route
  }

  return (
    <>
    <div className='nav' ><Navbar/></div>
    <div>
      <button type="submit" onClick={startTest}>Start Test</button>
    </div>
    </>
    
  );
}

export default Dashboard;
