import apiService from './index';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string; // 'diet', 'exercise', 'lifestyle', 'medical'
  priority: number; // 1-5
  content_json: any;
  source: string; // 'questionnaire', 'lab', 'ai'
  source_id?: string;
  is_archived: boolean;
  created_at: string;
  updated_at?: string;
}

export interface RecommendationListResponse {
  items: Recommendation[];
  total: number;
  page: number;
  size: number;
}

export interface CreateRecommendationRequest {
  title: string;
  description: string;
  category: string;
  priority: number;
  content_json: any;
  source: string;
  source_id?: string;
}

export interface UpdateRecommendationRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: number;
  content_json?: any;
  is_archived?: boolean;
}

class RecommendationsApiService {
  private baseEndpoint: string = '/recommendations';

  // User endpoints
  async getUserRecommendations(
    category?: string,
    archived?: boolean,
    page: number = 1,
    size: number = 10
  ): Promise<RecommendationListResponse> {
    const params: Record<string, any> = { page, size };
    if (category) params.category = category;
    if (archived !== undefined) params.archived = archived;
    
    return apiService.get<RecommendationListResponse>(`${this.baseEndpoint}/user`, { params });
  }

  async getRecommendationById(id: string): Promise<Recommendation> {
    return apiService.get<Recommendation>(`${this.baseEndpoint}/${id}`);
  }

  async archiveRecommendation(id: string): Promise<Recommendation> {
    return apiService.patch<Recommendation>(`${this.baseEndpoint}/${id}/archive`, {
      is_archived: true
    });
  }

  async restoreRecommendation(id: string): Promise<Recommendation> {
    return apiService.patch<Recommendation>(`${this.baseEndpoint}/${id}/archive`, {
      is_archived: false
    });
  }

  // Admin endpoints
  async getAllRecommendations(
    userId?: string,
    category?: string,
    source?: string,
    page: number = 1,
    size: number = 10
  ): Promise<RecommendationListResponse> {
    const params: Record<string, any> = { page, size };
    if (userId) params.user_id = userId;
    if (category) params.category = category;
    if (source) params.source = source;
    
    return apiService.get<RecommendationListResponse>(`${this.baseEndpoint}/admin`, { params });
  }

  async createRecommendation(userId: string, data: CreateRecommendationRequest): Promise<Recommendation> {
    return apiService.post<Recommendation>(`${this.baseEndpoint}/admin/${userId}`, data);
  }

  async updateRecommendation(id: string, data: UpdateRecommendationRequest): Promise<Recommendation> {
    return apiService.put<Recommendation>(`${this.baseEndpoint}/admin/${id}`, data);
  }

  async deleteRecommendation(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`${this.baseEndpoint}/admin/${id}`);
  }

  async generateAIRecommendation(
    userId: string, 
    sourceType: string, 
    sourceId: string
  ): Promise<Recommendation> {
    return apiService.post<Recommendation>(`${this.baseEndpoint}/admin/generate`, {
      user_id: userId,
      source_type: sourceType,
      source_id: sourceId
    });
  }
}

export const RecommendationsAPI = new RecommendationsApiService(); 