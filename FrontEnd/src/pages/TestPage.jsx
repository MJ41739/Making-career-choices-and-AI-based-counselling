import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/testApi";

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
        console.log("Grouped Questions:", groupedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    getQuestions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Aptitude Test</h2>
      {Object.keys(questions).length > 0 ? (
        <form>
          {Object.entries(questions).map(([category, categoryQuestions]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600">{category}</h3>
              {categoryQuestions.map((q, index) => (
                <div key={index} className="mb-4">
                  {/* Display question number within category */}
                  <p className="font-medium">{index + 1}. {q.question}</p>
                  {q.options?.map((option, i) => (
                    <label key={i} className="block">
                      <input type="radio" name={`${category}-${index}`} value={option} />
                      {option}
                    </label>
                  ))}
                </div>
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
