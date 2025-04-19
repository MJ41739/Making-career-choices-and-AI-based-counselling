import TestResult from "../Models/testResults.models.js";

const getUserTestHistory = async (req, res) => {
  try {
    const email = req.body.email;
    const results = await TestResult.find({ email }).sort({ takenAt: -1 });
    res.json({ testHistory: results });
  } catch (error) {
    console.error("Error fetching test history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {getUserTestHistory}
