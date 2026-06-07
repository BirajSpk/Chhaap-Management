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
  updateStatus: (id, status, confirmText) => api.put(`/orders/${id}/status`, { status, confirm_text: confirmText }).then(r => r.data),
  update: (id, data) => api.put(`/orders/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/orders/${id}`).then(r => r.data),
  getCount: () => api.get('/orders/count').then(r => r.data),
}

export const expensesApi = {
  list: (params) => api.get('/expenses', { params }).then(r => r.data),
  create: (data) => api.post('/expenses', data).then(r => r.data),
  delete: (id) => api.delete(`/expenses/${id}`).then(r => r.data),
}

export const analyticsApi = {
  get: (params) => api.get('/analytics', { params }).then(r => r.data),
}

export const activityApi = {
  list: (limit) => api.get('/activity', { params: { limit } }).then(r => r.data),
}

export default api
