import axios from "axios";

const API_URL = "https://making-career-choices-and-ai-based.onrender.com/api/v1/questions";
// const API_URL = "http://localhost:8000/api/v1/questions";


export const fetchQuestions = async () => {
    try {
        const response = await axios.get(`${API_URL}/getQuestions`);
    return response.data;
    } catch (error) {
        console.error("Error fetching questions:",error);
        return [];
    }
    
  };

export const submitTest = async (testData) => {
  return await axios.post(`${API_URL}/test`, testData);
};
