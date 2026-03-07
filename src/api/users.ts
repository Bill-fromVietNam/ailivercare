import apiService from './index';
import { UserResponse } from './auth';

export interface UserListResponse {
  items: UserResponse[];
  total: number;
  page: number;
  size: number;
}

export interface UserUpdateRequest {
  full_name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

export interface UserStatsResponse {
  total_users: number;
  active_users: number;
  admin_users: number;
  new_users_last_30_days: number;
  verified_users: number;
}

class UsersApiService {
  private baseEndpoint: string = '/admin/users';

  async getAllUsers(
    page: number = 1,
    size: number = 10,
    role?: string,
    is_active?: boolean,
    search?: string
  ): Promise<UserListResponse> {
    const params: Record<string, any> = { page, size };
    if (role) params.role = role;
    if (is_active !== undefined) params.is_active = is_active;
    if (search) params.search = search;
    
    return apiService.get<UserListResponse>(this.baseEndpoint, { params });
  }

  async getUserById(id: number): Promise<UserResponse> {
    return apiService.get<UserResponse>(`${this.baseEndpoint}/${id}`);
  }

  async updateUser(id: number, data: UserUpdateRequest): Promise<UserResponse> {
    return apiService.put<UserResponse>(`${this.baseEndpoint}/${id}`, data);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`${this.baseEndpoint}/${id}`);
  }

  async activateUser(id: number): Promise<UserResponse> {
    return apiService.patch<UserResponse>(`${this.baseEndpoint}/${id}/activate`, {
      is_active: true
    });
  }

  async deactivateUser(id: number): Promise<UserResponse> {
    return apiService.patch<UserResponse>(`${this.baseEndpoint}/${id}/deactivate`, {
      is_active: false
    });
  }

  async changeUserRole(id: number, role: string): Promise<UserResponse> {
    return apiService.patch<UserResponse>(`${this.baseEndpoint}/${id}/role`, { role });
  }

  async getUserStats(): Promise<UserStatsResponse> {
    return apiService.get<UserStatsResponse>(`${this.baseEndpoint}/stats`);
  }
}

export const UsersAPI = new UsersApiService(); 