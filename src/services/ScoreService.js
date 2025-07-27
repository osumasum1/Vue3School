import axios from "axios";

const API_URL = 'http://localhost:3000/scores';

export default {
  async getScore(id){
    try {
       const response = await axios.get(`${API_URL}/${id}`)
       return response.data; 
    } catch (error) {
        console.error('Error getting score:', error);
        throw error;
    }
  },
  async deleteScore(id){
    try {
       const response = await axios.delete(`${API_URL}/${id}`)
       return response.data; 
    } catch (error) {
        console.error('Error deleting score:', error);
        throw error;
    }
  },
  async getScores(){
    try {
       const response = await axios.get(`${API_URL}?_expand=student`)
       return response.data; 
    } catch (error) {
        console.error('Error getting student:', error);
        throw error;
    }
  },
  async postScore(request){
    try {
       const response = await axios.post(`${API_URL}`,request)
       return response.data; 
    } catch (error) {
        console.error('Error posting score:', error);
        throw error;
    }
  },
  async putScore(id, request){
    try {
       const response = await axios.put(`${API_URL}/${id}`,request)
       return response.data; 
    } catch (error) {
        console.error('Error putting score:', error);
        throw error;
    }
  }
}