import apiService from './index';
import { QuestionnaireTemplate } from '../components/QuestionnaireEditor/QuestionnaireEditor';

// Re-export QuestionnaireTemplate for use in other components
export type { QuestionnaireTemplate };

export interface SubmissionResult {
  id: string;
  template_id: string;
  user_id: string;
  answers: Record<string, any>;
  score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  recommendations?: string[];
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireListResponse {
  items: QuestionnaireTemplate[];
  total: number;
  page: number;
  size: number;
}

export interface SubmissionListResponse {
  items: SubmissionResult[];
  total: number;
  page: number;
  size: number;
}

export interface SubmissionRequest {
  questionnaire_id: string;
  answers_json: Record<string, any>;
}

export interface QuestionnaireStatsResponse {
  total_submissions: number;
  completion_rate: number;
  average_score: number;
  score_distribution: {
    low: number;
    medium: number;
    high: number;
  };
}

class QuestionnairesApiService {
  private baseEndpoint: string = '/questionnaires';

  // User endpoints
  async getUserQuestionnaires(page: number = 1, size: number = 10): Promise<QuestionnaireListResponse> {
    return apiService.get<QuestionnaireListResponse>(`${this.baseEndpoint}/user`, { 
      params: { page, size } 
    });
  }

  async getQuestionnaireById(id: string): Promise<QuestionnaireTemplate> {
    return apiService.get<QuestionnaireTemplate>(`${this.baseEndpoint}/${id}`);
  }

  async submitQuestionnaire(data: SubmissionRequest): Promise<SubmissionResult> {
    return apiService.post<SubmissionResult>(`${this.baseEndpoint}/submit`, data);
  }

  async getUserSubmissions(page: number = 1, size: number = 10): Promise<SubmissionListResponse> {
    return apiService.get<SubmissionListResponse>(`${this.baseEndpoint}/user/submissions`, { 
      params: { page, size } 
    });
  }

  async getSubmissionById(id: string): Promise<SubmissionResult> {
    return apiService.get<SubmissionResult>(`${this.baseEndpoint}/submissions/${id}`);
  }

  async saveProgress(questionnaire_id: string, answers_json: Record<string, any>): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/progress`, {
      questionnaire_id,
      answers_json
    });
  }

  async getProgress(questionnaire_id: string): Promise<{ answers_json: Record<string, any> }> {
    return apiService.get<{ answers_json: Record<string, any> }>(`${this.baseEndpoint}/progress/${questionnaire_id}`);
  }

  // Admin endpoints
  async getAllQuestionnaires(page: number = 1, size: number = 10): Promise<QuestionnaireListResponse> {
    return apiService.get<QuestionnaireListResponse>(`${this.baseEndpoint}/admin`, { 
      params: { page, size } 
    });
  }

  async createQuestionnaire(data: QuestionnaireTemplate): Promise<QuestionnaireTemplate> {
    return apiService.post<QuestionnaireTemplate>(`${this.baseEndpoint}/admin`, data);
  }

  async updateQuestionnaire(id: string, data: QuestionnaireTemplate): Promise<QuestionnaireTemplate> {
    return apiService.put<QuestionnaireTemplate>(`${this.baseEndpoint}/admin/${id}`, data);
  }

  async deleteQuestionnaire(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`${this.baseEndpoint}/admin/${id}`);
  }

  async getAllSubmissions(
    questionnaire_id?: string, 
    page: number = 1, 
    size: number = 10
  ): Promise<SubmissionListResponse> {
    const params: Record<string, any> = { page, size };
    if (questionnaire_id) {
      params.questionnaire_id = questionnaire_id;
    }
    return apiService.get<SubmissionListResponse>(`${this.baseEndpoint}/admin/submissions`, { params });
  }

  async getQuestionnaireStats(questionnaire_id: string): Promise<QuestionnaireStatsResponse> {
    return apiService.get<QuestionnaireStatsResponse>(
      `${this.baseEndpoint}/admin/stats/${questionnaire_id}`
    );
  }

  async toggleQuestionnaireStatus(
    id: string, 
    status: 'active' | 'draft' | 'archived'
  ): Promise<QuestionnaireTemplate> {
    return apiService.patch<QuestionnaireTemplate>(
      `${this.baseEndpoint}/admin/${id}/status`,
      undefined,
      { params: { status } }
    );
  }
}

export const QuestionnairesAPI = new QuestionnairesApiService(); 