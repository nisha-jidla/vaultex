import axios from "axios";

const BASE = "";

const api = axios.create({ baseURL: BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vaultex_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// User API
export const userAPI = {
  register: (data) => api.post("/api/users/register", data),
  login:    (data) => api.post("/api/users/login", data),
  profile:  ()     => api.get("/api/users/profile"),
};

// Seller API
export const sellerAPI = {
  register:  (data) => api.post("/api/sellers/register", data),
  login:     (data) => api.post("/api/sellers/login", data),
  dashboard: ()     => api.get("/api/sellers/dashboard"),
};

// Product API
export const productAPI = {
  list:       (params) => api.get("/api/products/", { params }),
  single:     (id)     => api.get(`/api/products/${id}`),
  categories: ()       => api.get("/api/products/categories"),
  create:     (data)   => api.post("/api/products/", data),
};

// Cart API
export const cartAPI = {
  get:    (userId) => api.get(`/api/cart/${userId}`),
  add:    (data)   => api.post("/api/cart/add", data),
  update: (data)   => api.put("/api/cart/update", data),
  remove: (data)   => api.delete("/api/cart/remove", { data }),
  clear:  (userId) => api.delete(`/api/cart/${userId}/clear`),
};

// Order API
export const orderAPI = {
  place:      (data)   => api.post("/api/orders/", data),
  single:     (id)     => api.get(`/api/orders/${id}`),
  userOrders: (userId) => api.get(`/api/orders/user/${userId}`),
};

// Payment API
export const paymentAPI = {
  process: (data) => api.post("/api/payments/process", data),
  status:  (id)   => api.get(`/api/payments/${id}`),
};

export default api;
