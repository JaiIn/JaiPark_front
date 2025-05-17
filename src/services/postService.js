import { postApi } from './api/postApi';
import { homeService } from './homeService';
import { API_URL, ENDPOINTS } from '../api/apiConfig';
import axios from 'axios';

// API 유틸리티 함수
// 기본 GET 요청
const apiGet = async (url, params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data || {};
  } catch (error) {
    console.error(`GET 요청 오류 (${url}):`, error);
    throw error;
  }
};

// 기본 POST 요청
const apiPost = async (url, data = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data || {};
  } catch (error) {
    console.error(`POST 요청 오류 (${url}):`, error);
    throw error;
  }
};

// 기본 PUT 요청
const apiPut = async (url, data = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data || {};
  } catch (error) {
    console.error(`PUT 요청 오류 (${url}):`, error);
    throw error;
  }
};

// 기본 DELETE 요청
const apiDelete = async (url) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data || {};
  } catch (error) {
    console.error(`DELETE 요청 오류 (${url}):`, error);
    throw error;
  }
};

/**
 * 게시글 관련 API 서비스
 */
export const postService = {
  /**
   * 게시글 목록 조회 (오프셋 페이지네이션)
   * @param {number} page - 페이지 번호
   * @param {number} size - 페이지 크기
   * @returns {Promise<Array>} - 게시글 목록
   */
  getPosts: (page = 0, size = 10) => {
    return postApi.getPosts(page, size);
  },
  
  /**
   * 게시글 목록 커서 기반 조회
   * @param {string|null} lastPostId - 마지막 게시글 ID
   * @param {number} limit - 조회할 개수
   * @returns {Promise<Object>} - 게시글 목록과 다음 커서
   */
  getPostsWithCursor: (lastPostId = null, limit = 20) => {
    const params = { limit };
    if (lastPostId) params.lastPostId = lastPostId;
    
    return apiGet(`${API_URL}${ENDPOINTS.POST.CURSOR}`, params);
  },
  
  /**
   * 시간 기준 커서 기반 조회
   * @param {string|null} createdAt - 마지막 게시글 생성 시간
   * @param {string|null} id - 마지막 게시글 ID
   * @param {number} limit - 조회할 개수
   * @returns {Promise<Object>} - 게시글 목록과 다음 커서
   */
  getPostsWithTimeCursor: (createdAt = null, id = null, limit = 20) => {
    const params = { limit };
    if (createdAt) params.createdAt = createdAt;
    if (id) params.id = id;
    
    return apiGet(`${API_URL}${ENDPOINTS.POST.TIME_CURSOR}`, params);
  },
  
  /**
   * 게시글 상세 조회
   * @param {string} id - 게시글 ID
   * @returns {Promise<Object>} - 게시글 상세 정보
   */
  getPost: (id) => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}`);
  },
  
  /**
   * 게시글 작성
   * @param {Object} data - 게시글 데이터 (title, content)
   * @returns {Promise<Object>} - 생성된 게시글 정보
   */
  createPost: (data) => {
    console.log('게시글 작성 요청:', data);
    const token = localStorage.getItem('token');
    
    return axios.post(`${API_URL}${ENDPOINTS.POST.BASE}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('게시글 작성 성공:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('게시글 작성 실패:', error.response || error);
      throw error;
    });
  },
  
  /**
   * 게시글 수정
   * @param {string} id - 게시글 ID
   * @param {Object} data - 수정할 게시글 데이터 (title, content)
   * @returns {Promise<Object>} - 수정된 게시글 정보
   */
  updatePost: (id, data) => {
    console.log('게시글 수정 요청:', { id, data });
    const token = localStorage.getItem('token');
    
    return axios.put(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('게시글 수정 성공:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('게시글 수정 실패:', error.response || error);
      throw error;
    });
  },
  
  /**
   * 게시글 삭제
   * @param {string} id - 게시글 ID
   * @returns {Promise<Object>} - 삭제 결과
   */
  deletePost: (id) => {
    return apiDelete(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}`);
  },
  
  /**
   * 배치로 여러 게시글 상태 조회
   * @param {Array<string>} postIds - 게시글 ID 배열
   * @returns {Promise<Object>} - 게시글 상태 정보
   */
  getBatchPostsData: (postIds) => {
    return apiPost(`${API_URL}${ENDPOINTS.POST.BASE}/batch`, { postIds });
  },
  
  /**
   * 게시글 좋아요 상태 조회
   * @param {string} id - 게시글 ID
   * @returns {Promise<Object>} - 좋아요 상태
   */
  getLikeStatus: (id) => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}/like`);
  },
  
  /**
   * 게시글 좋아요 토글
   * @param {string} id - 게시글 ID
   * @param {string} token - 인증 토큰 (선택적)
   * @returns {Promise<Object>} - 변경된 좋아요 상태
   */
  toggleLike: async (id, providedToken = null) => {
    try {
      // 토큰 확인
      const token = providedToken || localStorage.getItem('token');
      // 데이터 로깅
      console.log('postService.toggleLike - 요청:', { id, token: token ? '있음' : '없음' });
      
      const response = await axios.post(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}/like`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const responseData = response.data || {};
      console.log('postService.toggleLike - 응답:', responseData);
      return responseData;
    } catch (error) {
      console.error('postService.toggleLike - 오류:', error);
      // 오류 발생 시 기본 값 반환
      return { liked: false, count: 0 };
    }
  },
  
  /**
   * 게시글 북마크 상태 조회
   * @param {string} id - 게시글 ID
   * @returns {Promise<Object>} - 북마크 상태
   */
  getBookmarkStatus: (id) => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}/bookmark`);
  },
  
  /**
   * 게시글 북마크 토글
   * @param {string} id - 게시글 ID
   * @param {string} token - 인증 토큰 (선택적)
   * @returns {Promise<Object>} - 변경된 북마크 상태
   */
  toggleBookmark: async (id, providedToken = null) => {
    try {
      // 토큰 확인
      const token = providedToken || localStorage.getItem('token');
      // 데이터 로깅
      console.log('postService.toggleBookmark - 요청:', { id, token: token ? '있음' : '없음' });
      
      const response = await axios.post(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}/bookmark`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const responseData = response.data || {};
      console.log('postService.toggleBookmark - 응답:', responseData);
      return responseData;
    } catch (error) {
      console.error('postService.toggleBookmark - 오류:', error);
      // 오류 발생 시 기본 값 반환
      return { bookmarked: false, count: 0 };
    }
  },
  
  /**
   * 내 게시글 조회
   * @returns {Promise<Array>} - 내 게시글 목록
   */
  getMyPosts: () => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.MY}`);
  },
  
  /**
   * 특정 사용자의 게시글 조회
   * @param {string} username - 사용자 이름
   * @returns {Promise<Array>} - 사용자 게시글 목록
   */
  getPostsByUsername: (username) => {
    return apiGet(`${API_URL}${ENDPOINTS.USER.PROFILE(username)}/posts`);
  },
  
  /**
   * 좋아요한 게시글 조회
   * @returns {Promise<Array>} - 좋아요한 게시글 목록
   */
  getLikedPosts: () => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.LIKED}`);
  },
  
  /**
   * 북마크한 게시글 조회
   * @returns {Promise<Array>} - 북마크한 게시글 목록
   */
  getBookmarkedPosts: () => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.BOOKMARKED}`);
  },
  
  /**
   * 게시글 검색
   * @param {string} keyword - 검색어
   * @param {number} page - 페이지 번호
   * @param {number} size - 페이지 크기
   * @returns {Promise<Array>} - 검색 결과 게시글 목록
   */
  searchPosts: (keyword, page = 0, size = 10) => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.SEARCH}`, { keyword, page, size });
  },
  
  /**
   * 팔로우한 사용자들의 게시글 조회
   * @returns {Promise<Array>} - 팔로우한 사용자들의 게시글 목록
   */
  getFollowingsPosts: () => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.FOLLOWINGS}`);
  },
  
  /**
   * 팔로우한 사용자들의 게시글 커서 기반 조회
   * @param {string|null} createdAt - 마지막 게시글 생성 시간
   * @param {string|null} id - 마지막 게시글 ID
   * @param {number} limit - 조회할 개수
   * @returns {Promise<Object>} - 게시글 목록과 다음 커서
   */
  getFollowingsPostsWithCursor: (createdAt = null, id = null, limit = 20) => {
    const params = { limit };
    if (createdAt) params.createdAt = createdAt;
    if (id) params.id = id;
    
    return apiGet(`${API_URL}${ENDPOINTS.POST.FOLLOWINGS_CURSOR}`, params);
  },
  
  /**
   * 홈 화면에 필요한 모든 데이터 한 번에 가져오기
   * @returns {Promise<Object>} - 최신 게시글, 팔로잉 게시글, 알림 등 홈 데이터
   */
  getHomePageData: async () => {
    try {
      console.log('홈페이지 데이터 가져오기 시작');
      
      // Promise.all을 사용하여 병렬로 여러 API 호출
      const [latestPosts, followingPosts, likedPosts, bookmarkedPosts] = await Promise.all([
        apiGet(`${API_URL}${ENDPOINTS.POST.BASE}`, { page: 0, size: 5 }).catch(() => []),
        apiGet(`${API_URL}${ENDPOINTS.POST.FOLLOWINGS}`).catch(() => []),
        apiGet(`${API_URL}${ENDPOINTS.POST.LIKED}`).catch(() => []),
        apiGet(`${API_URL}${ENDPOINTS.POST.BOOKMARKED}`).catch(() => [])
      ]);
      
      console.log('홈페이지 데이터 가져오기 완료', {
        최신게시글: latestPosts.length,
        팔로잉게시글: followingPosts.length,
        좋아요: likedPosts.length,
        북마크: bookmarkedPosts.length
      });
      
      return { 
        latestPosts: latestPosts || [], 
        followingPosts: followingPosts || [],
        likedPosts: likedPosts || [],
        bookmarkedPosts: bookmarkedPosts || []
      };
    } catch (error) {
      console.error('홈페이지 데이터 가져오기 오류:', error);
      return { 
        latestPosts: [], 
        followingPosts: [],
        likedPosts: [],
        bookmarkedPosts: []
      };
    }
  },
  
  /**
   * 특정 사용자의 대시보드 데이터 조회
   * @param {string} username - 사용자 이름
   * @returns {Promise<Object>} - 사용자의 게시글, 댓글, 좋아요, 북마크 데이터
   */
  getUserDashboardData: async (username) => {
    try {
      // Promise.all을 사용하여 병렬로 여러 API 호출
      const [userPosts, userComments, userLikes, userBookmarks] = await Promise.all([
        apiGet(`${API_URL}${ENDPOINTS.USER.PROFILE(username)}/posts`),
        apiGet(`${API_URL}${ENDPOINTS.USER.PROFILE(username)}/comments`),
        apiGet(`${API_URL}${ENDPOINTS.USER.PROFILE(username)}/likes`),
        apiGet(`${API_URL}${ENDPOINTS.USER.PROFILE(username)}/bookmarks`)
      ]);
      
      // 결과를 하나의 객체로 병합
      return {
        posts: userPosts || [],
        comments: userComments || [],
        likes: userLikes || [],
        bookmarks: userBookmarks || []
      };
    } catch (error) {
      console.error(`Error fetching dashboard data for ${username}:`, error);
      // 에러가 발생해도 기본 데이터 반환
      return {
        posts: [],
        comments: [],
        likes: [],
        bookmarks: []
      };
    }
  }
};
