import { useEffect, useState } from "react";
import { fetchQuestions } from "../api/testApi";
import axios from "axios";
import "./TestPage.css"

// Save answers and current question index in localStorage
const storeProgress = (answers, currentIndex) => {
  localStorage.setItem("answers", JSON.stringify(answers)); // Save answers to localStorage
  localStorage.setItem("currentIndex", currentIndex); // Save the current question index
};

// Retrieve saved progress (answers and question index) from localStorage
const getStoredProgress = () => {
  const savedAnswers = JSON.parse(localStorage.getItem("answers")); // Get answers
  const savedIndex = localStorage.getItem("currentIndex"); // Get current question index
  return { answers: savedAnswers, currentIndex: savedIndex ? parseInt(savedIndex) : 0 };
};

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
      setCurrentQuestionIndex(nextIndex);
    storeProgress(answers, nextIndex); // Save progress after moving to the next question
        // Submit the answer to the backend as the user moves to the next question
      submitAnswer();
    } else if (currentCategoryIndex < categories.length - 1 || (currentCategoryIndex === categories.length - 1 && currentQuestionIndex < questions[currentCategory].length - 1)) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    }
    
    // No else condition here so the last category is displayed properly
  };

   // Handle answer change and store it
   const handleAnswerChange = (questionId, selectedOption) => {
    const updatedAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(updatedAnswers);
    storeProgress(updatedAnswers, currentQuestionIndex); // Save progress after each answer
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitted Answers:", answers);

      const response = await axios.post("http://localhost:8000/api/v1/questions/submitTest", {
        answers,
      });

      console.log("Test Result:", response);
      setResult(response.data.data);
      console.log({result});
      
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };
  
  // Send the answer to the backend (after each question)
  const submitAnswer = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const answer = answers[currentQuestion._id];
      await axios.post("http://localhost:8000/api/v1/answers/submitAnswer", {
        questionId: currentQuestion._id,
        selectedOption: answer,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
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
          <p>Recommended Career Path: {result}</p>
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
