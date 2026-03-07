import axios, { type AxiosResponse, type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const rawApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
rawApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

// Response interceptor
rawApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Data-returning helpers compatible với utils/api.ts
const apiService = {
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await rawApi.get<T>(endpoint, config)
    return res.data
  },
  async post<T = any, D = any>(endpoint: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await rawApi.post<T>(endpoint, data, config)
    return res.data
  },
  async put<T = any, D = any>(endpoint: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await rawApi.put<T>(endpoint, data, config)
    return res.data
  },
  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await rawApi.delete<T>(endpoint, config)
    return res.data
  },
  async patch<T = any, D = any>(endpoint: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const res = await rawApi.patch<T>(endpoint, data, config)
    return res.data
  },
}

export default apiService
export { rawApi }