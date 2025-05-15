/**
 * 날짜 포맷팅 유틸리티 함수
 */

/**
 * 상대적 시간 포맷팅 (예: "3일 전", "방금 전")
 * @param {string|Date} date - 포맷팅할 날짜
 * @returns {string} - 포맷팅된 상대적 시간 문자열
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffTime = Math.abs(now - dateObj);
  const diffSeconds = Math.floor(diffTime / 1000);
  
  // 1분 미만
  if (diffSeconds < 60) {
    return '방금 전';
  }
  
  // 1시간 미만
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }
  
  // 1일 미만
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  
  // 1주 미만
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  
  // 1개월 미만
  if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}주 전`;
  }
  
  // 1년 미만
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  }
  
  // 1년 이상
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}년 전`;
};

/**
 * 날짜를 지정된 형식으로 포맷팅
 * @param {string|Date} date - 포맷팅할 날짜
 * @param {string} format - 날짜 형식 ('YYYY-MM-DD', 'YYYY.MM.DD' 등)
 * @returns {string} - 포맷팅된 날짜 문자열
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 문자열 유틸리티 함수
 */

/**
 * 문자열 길이 제한 (말줄임표 추가)
 * @param {string} text - 원본 문자열
 * @param {number} maxLength - 최대 길이
 * @returns {string} - 제한된 문자열
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * 첫 글자만 대문자로 변환
 * @param {string} text - 원본 문자열
 * @returns {string} - 변환된 문자열
 */
export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * URL 검증
 * @param {string} url - 검증할 URL
 * @returns {boolean} - 유효한 URL인지 여부
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 숫자 포맷팅
 */

/**
 * 숫자에 천 단위 쉼표 추가
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} - 포맷팅된 숫자 문자열
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '';
  return num.toLocaleString();
};

/**
 * 큰 숫자를 약식으로 표시 (예: 1.2k, 3.5M)
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} - 포맷팅된 숫자 문자열
 */
export const formatCompactNumber = (num) => {
  if (num === undefined || num === null) return '';
  
  const formatter = Intl.NumberFormat('ko', { notation: 'compact' });
  return formatter.format(num);
};

/**
 * 배열/객체 유틸리티 함수
 */

/**
 * 배열을 지정된 속성으로 그룹화
 * @param {Array} array - 그룹화할 배열
 * @param {string} key - 그룹화 기준 속성
 * @returns {Object} - 그룹화된 객체
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * 중복 제거된 배열 반환
 * @param {Array} array - 처리할 배열
 * @param {string} key - 객체 배열인 경우 비교할 속성
 * @returns {Array} - 중복이 제거된 배열
 */
export const uniqueArray = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * 기타 유틸리티 함수
 */

/**
 * 디바운스 함수 생성
 * @param {Function} func - 디바운스할 함수
 * @param {number} wait - 대기 시간 (ms)
 * @returns {Function} - 디바운스된 함수
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 스로틀 함수 생성
 * @param {Function} func - 스로틀할 함수
 * @param {number} limit - 제한 시간 (ms)
 * @returns {Function} - 스로틀된 함수
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * localStorage 관련 유틸리티
 */
export const storage = {
  /**
   * 데이터 저장
   * @param {string} key - 스토리지 키
   * @param {*} value - 저장할 값
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('localStorage 저장 오류:', e);
    }
  },
  
  /**
   * 데이터 조회
   * @param {string} key - 스토리지 키
   * @param {*} defaultValue - 기본값 (데이터가 없을 경우)
   * @returns {*} - 저장된 값 또는 기본값
   */
  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error('localStorage 조회 오류:', e);
      return defaultValue;
    }
  },
  
  /**
   * 데이터 삭제
   * @param {string} key - 스토리지 키
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('localStorage 삭제 오류:', e);
    }
  },
  
  /**
   * 모든 데이터 삭제
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('localStorage 초기화 오류:', e);
    }
  }
};
