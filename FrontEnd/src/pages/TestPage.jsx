import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/testApi";
import axios from "axios";

const TestPage = () => {
  const [questions, setQuestions] = useState({});
  
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const data = await fetchQuestions();
        console.log("Fetched Data:", data);

        // Extract the actual questions array from `data.data`
        const extractedQuestions = Array.isArray(data.data) ? data.data : [];

        // Group questions by category
        const groupedQuestions = extractedQuestions.reduce((acc, q) => {
          if (!acc[q.category]) {
            acc[q.category] = [];
          }
          acc[q.category].push(q);
          return acc;
        }, {});

        setQuestions(groupedQuestions);
        // console.log("Grouped Questions:", groupedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    getQuestions();
  }, []);
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
      console.log("asdadsa",answers);
      
      const response = await axios.post("http://localhost:8000/api/v1/questions/submit", {
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
      <h2 className="text-xl font-bold text-red-400 mb-4">Aptitude Test</h2>
      {Object.keys(questions).length > 0 ? (
        <form onSubmit={handleSubmit}>
          {Object.entries(questions).map(([category, categoryQuestions]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600">{category}</h3>
              {categoryQuestions.map((q, index) => (
                <div key={index} className="mb-4">
                  {/* Display question number within category */}
                  <p className="font-medium">{index + 1}. {q.question}</p>
                  {q.options?.map((option, i) => (
                    <label key={i} className="block">
                      <input type="radio" name={q._id} value={option} onChange={() => handleChange(q._id, option)}/>
                      {option}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <button type="submit" class="border border-black">
  Submit
</button>

        </form>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default TestPage;
