/**
 * 표준화된 API 클라이언트
 * - Axios 기반의 HTTP 요청 처리
 * - 에러 처리 및 응답 변환 표준화
 * - 인증 토큰 자동 처리
 */

import axios from 'axios';
import { API_URL, DEFAULT_TIMEOUT, STORAGE_KEYS, getHeaders } from './apiConfig';

/**
 * Axios 인스턴스 생성
 */
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * 요청 인터셉터 설정
 * - 모든 요청에 인증 토큰 자동 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 설정
 * - 401 오류 발생 시 로그아웃 처리
 * - 표준화된 응답 형식 변환
 */
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답 처리
    return response.data;
  },
  (error) => {
    // 오류 응답 처리
    if (error.response) {
      // 서버에서 응답이 왔지만 오류 상태 코드인 경우
      const { status, data } = error.response;
      
      // 인증 오류 (만료된 토큰 등) 처리
      if (status === 401) {
        // 로그아웃 처리
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // 로그인 페이지로 리다이렉트 (새로고침 없이)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // 표준화된 오류 객체 반환
      return Promise.reject({
        status,
        message: data?.message || '요청을 처리하는 중에 오류가 발생했습니다.',
        data: data
      });
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      return Promise.reject({
        status: 0,
        message: '서버에 연결할 수 없습니다. 네트워크 연결을 확인하세요.',
        data: null
      });
    } else {
      // 요청 설정 단계에서 오류가 발생한 경우
      return Promise.reject({
        status: 0,
        message: error.message || '알 수 없는 오류가 발생했습니다.',
        data: null
      });
    }
  }
);

/**
 * API 요청 메서드
 */
const api = {
  /**
   * GET 요청
   * @param {string} url - API 엔드포인트
   * @param {Object} params - URL 쿼리 파라미터
   * @param {Object} config - Axios 설정
   * @returns {Promise} - API 응답
   */
  get: (url, params = {}, config = {}) => {
    return apiClient.get(url, { ...config, params });
  },
  
  /**
   * POST 요청
   * @param {string} url - API 엔드포인트
   * @param {Object} data - 요청 바디 데이터
   * @param {Object} config - Axios 설정
   * @returns {Promise} - API 응답
   */
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },
  
  /**
   * PUT 요청
   * @param {string} url - API 엔드포인트
   * @param {Object} data - 요청 바디 데이터
   * @param {Object} config - Axios 설정
   * @returns {Promise} - API 응답
   */
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },
  
  /**
   * DELETE 요청
   * @param {string} url - API 엔드포인트
   * @param {Object} config - Axios 설정
   * @returns {Promise} - API 응답
   */
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },
  
  /**
   * PATCH 요청
   * @param {string} url - API 엔드포인트
   * @param {Object} data - 요청 바디 데이터
   * @param {Object} config - Axios 설정
   * @returns {Promise} - API 응답
   */
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },
  
  /**
   * 파일 업로드용 POST 요청
   * @param {string} url - API 엔드포인트
   * @param {FormData} formData - 폼 데이터 (파일 포함)
   * @param {Object} config - Axios 설정
   * @returns {Promise} - API 응답
   */
  upload: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  /**
   * 여러 요청 병렬 처리
   * @param {Array} requests - API 요청 프로미스 배열
   * @returns {Promise} - 모든 요청의 응답 배열
   */
  all: (requests) => {
    return Promise.all(requests);
  }
};

export default api;
