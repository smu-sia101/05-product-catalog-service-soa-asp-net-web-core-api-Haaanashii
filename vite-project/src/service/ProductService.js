import axios from 'axios';

const API_BASE = 'https://localhost:7086/api/Products';

export const getAllProducts = () => axios.get(API_BASE);
export const getProductById = (id) => axios.get(`${API_BASE}/${id}`);
export const createProduct = (product) => axios.post(API_BASE, product);
export const updateProduct = (id, product) => axios.put(`${API_BASE}/${id}`, product);
export const deleteProduct = (id) => axios.delete(`${API_BASE}/${id}`);
