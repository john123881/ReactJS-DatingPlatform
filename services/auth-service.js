import { apiClient } from './api-client';

export const AuthService = {
  /**
   * 檢查授權狀態
   * @param {string|number} sid
   */
  checkAuth: (sid) => apiClient(`/login-check?sid=${sid}`),

  /**
   * 登入
   * @param {object} credentials - { email, password }
   */
  login: (credentials) => apiClient.post('/login', credentials),

  /**
   * 註冊前發送 OTP
   * @param {string} email
   */
  sendRegisterOtp: (email) => apiClient.post('/register-send-otp', { email }),

  /**
   * 註冊
   * @param {object} userData - { username, email, validCode, password }
   */
  register: (userData) => apiClient.post('/register', userData),

  /**
   * 忘記密碼發送 OTP
   * @param {string} email
   */
  sendForgetPwdOtp: (email) =>
    apiClient.post('/forget-password-send-otp', { email }),

  /**
   * 忘記密碼修改
   * @param {object} data - { validCode, email, password, confirmPassword }
   */
  resetPassword: (data) => apiClient.put('/forget-password-edit', data),

  /**
   * Google 登入
   * @param {object} data - Google 登入回傳的資料
   */
  googleLogin: (data) => apiClient.post('/google-login', data),

  /**
   * 登出
   */
  logout: () => apiClient.post('/logout'),
};
