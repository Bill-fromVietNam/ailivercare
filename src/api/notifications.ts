import apiService from './index';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string; // 'general', 'appointment', 'result', 'reminder'
  related_id?: string | null;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  page: number;
  size: number;
  unread_count: number;
}

export interface CreateNotificationRequest {
  user_id: string;
  title: string;
  body: string;
  type: string;
  related_id?: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  body?: string;
  is_read?: boolean;
}

class NotificationsApiService {
  private baseEndpoint: string = '/notifications';

  // User endpoints
  async getUserNotifications(page: number = 1, size: number = 10): Promise<NotificationListResponse> {
    return apiService.get<NotificationListResponse>(`${this.baseEndpoint}/user`, {
      params: { page, size }
    });
  }

  async getUnreadCount(): Promise<{ unread_count: number }> {
    return apiService.get<{ unread_count: number }>(`${this.baseEndpoint}/user/unread-count`);
  }

  async markAsRead(id: string): Promise<Notification> {
    return apiService.patch<Notification>(`${this.baseEndpoint}/${id}/read`, {
      is_read: true
    });
  }

  async markAllAsRead(): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/user/mark-all-read`);
  }

  // Admin endpoints
  async getAllNotifications(
    user_id?: string,
    type?: string,
    page: number = 1,
    size: number = 10
  ): Promise<NotificationListResponse> {
    const params: Record<string, any> = { page, size };
    if (user_id) params.user_id = user_id;
    if (type) params.type = type;
    
    return apiService.get<NotificationListResponse>(`${this.baseEndpoint}/admin`, { params });
  }

  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    return apiService.post<Notification>(`${this.baseEndpoint}/admin`, data);
  }

  async updateNotification(id: string, data: UpdateNotificationRequest): Promise<Notification> {
    return apiService.put<Notification>(`${this.baseEndpoint}/admin/${id}`, data);
  }

  async deleteNotification(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`${this.baseEndpoint}/admin/${id}`);
  }

  async sendNotificationToAll(
    title: string,
    body: string,
    type: string = 'general'
  ): Promise<{ message: string; count: number }> {
    return apiService.post<{ message: string; count: number }>(
      `${this.baseEndpoint}/admin/send-to-all`,
      { title, body, type }
    );
  }
}

export const NotificationsAPI = new NotificationsApiService(); 