import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthAPI, LoginRequest, RegisterRequest, UserProfile } from '../../api/auth';

// State type
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  passwordResetSent: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: AuthAPI.isLoggedIn(),
  loading: false,
  error: null,
  registrationSuccess: false,
  passwordResetSent: false,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const tokens = await AuthAPI.login(credentials);
      AuthAPI.saveTokens(tokens);
      const user = await AuthAPI.me();
      return { user, tokens };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.detail || 'Đăng nhập thất bại');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.detail || 'Đăng ký thất bại');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthAPI.logout();
      AuthAPI.clearTokens();
      return true;
    } catch (error: any) {
      // Vẫn xóa token kể cả khi API logout thất bại
      AuthAPI.clearTokens();
      return rejectWithValue(error?.response?.data?.detail || 'Đăng xuất thất bại');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthAPI.me();
      return user;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.detail || 'Không thể lấy thông tin người dùng');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.forgotPassword({ email });
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.detail || 'Không thể gửi yêu cầu đặt lại mật khẩu');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    clearPasswordResetSent: (state) => {
      state.passwordResetSent = false;
    },
    setTheme: (_, action: PayloadAction<'light' | 'dark'>) => {
      // Lưu theme vào localStorage
      localStorage.setItem('theme', action.payload);
      
      // Cập nhật class trên html element
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
      
      // Cập nhật meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', action.payload === 'dark' ? '#121212' : '#ffffff');
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.registrationSuccess = false;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      state.registrationSuccess = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.registrationSuccess = false;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    });

    // Fetch current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.passwordResetSent = false;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      state.passwordResetSent = true;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.passwordResetSent = false;
    });
  },
});

// Export actions and reducer
export const { clearError, clearRegistrationSuccess, clearPasswordResetSent, setTheme } = authSlice.actions;
export default authSlice.reducer; 