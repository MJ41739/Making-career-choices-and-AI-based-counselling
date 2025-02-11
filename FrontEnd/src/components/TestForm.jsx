import { useState } from "react";
import axios from "axios";

const TestForm = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption, // Store answer with question ID as key
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://making-career-choices-and-ai-based.onrender.com/api/v1/submit", {
        answers,
      });

      console.log("Test Result:", response.data);
      setResult(response.data); // Store the result to display
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Aptitude Test</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={q._id} className="mb-4">
            <p className="font-medium">{index + 1}. {q.question}</p>
            {q.options.map((option, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={q._id} // Using question ID as the name
                  value={option}
                  onChange={() => handleChange(q._id, option)}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button type="submit" className="p-2 bg-blue-500 text-white">Submit</button>
      </form>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">Test Results</h3>
          <p>Score: {result.score} / {result.totalQuestions}</p>
          <p>Percentage: {result.percentage}%</p>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default TestForm;
