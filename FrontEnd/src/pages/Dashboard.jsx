import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to get the navigate function

  const startTest = async () => {
    navigate("/test"); // Navigate to /test route
  }

  return (
    <div>
      <button type="submit" onClick={startTest}>Start Test</button>
    </div>
  );
}

export default Dashboard;
