import axios from 'axios';

/**
 * API 요청에 타임아웃 설정
 */
const api = axios.create({
  timeout: 15000, // 15초 타임아웃
});

/**
 * API 에러를 일관된 형식으로 처리
 * @param {Error} error - Axios 에러 객체
 * @returns {Object} - 표준화된 에러 객체
 */
export const handleApiError = (error) => {
  // 응답이 있는 경우
  if (error.response) {
    const { status, data } = error.response;
    
    // 토큰 만료 처리
    if (status === 401) {
      // 만료된 토큰이면 로그아웃 처리
      localStorage.removeItem('token');
      window.location.href = '/login';
      return {
        status,
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        data: data
      };
    }
    
    // 일반적인 응답 에러
    return {
      status,
      message: data.message || '요청 처리 중 오류가 발생했습니다.',
      data: data
    };
  }
  
  // 요청 전송 실패
  if (error.request) {
    return {
      status: 0,
      message: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.',
      data: null
    };
  }
  
  // 기타 에러
  return {
    status: 0,
    message: error.message || '알 수 없는 오류가 발생했습니다.',
    data: null
  };
};

/**
 * API 요청을 보내는 공통 함수
 * @param {string} method - HTTP 메서드
 * @param {string} url - API 엔드포인트
 * @param {Object} data - 요청 데이터 (선택적)
 * @param {Object} config - Axios 설정 (선택적)
 * @returns {Promise} - API 응답 데이터
 */
export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { ...config.headers };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const requestConfig = {
      ...config,
      method,
      url,
      headers,
      data: method !== 'get' ? data : undefined,
      params: method === 'get' ? data : undefined
    };
    
    const response = await api(requestConfig);
    return response.data;
  } catch (error) {
    const parsedError = handleApiError(error);
    console.error(`API Error (${method.toUpperCase()} ${url}):`, parsedError);
    throw parsedError;
  }
};

// API 메서드별 함수
export const apiGet = (url, params, config) => apiRequest('get', url, params, config);
export const apiPost = (url, data, config) => apiRequest('post', url, data, config);
export const apiPut = (url, data, config) => apiRequest('put', url, data, config);
export const apiDelete = (url, config) => apiRequest('delete', url, null, config);
