import axios from "axios";

const API_URL = "https://making-career-choices-and-ai-based.onrender.com/api/v1/questions";

export const fetchQuestions = async () => {
    return await axios.get(`${API_URL}/getQuestions`);
  };

export const submitTest = async (testData) => {
  return await axios.post(`${API_URL}/test`, testData);
};
