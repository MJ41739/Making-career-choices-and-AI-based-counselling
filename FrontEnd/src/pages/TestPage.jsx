import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/testApi";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await fetchQuestions();
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    getQuestions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Aptitude Test</h2>
      {questions.length > 0 ? (
        <form>
          {questions.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">{q.question}</p>
              {q.options.map((option, i) => (
                <label key={i} className="block">
                  <input type="radio" name={`q${index}`} value={option} />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit" className="p-2 bg-blue-500 text-white">Submit</button>
        </form>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default TestPage;
