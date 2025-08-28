import axios from 'axios';

const API_BASE_URL = 'http://localhost:4555';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  signup: (credentials) => {
    const signupData = {
      ...credentials,
      type: credentials.type || 'user'
    };
    return api.post('/signup', signupData);
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAdmin: () => api.get('/isadmin')
};

export const conferenceAPI = {
  getAll: () => api.get('/conferences'),
  getById: (id) => api.get(`/conference/${id}`),
  create: (conference) => {
    return api.post('/conference', conference);
  },
  update: (id, conference) => {
    return api.patch(`/conference/${id}`, conference);
  },
  delete: (id) => {
    return api.delete(`/conference/${id}`);
  }
};

export const userAPI = {
  getAll: () => api.get('/users'),
  changePassword: (oldPassword, password) => api.patch('/userpassword', { oldPassword, password }),
  changePermissionType: (id, newType) => api.patch(`/usertype/${id}`, { newType }),
  deleteUser: (id) => api.delete(`/user/${id}`),
  promoteToAdmin: (id) => api.patch(`/usertype/${id}`, { newType: 'admin' })
};

export default api;