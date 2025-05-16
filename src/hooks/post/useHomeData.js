import { useState, useCallback } from 'react';
import { postService } from '../../services/postService';

/**
 * 홈 화면 데이터 관리를 위한 커스텀 훅
 * @returns {Object} 홈 화면 데이터 상태와 로딩 함수
 */
export function useHomeData() {
  const [homeData, setHomeData] = useState({
    latestPosts: [],
    followingPosts: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 홈 데이터 로드
  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('홈화면훅: 홈 데이터 로딩 시작');
      const result = await postService.getHomePageData();
      console.log('홈화면훅: postService에서 결과 받음', {
        hasResult: !!result,
        latestPostsCount: result?.latestPosts?.length || 0,
        followingPostsCount: result?.followingPosts?.length || 0,
        notificationsCount: result?.notifications?.length || 0
      });
      
      if (result) {
        // 데이터 구조화 및 타입 검사
        // 개선된 게시글 데이터: 백엔드에서 받아온 상태 그대로 사용
        const enhancedFollowingPosts = (result.followingPosts || []).map(post => ({
          ...post,
          likeCount: post.likeCount || 0,
          commentCount: post.comments ? post.comments.length : 0,
          bookmarkCount: post.bookmarkCount || 0
          // 백엔드에서 받아온 isLiked, isBookmarked 그대로 사용
        }));
        
        const formattedData = {
          latestPosts: Array.isArray(result.latestPosts) ? result.latestPosts : [],
          followingPosts: enhancedFollowingPosts,
          notifications: Array.isArray(result.notifications) ? result.notifications : []
        };
        
        console.log('홈화면훅: 데이터 처리 완료', {
          latestPostsCount: formattedData.latestPosts.length,
          followingPostsCount: formattedData.followingPosts.length,
          firstFollowingPost: formattedData.followingPosts.length > 0 ? 
            {
              id: formattedData.followingPosts[0].id,
              title: formattedData.followingPosts[0].title,
              username: formattedData.followingPosts[0].username,
              likeCount: formattedData.followingPosts[0].likeCount,
              commentCount: formattedData.followingPosts[0].commentCount,
              bookmarkCount: formattedData.followingPosts[0].bookmarkCount
            } : 'none'
        });
        setHomeData(formattedData);
      }
      
      return result;
    } catch (err) {
      console.error('홈화면훅: 홈 데이터 로드 실패:', err);
      setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 총 팔로잉 게시글 수
  const totalFollowingPosts = homeData.followingPosts.length;
  
  return {
    homeData,
    loading,
    error,
    loadHomeData,
    totalFollowingPosts
  };
}
