/**
 * 홈 데이터 관리 훅
 * - 홈 화면에 필요한 데이터 로드 및 관리
 */

import { useState, useCallback, useEffect } from 'react';
import { postService } from '../../services/postService';

/**
 * 홈 화면 데이터 관리 커스텀 훅
 * @returns {Object} 홈 화면 데이터 및 상태
 */
export function useHomeData() {
  // 상태 관리
  const [homeData, setHomeData] = useState({
    followingPosts: [],
    latestPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalFollowingPosts, setTotalFollowingPosts] = useState(0);
  
  /**
   * 홈 화면 데이터 로드
   * @returns {Promise} 데이터 로드 결과
   */
  const loadHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 홈 데이터 불러오기
      console.log('홈 데이터 로드 시작');
      const data = await postService.getHomePageData();
      console.log('홈 데이터 로드 결과:', data);
      
      // 데이터 유효성 검사
      const followingPosts = Array.isArray(data.followingPosts) ? data.followingPosts : [];
      const latestPosts = Array.isArray(data.latestPosts) ? data.latestPosts : [];
      const likedPosts = Array.isArray(data.likedPosts) ? data.likedPosts : [];
      const bookmarkedPosts = Array.isArray(data.bookmarkedPosts) ? data.bookmarkedPosts : [];
      
      // 좋아요/북마크 상태 적용
      const processedFollowingPosts = followingPosts.map(post => {
        const isLiked = likedPosts.some(likedPost => likedPost.id === post.id);
        const isBookmarked = bookmarkedPosts.some(bookmarkedPost => bookmarkedPost.id === post.id);
        
        return {
          ...post,
          isLiked,
          isBookmarked,
          // 좋아요/북마크/댓글 수가 0으로 나오는 문제 해결
          likeCount: post.likeCount || 0,
          bookmarkCount: post.bookmarkCount || 0,
          commentCount: post.commentCount || 0
        };
      });
      
      // 상태 업데이트
      setHomeData({
        followingPosts: processedFollowingPosts,
        latestPosts,
        likedPosts,
        bookmarkedPosts
      });
      
      console.log(`팔로잉 게시글 ${followingPosts.length}개, 최신 게시글 ${latestPosts.length}개, 좋아요 ${likedPosts.length}개, 북마크 ${bookmarkedPosts.length}개 로드 완료`);
      
      setTotalFollowingPosts(data.totalFollowingPosts || followingPosts.length);
      setLoading(false);
      
      return data;
    } catch (err) {
      console.error('홈 화면 데이터 로드 오류:', err);
      setError('데이터를 불러오는 중 문제가 발생했습니다. 새로고침 해주세요.');
      setLoading(false);
      throw err;
    }
  }, []);
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadHomeData().catch(err => 
      console.error('홈 데이터 초기 로드 실패:', err)
    );
  }, [loadHomeData]);
  
  /**
   * 특정 게시글 업데이트
   * @param {string} postId - 게시글 ID
   * @param {Object} updatedData - 업데이트할 데이터
   */
  const updatePost = useCallback((postId, updatedData) => {
    setHomeData(prevData => {
      // 팔로잉 게시글 업데이트
      const updatedFollowingPosts = prevData.followingPosts.map(post =>
        post.id === postId ? { ...post, ...updatedData } : post
      );
      
      // 최신 게시글 업데이트
      const updatedLatestPosts = prevData.latestPosts.map(post =>
        post.id === postId ? { ...post, ...updatedData } : post
      );
      
      return {
        ...prevData,
        followingPosts: updatedFollowingPosts,
        latestPosts: updatedLatestPosts,
      };
    });
  }, []);
  
  /**
   * 새 게시글 추가
   * @param {Object} newPost - 새 게시글 데이터
   */
  const addPost = useCallback((newPost) => {
    setHomeData(prevData => {
      // 최신 게시글 목록 맨 앞에 추가
      const updatedLatestPosts = [newPost, ...prevData.latestPosts];
      
      // 사용자 게시글인 경우 팔로잉 게시글에도 추가
      const updatedFollowingPosts = prevData.followingPosts.some(post => 
        post.username === newPost.username
      )
        ? [newPost, ...prevData.followingPosts]
        : prevData.followingPosts;
      
      return {
        ...prevData,
        followingPosts: updatedFollowingPosts,
        latestPosts: updatedLatestPosts,
      };
    });
  }, []);
  
  /**
   * 게시글 삭제
   * @param {string} postId - 삭제할 게시글 ID
   */
  const removePost = useCallback((postId) => {
    setHomeData(prevData => {
      // 팔로잉 게시글에서 제거
      const updatedFollowingPosts = prevData.followingPosts.filter(post => 
        post.id !== postId
      );
      
      // 최신 게시글에서 제거
      const updatedLatestPosts = prevData.latestPosts.filter(post => 
        post.id !== postId
      );
      
      return {
        ...prevData,
        followingPosts: updatedFollowingPosts,
        latestPosts: updatedLatestPosts,
      };
    });
  }, []);
  
  return {
    homeData,
    loading,
    error,
    totalFollowingPosts,
    loadHomeData,
    updatePost,
    addPost,
    removePost,
  };
}

export default useHomeData;
