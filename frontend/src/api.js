import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const generateMCQs = async (url, token) => {
  try {
    const response = await axios.post(`${API_URL}/generate-mcqs`, { url }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating MCQs:", error);
    throw error;
  }
};

export const validateAnswers = async (answers, token) => {
  try {
    const response = await axios.post(`${API_URL}/validate-answers`, { answers }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error validating answers:", error);
    throw error;
  }
};
