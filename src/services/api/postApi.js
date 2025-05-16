import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';
import { API_URL, ENDPOINTS } from '../../api/apiConfig';

/**
 * 게시글 관련 API 호출을 담당하는 모듈
 */
export const postApi = {
  /**
   * 게시글 목록 조회
   */
  getPosts: (page = 0, size = 10) => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.BASE}`, { page, size });
  },
  
  /**
   * 팔로잉 게시글 조회
   */
  getFollowingsPosts: () => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.FOLLOWINGS}`);
  },
  
  /**
   * 좋아요한 게시글 목록
   */
  getLikedPosts: () => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.LIKED}`);
  },
  
  /**
   * 북마크한 게시글 목록
   */
  getBookmarkedPosts: () => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.BOOKMARKED}`);
  },
  
  /**
   * 게시글 상세 조회
   */
  getPostDetail: (id) => {
    return apiGet(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}`);
  },
  
  /**
   * 게시글 작성
   */
  createPost: (data) => {
    return apiPost(`${API_URL}${ENDPOINTS.POST.BASE}`, data);
  },
  
  /**
   * 게시글 수정
   */
  updatePost: (id, data) => {
    return apiPut(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}`, data);
  },
  
  /**
   * 게시글 삭제
   */
  deletePost: (id) => {
    return apiDelete(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}`);
  },
  
  /**
   * 게시글 좋아요 토글
   */
  toggleLike: (id) => {
    return apiPost(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}/like`);
  },
  
  /**
   * 게시글 북마크 토글
   */
  toggleBookmark: (id) => {
    return apiPost(`${API_URL}${ENDPOINTS.POST.DETAIL(id)}/bookmark`);
  },
  
  /**
   * 홈 화면 데이터 조회
   */
  getHomePageData: async () => {
    // Promise.all을 사용하여 병렬로 API 호출
    const [latestPosts, followingPosts, likedPosts, bookmarkedPosts] = await Promise.all([
      apiGet(`${API_URL}${ENDPOINTS.POST.BASE}`, { page: 0, size: 5 }),
      apiGet(`${API_URL}${ENDPOINTS.POST.FOLLOWINGS}`),
      apiGet(`${API_URL}${ENDPOINTS.POST.LIKED}`),
      apiGet(`${API_URL}${ENDPOINTS.POST.BOOKMARKED}`)
    ]);
    
    return { latestPosts, followingPosts, likedPosts, bookmarkedPosts };
  }
};
