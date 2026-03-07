import apiService from './index'

export interface Assessment {
  id: number
  user_id: number
  risk_level: 'low' | 'medium' | 'high'
  input_snapshot?: string | null
  recommendation?: string | null
  created_at: string
}

export interface Paged<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface RiskAssessmentInput {
  lifestyle?: string | null
  history?: string | null
  symptoms?: string | null
  labs?: { ast?: number | null; alt?: number | null } | null
}

export const AssessmentsAPI = {
  async evaluate(payload: RiskAssessmentInput) {
    return await apiService.post<Assessment>('/assessments/evaluate', payload)
  },
  async listMy(page = 1, page_size = 20) {
    return await apiService.get<Paged<Assessment>>('/assessments', { params: { page, page_size } })
  },
  async getOne(id: number) {
    return await apiService.get<Assessment>(`/assessments/${id}`)
  },
} 