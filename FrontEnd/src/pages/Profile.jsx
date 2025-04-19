import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [testHistory, setTestHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const email = localStorage.getItem("email"); // get email from localStorage
        if (!email) {
          console.error("Email not found in localStorage");
          return;
        }

        const res = await axios.post("http://localhost:8000/api/v1/users/history", {
          email: email, // send email in body
        });

        setTestHistory(res.data.testHistory);
      } catch (error) {
        console.error("Error fetching test history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="profile-container">
  <h2>Your Test History</h2>
  {testHistory.length === 0 ? (
    <p>No tests taken yet.</p>
  ) : (
    <div className="test-list">
      {testHistory.map((test, index) => (
        <div className="test-entry" key={index}>
          <div className="test-item"><strong>Date:</strong><br />{test.takenAt ? new Date(test.takenAt).toLocaleString() : "N/A"}</div>
          <div className="test-item"><strong>Career:</strong><br />{test.careerPrediction ?? "N/A"}</div>
          <div className="test-item"><strong>Overall %:</strong><br />{test.overallPercentage?.toFixed(2) ?? "N/A"}%</div>
          <div className="test-item category-scores">
            <strong>Category Scores:</strong>
            <ul>
              {test.categoryScores
                ? Object.entries(test.categoryScores).map(([category, score]) => (
                    <li key={category}>{category}: {score}</li>
                  ))
                : <li>N/A</li>}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Profile;
