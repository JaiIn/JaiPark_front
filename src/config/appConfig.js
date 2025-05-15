/**
 * 환경 변수 및 앱 설정 관리
 * 
 * 이 파일은 애플리케이션 전체에서 사용되는 환경 변수와 글로벌 설정을 관리합니다.
 * process.env 환경 변수는 .env 파일을 통해 설정되며, 여기서 가공하여 사용합니다.
 */

// API 기본 URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// 앱 환경
export const ENV = process.env.NODE_ENV || 'development';
export const IS_DEV = ENV === 'development';
export const IS_PROD = ENV === 'production';

// 페이지네이션 기본 설정
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGINATION_BUTTONS = 5;

// 인증 관련 설정
export const AUTH_TOKEN_KEY = 'token';
export const AUTH_REFRESH_TOKEN_KEY = 'refreshToken';
export const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5분 (ms)

// 콘텐츠 제한
export const MAX_TITLE_LENGTH = 100;
export const MAX_CONTENT_LENGTH = 5000;
export const MAX_COMMENT_LENGTH = 500;

// 사용자 프로필 관련
export const DEFAULT_AVATAR_URL = '/assets/default-avatar.png';
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// 타임아웃 설정
export const API_TIMEOUT = 30000; // 30초
export const DEBOUNCE_DELAY = 300; // 300ms
export const THROTTLE_DELAY = 300; // 300ms

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  AUTH_ERROR: '인증이 필요한 작업입니다. 다시 로그인해주세요.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  VALIDATION_ERROR: '입력한 정보를 다시 확인해주세요.',
  DEFAULT: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
};

// 폼 유효성 검사 메시지
export const VALIDATION_MESSAGES = {
  REQUIRED: '필수 입력 항목입니다.',
  EMAIL: '유효한 이메일 주소를 입력해주세요.',
  PASSWORD: '비밀번호는 8자 이상이며 문자, 숫자를 포함해야 합니다.',
  PASSWORD_MATCH: '비밀번호가 일치하지 않습니다.',
  MAX_LENGTH: (max) => `최대 ${max}자까지 입력 가능합니다.`,
  MIN_LENGTH: (min) => `최소 ${min}자 이상 입력해주세요.`,
  USERNAME: '영문, 숫자, 밑줄(_)만 사용 가능합니다.',
  NICKNAME: '닉네임은 2~20자 사이여야 합니다.'
};

// 날짜 형식
export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  DATE_KOREAN: 'YYYY년 MM월 DD일',
  TIME_ONLY: 'HH:mm:ss',
  SHORT_DATE: 'YY.MM.DD',
  SHORT_TIME: 'HH:mm'
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'jaipark_auth_token',
  REFRESH_TOKEN: 'jaipark_refresh_token',
  USER_INFO: 'jaipark_user_info',
  THEME: 'jaipark_theme',
  LANGUAGE: 'jaipark_language',
  LAST_VISITED: 'jaipark_last_visited'
};

// 테마 설정
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// 언어 설정
export const LANGUAGES = {
  KO: 'ko',
  EN: 'en'
};

// 페이지 경로
export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  EDIT_PROFILE: '/mypage/edit',
  POSTS: '/posts',
  POST_DETAIL: (id) => `/posts/${id}`,
  POST_NEW: '/posts/new',
  POST_EDIT: (id) => `/posts/${id}/edit`,
  USER_PROFILE: (username) => `/profile/${username}`
};

// 앱 설정
export const APP_CONFIG = {
  NAME: 'JaiPark',
  VERSION: '1.0.0',
  DESCRIPTION: '소셜 커뮤니티 플랫폼',
  COPYRIGHT: '© 2025 JaiPark. All rights reserved.',
  CONTACT_EMAIL: 'support@jaipark.com'
};

// 성능 모니터링 설정
export const PERFORMANCE_CONFIG = {
  ENABLE_LOGGING: IS_DEV,
  LOG_SLOW_RENDERS: IS_DEV,
  SLOW_RENDER_THRESHOLD: 50 // ms
};

// 로그인 유지 설정
export const AUTH_PERSIST_DURATION = 30 * 24 * 60 * 60 * 1000; // 30일 (ms)

// 파일 업로드 설정
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  MAX_FILES: 5,
  THUMBNAIL_SIZE: {
    WIDTH: 200,
    HEIGHT: 200
  }
};

// 알림 설정
export const NOTIFICATION_CONFIG = {
  AUTO_DISMISS_DURATION: 5000, // 5초
  MAX_NOTIFICATIONS: 5
};
