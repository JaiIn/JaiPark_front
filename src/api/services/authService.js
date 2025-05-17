/**
 * API 서비스 모듈 - 인증 관련 서비스
 */

import api from '../core/apiClient';
import { ENDPOINTS } from '../core/apiConfig';

/**
 * 인증 관련 API 서비스
 */
const authService = {
  /**
   * 로그인
   * @param {Object} credentials - 로그인 정보 { username, password }
   * @returns {Promise} - 로그인 결과 (토큰 등)
   */
  login: async (credentials) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      
      // 로그인 성공 시 토큰 저장
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // 사용자 정보가 있으면 저장
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },
  
  /**
   * 회원가입
   * @param {Object} userData - 회원가입 정보
   * @returns {Promise} - 회원가입 결과
   */
  signup: async (userData) => {
    try {
      return await api.post(ENDPOINTS.AUTH.SIGNUP, userData);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  },
  
  /**
   * 로그아웃
   * @returns {Promise} - 로그아웃 결과
   */
  logout: async () => {
    try {
      // 서버에 로그아웃 요청
      await api.post(ENDPOINTS.AUTH.LOGOUT);
      
      // 로컬 스토리지에서 인증 정보 제거
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('로그아웃 오류:', error);
      
      // 서버 오류와 상관없이 로컬 정보는 삭제
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      throw error;
    }
  },
  
  /**
   * 토큰 갱신
   * @returns {Promise} - 갱신된 토큰
   */
  refreshToken: async () => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REFRESH);
      
      // 새 토큰 저장
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw error;
    }
  },
  
  /**
   * 이메일 인증 요청
   * @param {string} email - 인증할 이메일
   * @returns {Promise} - 요청 결과
   */
  sendVerificationEmail: async (email) => {
    return api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { email });
  },
  
  /**
   * 비밀번호 재설정 요청
   * @param {string} email - 비밀번호를 재설정할 계정 이메일
   * @returns {Promise} - 요청 결과
   */
  resetPassword: async (email) => {
    return api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { email });
  },
  
  /**
   * 현재 로그인 상태 확인
   * @returns {boolean} - 로그인 상태
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * 현재 로그인한 사용자 정보 가져오기
   * @returns {Object|null} - 사용자 정보 또는 null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
