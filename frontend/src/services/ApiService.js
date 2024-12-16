// src/services/ApiService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Ajuste a porta se necessário

export default {
  // Toners
  getToners() {
    return axios.get(`${API_URL}/toners`);
  },
  getToner(id) {
    return axios.get(`${API_URL}/toners/${id}`);
  },
  createToner(data) {
    return axios.post(`${API_URL}/toners`, data);
  },
  updateToner(id, data) {
    return axios.put(`${API_URL}/toners/${id}`, data);
  },
  deleteToner(id) {
    return axios.delete(`${API_URL}/toners/${id}`);
  },

  // Suppliers
  getSuppliers() {
    return axios.get(`${API_URL}/suppliers`);
  },
  getSupplier(id) {
    return axios.get(`${API_URL}/suppliers/${id}`);
  },
  createSupplier(data) {
    return axios.post(`${API_URL}/suppliers`, data);
  },
  updateSupplier(id, data) {
    return axios.put(`${API_URL}/suppliers/${id}`, data);
  },
  deleteSupplier(id) {
    return axios.delete(`${API_URL}/suppliers/${id}`);
  },

  // Movements
  getMovements() {
    return axios.get(`${API_URL}/movements`);
  },
  getMovement(id) {
    return axios.get(`${API_URL}/movements/${id}`);
  },
  createMovement(data) {
    return axios.post(`${API_URL}/movements`, data);
  },
  updateMovement(id, data) {
    return axios.put(`${API_URL}/movements/${id}`, data);
  },
  deleteMovement(id) {
    return axios.delete(`${API_URL}/movements/${id}`);
  },
};
