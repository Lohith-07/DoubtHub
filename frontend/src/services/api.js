import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cdd_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Normalize error messages
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ── Auth ────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
}

// ── Doubts ──────────────────────────────────
export const doubtAPI = {
  create: (data) => api.post("/api/doubts", data),
  getAll: (params) => api.get("/api/doubts", { params }),
  getSingle: (id) => api.get(`/api/doubts/${id}`),
  answer: (id, data) => api.put(`/api/doubts/${id}`, data),
  assign: (id, facultyIds) => api.put(`/api/doubts/${id}/assign`, { facultyIds }),
  toggleUpvote: (id) => api.put(`/api/doubts/${id}/upvote`),
  getTrending: () => api.get("/api/doubts/trending"),
  addReply: (id, data) => api.post(`/api/doubts/${id}/reply`, data),
  deleteReply: (id, replyId) => api.delete(`/api/doubts/${id}/reply/${replyId}`),
  update: (id, data) => api.put(`/api/doubts/${id}/edit`, data),
  delete: (id) => api.delete(`/api/doubts/${id}`),
};

export const notesAPI = {
  upload: (formData) =>
    api.post("/api/notes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: (params) => api.get("/api/notes", { params }),
  delete: (id) => api.delete(`/api/notes/${id}`),
};

export const announcementAPI = {
  create: (data) => api.post("/api/announcements", data),
  getAll: (params) => api.get("/api/announcements", { params }),
  delete: (id) => api.delete(`/api/announcements/${id}`),
};

// ── Admin ──────────────────────────────────
export const adminAPI = {
  getPending: () => api.get("/api/admin/pending-faculty"),
  approve: (id) => api.put(`/api/admin/approve/${id}`),
  reject: (id) => api.delete(`/api/admin/reject/${id}`),
  getStats: () => api.get("/api/admin/stats"),
  getAllUsers: (params) => api.get("/api/admin/all-users", { params }),
  deleteUser: (id) => api.delete(`/api/admin/user/${id}`),
}

export const userAPI = {
  getFacultyBySubject: (subject) =>
    api.get(`/api/users/faculty-by-subject?subject=${encodeURIComponent(subject)}`)
}

export const notificationAPI = {
  getAll: () => api.get("/api/notifications"),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.put("/api/notifications/read-all"),
}

export const searchAPI = {
  global: (q) => api.get(`/api/search?q=${encodeURIComponent(q)}`),
};

export const statsAPI = {
  getDashboard: () => api.get("/api/stats"),
};

export default api
