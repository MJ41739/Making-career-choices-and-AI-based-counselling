import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Hook to get the navigate function

  const gotodashboard = async () => {
    navigate("/dashboard"); // Navigate to /test route
  }

  return (
    <div>
      <button type="submit" onClick={gotodashboard}>DashBoard</button>
    </div>
  );
}

export default Home