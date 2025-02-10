import { useEffect, useState } from "react";
import axios from "axios";

const Results = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/results").then((res) => {
      setResult(res.data);
    });
  }, []);

  return (
    <div className="p-4">
      <h2>Test Results</h2>
      {result ? <p>Your career suggestion: {result.career}</p> : <p>Loading...</p>}
    </div>
  );
};

export default Results;
