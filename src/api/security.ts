import apiService from './index';

// Two-factor authentication interfaces
export interface TwoFactorSetupResponse {
  secret_key: string;
  qr_code_url: string;
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface LoginActivityResponse {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  device_info?: string;
  success: boolean;
  created_at: string;
}

export interface LoginActivityListResponse {
  items: LoginActivityResponse[];
  total: number;
  page: number;
  size: number;
}

class SecurityApiService {
  private baseEndpoint: string = '/security';

  // Two-factor authentication
  async setupTwoFactor(): Promise<TwoFactorSetupResponse> {
    return apiService.post<TwoFactorSetupResponse>(
      `${this.baseEndpoint}/2fa/setup`
    );
  }

  async verifyAndEnableTwoFactor(data: TwoFactorVerifyRequest): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(
      `${this.baseEndpoint}/2fa/verify`,
      data
    );
  }

  async disableTwoFactor(data: TwoFactorVerifyRequest): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(
      `${this.baseEndpoint}/2fa/disable`,
      data
    );
  }

  async validateTwoFactorLogin(data: TwoFactorVerifyRequest): Promise<{ token: string }> {
    return apiService.post<{ token: string }>(
      `${this.baseEndpoint}/2fa/validate`,
      data
    );
  }

  async isTwoFactorEnabled(): Promise<{ enabled: boolean }> {
    return apiService.get<{ enabled: boolean }>(
      `${this.baseEndpoint}/2fa/status`
    );
  }

  // Login activity
  async getLoginActivity(page: number = 1, size: number = 10): Promise<LoginActivityListResponse> {
    return apiService.get<LoginActivityListResponse>(
      `${this.baseEndpoint}/activity/login`,
      { params: { page, size } }
    );
  }
}

export const SecurityAPI = new SecurityApiService(); 