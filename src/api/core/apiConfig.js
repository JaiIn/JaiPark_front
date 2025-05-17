/**
 * API 설정 및 엔드포인트 정의
 */

// API 서버 URL
export const API_URL = 'http://localhost:8080/api';

// API 요청 타임아웃 (밀리초)
export const DEFAULT_TIMEOUT = 15000;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

/**
 * API 엔드포인트 정의
 * - 함수 형태의 엔드포인트는 파라미터를 받아 경로 생성
 */
export const ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // 사용자 관련
  USER: {
    ME: '/users/me',
    PROFILE: (username) => `/users/${username}`,
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/password',
    FOLLOW: (username) => `/users/${username}/follow`,
    FOLLOWERS: (username) => `/users/${username}/followers`,
    FOLLOWING: (username) => `/users/${username}/following`,
    SEARCH: '/users/search',
  },
  
  // 게시글 관련
  POST: {
    BASE: '/posts',
    DETAIL: (id) => `/posts/${id}`,
    COMMENTS: (id) => `/posts/${id}/comments`,
    LIKE: (id) => `/posts/${id}/like`,
    BOOKMARK: (id) => `/posts/${id}/bookmark`,
    SEARCH: '/posts/search',
    BOOKMARKED: '/posts/bookmarked',
    LIKED: '/posts/liked',
    MY: '/posts/my',
    FOLLOWINGS: '/posts/followings',
    CURSOR: '/posts/cursor',
    TIME_CURSOR: '/posts/time-cursor',
    FOLLOWINGS_CURSOR: '/posts/followings/cursor',
  },
  
  // 댓글 관련
  COMMENT: {
    BASE: '/comments',
    DETAIL: (id) => `/comments/${id}`,
    FOR_POST: (postId) => `/posts/${postId}/comments`,
    LIKE: (id) => `/comments/${id}/like`,
    MY: '/comments/my',
  },
  
  // 알림 관련
  NOTIFICATION: {
    LIST: '/notifications',
    UNREAD: '/notifications/unread',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  
  // 채팅 관련
  CHAT: {
    ROOMS: '/chat/rooms',
    MESSAGES: (roomId) => `/chat/rooms/${roomId}/messages`,
    UNREAD: '/chat/unread',
  },
  
  // 통계 및 기타
  STATS: {
    USER: (username) => `/stats/users/${username}`,
    POST: (id) => `/stats/posts/${id}`,
  },
};

/**
 * API 요청 시 사용할 공통 헤더 생성
 * @param {Object} additionalHeaders - 추가 헤더 (선택적)
 * @returns {Object} - 헤더 객체
 */
export const getHeaders = (additionalHeaders = {}) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...additionalHeaders,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * API URL 생성
 * @param {string} endpoint - API 엔드포인트
 * @returns {string} - 완전한 API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};
