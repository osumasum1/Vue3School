import axios from "axios";

const API_URL = 'http://localhost:3000/students';

export default {
  async getStudents() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  async postStudent(request){
    try {
       const response = await axios.post(API_URL,request)
       return response.data; 
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
  },
  async putStudent(id,request){
    try {
       const response = await axios.put(`${API_URL}/${id}`,request)
       return response.data; 
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
  },
  async deleteStudent(id,request){
    try {
       const response = await axios.delete(`${API_URL}/${id}`,request)
       return response.data; 
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
  }
}