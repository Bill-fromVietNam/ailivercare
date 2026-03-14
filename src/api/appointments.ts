import apiService from './index'

export interface Appointment {
  id: number
  user_id: number
  schedule_at: string
  note?: string | null
  status: 'scheduled' | 'done' | 'cancelled'
  created_at: string
}

export interface Paged<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface AppointmentInput {
  schedule_at: string
  note?: string | null
}

export const AppointmentsAPI = {
  async listMy(page = 1, page_size = 20) {
    return await apiService.get<Paged<Appointment>>('/appointments', { params: { page, page_size } })
  },
  
  async create(payload: AppointmentInput) {
    return await apiService.post<Appointment>('/appointments', payload)
  },
  
  async get(id: number) {
    return await apiService.get<Appointment>(`/appointments/${id}`)
  },
  
  async update(id: number, payload: Partial<AppointmentInput>) {
    return await apiService.patch<Appointment>(`/appointments/${id}`, payload)
  },
  
  async cancel(id: number) {
    return await apiService.post<Appointment>(`/appointments/${id}/cancel`)
  },
  
  async complete(id: number) {
    return await apiService.post<Appointment>(`/appointments/${id}/complete`)
  }
} 