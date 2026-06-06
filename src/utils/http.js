import axios from 'axios'

// Tạo axios instance
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7273/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const data = error.response?.data

    if (error.response?.status === 400 && data) {
      return Promise.resolve(data)
    }

    return Promise.reject(data || error)
  },
)

export default http
