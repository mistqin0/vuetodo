import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// 从 localStorage 取 token
function getToken() {
  return localStorage.getItem('token')
}

// 设置 token 到请求头
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (username: string, password: string) =>
  api.post('/register', { username, password })

export const login = (username: string, password: string) =>
  api.post<{ token: string; username: string }>('/login', { username, password })

export const getMe = () => api.get<{ username: string }>('/me')

export const logout = () => api.post('/logout')

