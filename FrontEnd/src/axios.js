import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5040/api', // Base URL do servidor back-end
});

export default instance;