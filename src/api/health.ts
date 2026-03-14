import apiService from './index'

export const HealthAPI = {
  async ready() {
    return await apiService.get<{ status: string }>(`/health/ready`)
  },
  async live() {
    return await apiService.get<{ status: string }>(`/health/live`)
  },
} 