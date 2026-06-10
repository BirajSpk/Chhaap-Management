import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chhaap_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('chhaap_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  verify: () => api.get('/auth/verify').then(r => r.data),
}

export const productsApi = {
  list: () => api.get('/products').then(r => r.data),
  get: (id) => api.get(`/products/${id}`).then(r => r.data),
  create: (data) => api.post('/products', data).then(r => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/products/${id}`).then(r => r.data),
}

export const ordersApi = {
  list: (params) => api.get('/orders', { params }).then(r => r.data),
  get: (id) => api.get(`/orders/${id}`).then(r => r.data),
  create: (data) => api.post('/orders', data).then(r => r.data),
  updateStatus: (id, status, extra = {}) => api.put(`/orders/${id}/status`, { status, ...extra }).then(r => r.data),
  updateDefect: (id, data) => api.put(`/orders/${id}/defect`, data).then(r => r.data),
  update: (id, data) => api.put(`/orders/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/orders/${id}`).then(r => r.data),
  getCount: () => api.get('/orders/count').then(r => r.data),
}

export const expensesApi = {
  list: (params) => api.get('/expenses', { params }).then(r => r.data),
  create: (data) => api.post('/expenses', data).then(r => r.data),
  update: (id, data) => api.put(`/expenses/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/expenses/${id}`).then(r => r.data),
}

export const analyticsApi = {
  get: (params) => api.get('/analytics', { params }).then(r => r.data),
}

export const activityApi = {
  list: (params) => api.get('/activity', { params }).then(r => r.data),
  clear: (confirm) => api.get('/activity/clear', { params: { confirm } }).then(r => r.data),
}

export const customersApi = {
  list: () => api.get('/customers').then(r => r.data),
  get: (id) => api.get(`/customers/${id}`).then(r => r.data),
  search: (q, field) => api.get('/customers/search', { params: { q, field } }).then(r => r.data),
  create: (data) => api.post('/customers', data).then(r => r.data),
  update: (id, data) => api.put(`/customers/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/customers/${id}`).then(r => r.data),
}

export const revisionsApi = {
  getByOrder: (orderId) => api.get(`/revisions/${orderId}`).then(r => r.data),
}

export const quotationsApi = {
  list: () => api.get('/quotations').then(r => r.data),
  get: (id) => api.get(`/quotations/${id}`).then(r => r.data),
  create: (data) => api.post('/quotations', data).then(r => r.data),
  update: (id, data) => api.put(`/quotations/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/quotations/${id}`).then(r => r.data),
}

export const usersApi = {
  list: () => api.get('/users').then(r => r.data),
  get: (id) => api.get(`/users/${id}`).then(r => r.data),
  create: (data) => api.post('/users', data).then(r => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/users/${id}`).then(r => r.data),
}
