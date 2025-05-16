import { postApi } from '../api/postApi';
import axios from 'axios';
import { API_URL, getAuthHeader } from '../api/config';

/**
 * 홈 화면에 필요한 데이터를 처리하는 서비스
 */
export const homeService = {
  /**
   * 홈 화면에 필요한 모든 데이터 로드 및 가공
   * @returns {Promise<Object>} 가공된 홈 화면 데이터
   */
  getHomePageData: async () => {
    try {
      console.log('홈 서비스: 데이터 로드 시작');
      
      // 직접 API 호출을 시도해보고 postApi를 사용하는 방법으로 백업
      let latestPosts, followingPosts, likedPosts, bookmarkedPosts;
      
      try {
        console.log('홈 서비스: postApi.getHomePageData 호출 시도');
        const result = await postApi.getHomePageData();
        latestPosts = result.latestPosts;
        followingPosts = result.followingPosts;
        likedPosts = result.likedPosts;
        bookmarkedPosts = result.bookmarkedPosts;
        console.log('홈 서비스: postApi 응답 받음', { 
          latestPostsCount: latestPosts?.length || 0,
          followingPostsCount: followingPosts?.length || 0,
          likedPostsCount: likedPosts?.length || 0,
          bookmarkedPostsCount: bookmarkedPosts?.length || 0
        });
      } catch (apiError) {
        console.error('홈 서비스: postApi 오류, 대체 방법 시도', apiError);
        const token = localStorage.getItem('token');
        const authHeader = getAuthHeader(token);
        
        // 기본 응답 값 초기화
        latestPosts = [];
        followingPosts = [];
        likedPosts = [];
        bookmarkedPosts = [];
        
        // 중요 API 재시도
        try {
          // 팔로잉 게시글 가져오기 시도
          const followingPostsRes = await axios.get(`${API_URL}/posts/followings`, authHeader);
          followingPosts = followingPostsRes.data || [];
          console.log('홈 서비스: 팔로잉 게시글 응답', followingPosts.length);
          
          // 최신 게시글 가져오기 시도
          const latestPostsRes = await axios.get(`${API_URL}/posts?page=0&size=5`);
          latestPosts = latestPostsRes.data.content || [];
          console.log('홈 서비스: 최신 게시글 응답', latestPosts.length);
        } catch (directError) {
          console.error('홈 서비스: 직접 API 재시도 실패', directError);
        }
      }
      
      // 좋아요/북마크 상태 추출
      const likedPostIds = (likedPosts || []).map(post => post.id);
      const bookmarkedPostIds = (bookmarkedPosts || []).map(post => post.id);
      
      console.log('홈 서비스: ID 추출 완료', { 
        likedPostIdsCount: likedPostIds.length, 
        bookmarkedPostIdsCount: bookmarkedPostIds.length 
      });
      
      // 팔로잉 게시글에 좋아요/북마크 상태 추가
      const enhancedFollowingPosts = (followingPosts || []).map(post => ({
        ...post,
        isLiked: likedPostIds.includes(post.id),
        isBookmarked: bookmarkedPostIds.includes(post.id)
      }));
      
      console.log('홈 서비스: 게시글 데이터 가공 완료', {
        enhancedFollowingPostsCount: enhancedFollowingPosts.length
      });
      
      return {
        latestPosts: latestPosts || [],
        followingPosts: enhancedFollowingPosts,
        notifications: [] // 향후 구현
      };
    } catch (error) {
      console.error('홈 데이터 로드 및 가공 중 오류:', error);
      // 에러가 발생해도 기본 데이터 반환
      return {
        latestPosts: [],
        followingPosts: [],
        notifications: []
      };
    }
  }
};
