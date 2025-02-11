import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/testApi";
import axios from "axios";
import "./TestPage.css"

const TestPage = () => {
  const [questions, setQuestions] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const categories = Object.keys(questions);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const data = await fetchQuestions();
        console.log("Fetched Data:", data);

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
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    getQuestions();
  }, []);

  const handleNext = () => {
    const currentCategory = categories[currentCategoryIndex];
    const totalQuestionsInCategory = questions[currentCategory].length;

    if (currentQuestionIndex < totalQuestionsInCategory - 1) {
      // Move to the next question in the current category
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < categories.length - 1 || (currentCategoryIndex === categories.length - 1 && currentQuestionIndex < questions[currentCategory].length - 1)) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    }
    
    // No else condition here so the last category is displayed properly
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitted Answers:", answers);

      const response = await axios.post("http://localhost:8000/api/v1/questions/submit", {
        answers,
      });

      console.log("Test Result:", response.data);
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  if (categories.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentCategory = categories[currentCategoryIndex];
  const currentQuestion = questions[currentCategory][currentQuestionIndex];

  return (
    <div className="test-container">
      <h2 className="test-heading">Aptitude Test</h2>
  
      {result ? (
        <div className="result-div">
          <h3 className="result-heading">Test Results</h3>
          <p>Score: {result.score} / {result.totalQuestions}</p>
          <p>Percentage: {result.percentage}%</p>
          <p>{result.message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3 className="category-heading">{currentCategory}</h3>
          <div className="question-container">
            <p className="question-text">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
            {currentQuestion.options.map((option, i) => (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={option}
                  checked={answers[currentQuestion._id] === option}
                  onChange={() => handleAnswerChange(currentQuestion._id, option)}
                  className="option-input"
                />
                {option}
              </label>
            ))}
          </div>
  
          {/* Ensure last category's questions are displayed before submission */}
          {currentCategoryIndex === categories.length - 1 && currentQuestionIndex === questions[currentCategory].length - 1 ? (
            <button
              type="submit"
              onClick={handleNext}
              disabled={!answers[currentQuestion._id]}
              className="submit-btn"
            >
              Submit Test
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!answers[currentQuestion._id]}
              className="next-btn"
            >
              Next
            </button>
          )}
        </form>
      )}
    </div>
  );
  
};

export default TestPage;
