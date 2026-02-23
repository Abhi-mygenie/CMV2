import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage helpers (works on web and native)
const TOKEN_KEY = 'dinepoints_token';

export const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const setToken = async (token) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

export const removeToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // Handle unauthorized - will be caught by auth context
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Customers API
export const customersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (query) => api.get('/customers/search', { params: { q: query } }),
};

// Points API
export const pointsAPI = {
  issue: (customerId, data) => api.post(`/points/${customerId}/issue`, data),
  redeem: (customerId, data) => api.post(`/points/${customerId}/redeem`, data),
  getHistory: (customerId) => api.get(`/points/${customerId}/history`),
  issueBonus: (customerId, data) => api.post(`/points/${customerId}/bonus`, data),
};

// Loyalty Settings API
export const loyaltyAPI = {
  getSettings: () => api.get('/loyalty/settings'),
  updateSettings: (data) => api.put('/loyalty/settings', data),
};

// Wallet API
export const walletAPI = {
  credit: (customerId, data) => api.post(`/wallet/${customerId}/credit`, data),
  debit: (customerId, data) => api.post(`/wallet/${customerId}/debit`, data),
  getHistory: (customerId) => api.get(`/wallet/${customerId}/history`),
};

// Coupons API
export const couponsAPI = {
  getAll: () => api.get('/coupons'),
  getById: (id) => api.get(`/coupons/${id}`),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
  validate: (code, customerId) => api.post('/coupons/validate', { code, customer_id: customerId }),
};

// Segments API
export const segmentsAPI = {
  getAll: () => api.get('/segments'),
  getById: (id) => api.get(`/segments/${id}`),
  create: (data) => api.post('/segments', data),
  update: (id, data) => api.put(`/segments/${id}`, data),
  delete: (id) => api.delete(`/segments/${id}`),
  getCustomers: (id) => api.get(`/segments/${id}/customers`),
};

// Feedback API
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  submit: (data) => api.post('/feedback', data),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

// QR Code API
export const qrAPI = {
  generate: () => api.get('/qr/generate'),
};

// WhatsApp API
export const whatsappAPI = {
  // Templates
  getTemplates: () => api.get('/whatsapp/templates'),
  getTemplate: (id) => api.get(`/whatsapp/templates/${id}`),
  createTemplate: (data) => api.post('/whatsapp/templates', data),
  updateTemplate: (id, data) => api.put(`/whatsapp/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/whatsapp/templates/${id}`),
  // Automation
  getAutomationRules: () => api.get('/whatsapp/automation'),
  getAutomationRule: (id) => api.get(`/whatsapp/automation/${id}`),
  createAutomationRule: (data) => api.post('/whatsapp/automation', data),
  updateAutomationRule: (id, data) => api.put(`/whatsapp/automation/${id}`, data),
  deleteAutomationRule: (id) => api.delete(`/whatsapp/automation/${id}`),
  toggleAutomationRule: (id) => api.post(`/whatsapp/automation/${id}/toggle`),
  getEvents: () => api.get('/whatsapp/automation/events'),
};

export default api;
