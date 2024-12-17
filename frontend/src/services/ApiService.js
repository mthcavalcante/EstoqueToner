// src/services/ApiService.js

import axios from 'axios';

// Defina a URL base da sua API
const API_URL = 'http://192.168.1.223:8080/api';

export default {
  // =========================
  // === Endpoints de Toners ===
  // =========================

  // Obter todos os toners
  getToners() {
    return axios.get(`${API_URL}/toners`);
  },

  // Obter um toner específico pelo ID
  getToner(id) {
    return axios.get(`${API_URL}/toners/${id}`);
  },

  // Criar um novo toner
  createToner(data) {
    return axios.post(`${API_URL}/toners`, data);
  },

  // Atualizar um toner existente pelo ID
  updateToner(id, data) {
    return axios.put(`${API_URL}/toners/${id}`, data);
  },

  // Deletar um toner pelo ID
  deleteToner(id) {
    return axios.delete(`${API_URL}/toners/${id}`);
  },

  // Obter impressoras disponíveis para um toner específico
  getAvailablePrintersForToner(toner_id) {
    return axios.get(`${API_URL}/toners/${toner_id}/available-printers`);
  },

  // Associar uma impressora a um toner
  addPrinterToToner(toner_id, printer_id) {
    return axios.post(`${API_URL}/toners/${toner_id}/printers/${printer_id}`);
  },

  // Remover a associação de uma impressora a um toner
  removePrinterFromToner(toner_id, printer_id) {
    return axios.delete(`${API_URL}/toners/${toner_id}/printers/${printer_id}`);
  },

  // ===================================
  // === Endpoints de Fornecedores ===
  // ===================================

  // Obter todos os fornecedores
  getSuppliers() {
    return axios.get(`${API_URL}/suppliers`);
  },

  // Obter um fornecedor específico pelo ID
  getSupplier(id) {
    return axios.get(`${API_URL}/suppliers/${id}`);
  },

  // Criar um novo fornecedor
  createSupplier(data) {
    return axios.post(`${API_URL}/suppliers`, data);
  },

  // Atualizar um fornecedor existente pelo ID
  updateSupplier(id, data) {
    return axios.put(`${API_URL}/suppliers/${id}`, data);
  },

  // Deletar um fornecedor pelo ID
  deleteSupplier(id) {
    return axios.delete(`${API_URL}/suppliers/${id}`);
  },

  // =============================
  // === Endpoints de Movimentações ===
  // =============================

  // Obter todas as movimentações
  getMovements() {
    return axios.get(`${API_URL}/movements`);
  },

  // Obter uma movimentação específica pelo ID
  getMovement(id) {
    return axios.get(`${API_URL}/movements/${id}`);
  },

  // Criar uma nova movimentação
  createMovement(data) {
    return axios.post(`${API_URL}/movements`, data);
  },

  // Atualizar uma movimentação existente pelo ID
  updateMovement(id, data) {
    return axios.put(`${API_URL}/movements/${id}`, data);
  },

  // Deletar uma movimentação pelo ID
  deleteMovement(id) {
    return axios.delete(`${API_URL}/movements/${id}`);
  },

  // Registrar múltiplas entradas de toners simultaneamente
  bulkCreateEntrada(movements) {
    return axios.post(`${API_URL}/movements/bulk-entry`, movements);
  },

  // Registrar múltiplas saídas de toners simultaneamente
  bulkCreateSaida(movements) {
    return axios.post(`${API_URL}/movements/bulk-saida`, movements);
  },

  // =================================
  // === Endpoints de Impressoras ===
  // =================================

  // Obter todas as impressoras
  getPrinters() {
    return axios.get(`${API_URL}/printers`);
  },

  // Obter uma impressora específica pelo ID
  getPrinter(id) {
    return axios.get(`${API_URL}/printers/${id}`);
  },

  // Criar uma nova impressora
  createPrinter(printer) {
    return axios.post(`${API_URL}/printers`, printer);
  },

  // Atualizar uma impressora existente pelo ID
  updatePrinter(id, data) {
    return axios.put(`${API_URL}/printers/${id}`, data);
  },

  // Deletar uma impressora pelo ID
  deletePrinter(id) {
    return axios.delete(`${API_URL}/printers/${id}`);
  },

  // Obter toners compatíveis com uma impressora específica
  getCompatibleTonersForPrinter(printer_id) {
    return axios.get(`${API_URL}/printers/${printer_id}/compatible-toners`);
  },
};
