import apiService from './index'

export interface Lab {
  id: number
  user_id: number
  ast: number | null
  alt: number | null
  note?: string | null
  created_at: string
}

export interface Paged<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface LabInput {
  ast?: number | null
  alt?: number | null
}

export const LabsAPI = {
  async listMy(page = 1, page_size = 20) {
    return await apiService.get<Paged<Lab>>('/labs', { params: { page, page_size } })
  },
  async create(payload: LabInput) {
    return await apiService.post<Lab>('/labs', payload)
  },
  async get(id: number) {
    return await apiService.get<Lab>(`/labs/${id}`)
  },
  async update(id: number, payload: LabInput) {
    return await apiService.patch<Lab>(`/labs/${id}`, payload)
  },
  async remove(id: number) {
    return await apiService.delete<{ message: string }>(`/labs/${id}`)
  },
} 