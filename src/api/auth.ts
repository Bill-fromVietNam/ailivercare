import apiService from './index';

// Định nghĩa kiểu dữ liệu
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_verified: boolean;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

// Auth API Service
class AuthApiService {
  private baseEndpoint: string = '/auth';

  // Đăng nhập
  async login(data: LoginRequest): Promise<TokenResponse> {
    // Gửi dữ liệu dưới dạng JSON theo yêu cầu của backend
    return apiService.post<TokenResponse>(`${this.baseEndpoint}/login`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Đăng ký
  async register(data: RegisterRequest): Promise<{ message: string }> {
    // Gửi dữ liệu dưới dạng query parameters theo yêu cầu của backend
    // Dựa trên route @router.post("/register") trong backend
    // email: str, password: str, full_name: str | None = None
    return apiService.post<{ message: string }>(
      `${this.baseEndpoint}/register`,
      null,
      { params: data }
    );
  }

  // Xác minh email
  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    // Sử dụng GET với query parameters
    return apiService.get<{ message: string }>(`${this.baseEndpoint}/verify-email`, {
      params: data
    });
  }

  // Gửi lại email xác minh
  async resendVerification(email: string): Promise<{ message: string }> {
    // Sử dụng query parameters
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/resend-verification`, null, {
      params: { email }
    });
  }

  // Lấy thông tin người dùng hiện tại
  async me(): Promise<UserProfile> {
    return apiService.get<UserProfile>(`${this.baseEndpoint}/me`);
  }

  // Refresh token - không cần thiết vì backend không sử dụng refresh token
  async refresh(): Promise<TokenResponse> {
    // Phương thức này sẽ không được gọi vì backend không hỗ trợ refresh token
    throw new Error("Method not implemented");
  }

  // Đăng xuất
  async logout(): Promise<{ message: string }> {
    try {
      // Gọi API logout backend
      const response = await apiService.post<{ message: string }>(`${this.baseEndpoint}/logout`);
      // Xóa token khỏi localStorage
      this.clearTokens();
      return response;
    } catch (error) {
      // Vẫn xóa token kể cả khi API logout thất bại
      this.clearTokens();
      return { message: "Đăng xuất thành công" };
    }
  }

  // Thay đổi mật khẩu
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    // Sử dụng query parameters
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/change-password`, null, {
      params: data
    });
  }

  // Quên mật khẩu
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    // Sử dụng query parameters
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/forgot-password`, null, {
      params: data
    });
  }

  // Đặt lại mật khẩu
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    // Sử dụng query parameters
    return apiService.post<{ message: string }>(`${this.baseEndpoint}/reset-password`, null, {
      params: data
    });
  }

  // Lưu token
  saveTokens(tokens: TokenResponse): void {
    localStorage.setItem('accessToken', tokens.access_token);
  }

  // Xóa token
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  // Kiểm tra đăng nhập
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const AuthAPI = new AuthApiService(); 