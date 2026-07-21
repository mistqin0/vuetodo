import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Todo {
  id: number
  text: string
  done: number
}

export const getTodos = () => api.get<Todo[]>('/todos')
export const addTodo = (text: string) => api.post('/todos', { text })
export const toggleTodo = (id: number) => api.put(`/todos/${id}`)
export const removeTodo = (id: number) => api.delete(`/todos/${id}`)

