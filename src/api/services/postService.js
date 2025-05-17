/**
 * API 서비스 모듈 - 게시글 관련 서비스
 */

import api from '../core/apiClient';
import { ENDPOINTS } from '../core/apiConfig';

/**
 * 게시글 관련 API 서비스
 */
const postService = {
  /**
   * 게시글 목록 조회
   * @param {number} page - 페이지 번호 (0부터 시작)
   * @param {number} size - 페이지 크기
   * @returns {Promise} - 게시글 목록
   */
  getPosts: async (page = 0, size = 10) => {
    return api.get(ENDPOINTS.POST.BASE, { page, size });
  },
  
  /**
   * 단일 게시글 조회
   * @param {string} id - 게시글 ID
   * @returns {Promise} - 게시글 상세 정보
   */
  getPost: async (id) => {
    return api.get(ENDPOINTS.POST.DETAIL(id));
  },
  
  /**
   * 게시글 작성
   * @param {Object} postData - 게시글 데이터
   * @returns {Promise} - 생성된 게시글
   */
  createPost: async (postData) => {
    return api.post(ENDPOINTS.POST.BASE, postData);
  },
  
  /**
   * 게시글 수정
   * @param {string} id - 게시글 ID
   * @param {Object} postData - 수정할 게시글 데이터
   * @returns {Promise} - 수정된 게시글
   */
  updatePost: async (id, postData) => {
    return api.put(ENDPOINTS.POST.DETAIL(id), postData);
  },
  
  /**
   * 게시글 삭제
   * @param {string} id - 게시글 ID
   * @returns {Promise} - 삭제 결과
   */
  deletePost: async (id) => {
    return api.delete(ENDPOINTS.POST.DETAIL(id));
  },
  
  /**
   * 게시글 검색
   * @param {string} query - 검색어
   * @param {number} page - 페이지 번호
   * @param {number} size - 페이지 크기
   * @returns {Promise} - 검색 결과
   */
  searchPosts: async (query, page = 0, size = 10) => {
    return api.get(ENDPOINTS.POST.SEARCH, { query, page, size });
  },
  
  /**
   * 내 게시글 조회
   * @returns {Promise} - 내 게시글 목록
   */
  getMyPosts: async () => {
    return api.get(ENDPOINTS.POST.MY);
  },
  
  /**
   * 좋아요한 게시글 조회
   * @returns {Promise} - 좋아요한 게시글 목록
   */
  getLikedPosts: async () => {
    return api.get(ENDPOINTS.POST.LIKED);
  },
  
  /**
   * 북마크한 게시글 조회
   * @returns {Promise} - 북마크한 게시글 목록
   */
  getBookmarkedPosts: async () => {
    return api.get(ENDPOINTS.POST.BOOKMARKED);
  },
  
  /**
   * 팔로우한 사용자의 게시글 조회
   * @returns {Promise} - 팔로잉 게시글 목록
   */
  getFollowingsPosts: async () => {
    return api.get(ENDPOINTS.POST.FOLLOWINGS);
  },
  
  /**
   * 게시글 좋아요 토글
   * @param {string} id - 게시글 ID
   * @returns {Promise} - 좋아요 상태 및 카운트
   */
  toggleLike: async (id) => {
    try {
      console.log('toggleLike API 호출 - 게시글 ID:', id);
      const response = await api.post(ENDPOINTS.POST.LIKE(id));
      console.log('toggleLike API 응답:', response);
      
      // 응답 구조 확인 및 보정
      const result = {
        data: {
          liked: response?.liked ?? (response?.data?.liked ?? false),
          count: response?.count ?? (response?.data?.count ?? 0)
        }
      };
      
      console.log('보정된 좋아요 결과:', result);
      return result;
    } catch (error) {
      console.error('toggleLike API 오류:', error);
      throw error;
    }
  },
  
  /**
   * 게시글 북마크 토글
   * @param {string} id - 게시글 ID
   * @returns {Promise} - 북마크 상태 및 카운트
   */
  toggleBookmark: async (id) => {
    try {
      console.log('toggleBookmark API 호출 - 게시글 ID:', id);
      const response = await api.post(ENDPOINTS.POST.BOOKMARK(id));
      console.log('toggleBookmark API 응답:', response);
      
      // 응답 구조 확인 및 보정
      const result = {
        data: {
          bookmarked: response?.bookmarked ?? (response?.data?.bookmarked ?? false),
          count: response?.count ?? (response?.data?.count ?? 0)
        }
      };
      
      console.log('보정된 북마크 결과:', result);
      return result;
    } catch (error) {
      console.error('toggleBookmark API 오류:', error);
      throw error;
    }
  },
  
  /**
   * 게시글 좋아요 상태 조회
   * @param {string} id - 게시글 ID
   * @returns {Promise} - 좋아요 상태
   */
  getLikeStatus: async (id) => {
    return api.get(ENDPOINTS.POST.LIKE(id));
  },
  
  /**
   * 게시글 북마크 상태 조회
   * @param {string} id - 게시글 ID
   * @returns {Promise} - 북마크 상태
   */
  getBookmarkStatus: async (id) => {
    return api.get(ENDPOINTS.POST.BOOKMARK(id));
  },
  
  /**
   * 커서 기반 게시글 목록 조회 (무한 스크롤용)
   * @param {string|null} lastPostId - 마지막 게시글 ID (null인 경우 첫 페이지)
   * @param {number} limit - 가져올 게시글 수
   * @returns {Promise} - 게시글 목록 및 다음 커서
   */
  getPostsWithCursor: async (lastPostId = null, limit = 20) => {
    const params = { limit };
    if (lastPostId) params.lastPostId = lastPostId;
    
    return api.get(ENDPOINTS.POST.CURSOR, params);
  },
  
  /**
   * 시간 기준 커서 기반 게시글 목록 조회
   * @param {string|null} createdAt - 마지막 게시글 생성 시간
   * @param {string|null} id - 마지막 게시글 ID
   * @param {number} limit - 가져올 게시글 수
   * @returns {Promise} - 게시글 목록 및 다음 커서
   */
  getPostsWithTimeCursor: async (createdAt = null, id = null, limit = 20) => {
    const params = { limit };
    if (createdAt) params.createdAt = createdAt;
    if (id) params.id = id;
    
    return api.get(ENDPOINTS.POST.TIME_CURSOR, params);
  },
  
  /**
   * 특정 사용자의 게시글 조회
   * @param {string} username - 사용자 이름
   * @returns {Promise} - 사용자 게시글 목록
   */
  getPostsByUsername: async (username) => {
    return api.get(`${ENDPOINTS.USER.PROFILE(username)}/posts`);
  },
  
  /**
   * 게시글 댓글 조회
   * @param {string} postId - 게시글 ID
   * @param {number} page - 페이지 번호
   * @param {number} size - 페이지 크기
   * @returns {Promise} - 댓글 목록
   */
  getPostComments: async (postId, page = 0, size = 20) => {
    return api.get(ENDPOINTS.POST.COMMENTS(postId), { page, size });
  },
  
  /**
   * 홈 화면 데이터 조회 (최신 게시글, 팔로잉 게시글)
   * @returns {Promise} - 홈 화면 데이터
   */
  getHomeData: async () => {
    try {
      const [followingPostsResponse, latestPostsResponse] = await Promise.all([
        api.get(ENDPOINTS.POST.FOLLOWINGS),
        api.get(ENDPOINTS.POST.BASE, { page: 0, size: 5 })
      ]);
      
      // 다양한 응답 구조 처리
      let followingPosts = [];
      let totalFollowingPosts = 0;
      
      // 백엔드에서 다양한 형태로 응답이 오는 경우 처리
      if (followingPostsResponse) {
        if (Array.isArray(followingPostsResponse)) {
          // 배열로 응답이 온 경우
          followingPosts = followingPostsResponse;
          totalFollowingPosts = followingPostsResponse.length;
        } else if (followingPostsResponse.content && Array.isArray(followingPostsResponse.content)) {
          // Page 응답으로 온 경우
          followingPosts = followingPostsResponse.content;
          totalFollowingPosts = followingPostsResponse.totalElements || followingPosts.length;
        }
      }
      
      // 최신 게시글 처리
      let latestPosts = [];
      if (latestPostsResponse) {
        if (Array.isArray(latestPostsResponse)) {
          latestPosts = latestPostsResponse;
        } else if (latestPostsResponse.content && Array.isArray(latestPostsResponse.content)) {
          latestPosts = latestPostsResponse.content;
        }
      }
      
      // 반환 데이터 구조
      return {
        followingPosts,
        totalFollowingPosts,
        latestPosts
      };
    } catch (error) {
      console.error('홈 데이터 조회 오류:', error);
      throw error;
    }
  },
  
  /**
   * 배치로 여러 게시글 상태 조회
   * @param {Array<string>} postIds - 게시글 ID 배열
   * @returns {Promise} - 게시글 상태 정보
   */
  getBatchPostsData: async (postIds) => {
    return api.post(`${ENDPOINTS.POST.BASE}/batch`, { postIds });
  },
};

export default postService;
