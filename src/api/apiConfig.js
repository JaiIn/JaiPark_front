// API URL 및 기타 설정
export const API_URL = 'http://localhost:8080/api';
export const DEFAULT_TIMEOUT = 15000; // 15초

// API 엔드포인트 상수
export const ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
  },
  
  // 사용자
  USER: {
    ME: '/users/me',
    PROFILE: (username) => `/users/${username}`,
    FOLLOW: (username) => `/users/${username}/follow`,
    FOLLOWERS: (username) => `/users/${username}/followers`,
    FOLLOWING: (username) => `/users/${username}/following`,
  },
  
  // 게시글
  POST: {
    BASE: '/posts',
    DETAIL: (id) => `/posts/${id}`,
    SEARCH: '/posts/search',
    BOOKMARKED: '/posts/bookmarked',
    LIKED: '/posts/liked',
    MY: '/posts/my',
    FOLLOWINGS: '/posts/followings',
    CURSOR: '/posts/cursor',
    TIME_CURSOR: '/posts/time-cursor',
    FOLLOWINGS_CURSOR: '/posts/followings/cursor',
  },
  
  // 댓글
  COMMENT: {
    FOR_POST: (postId) => `/posts/${postId}/comments`,
    DETAIL: (commentId) => `/comments/${commentId}`,
    MY: '/comments/my',
  },
};

// 공통 헤더 가져오기
export const getCommonHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};
