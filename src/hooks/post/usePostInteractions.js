import { useState, useCallback, useEffect } from 'react';
import { postService } from '../../services/postService';

/**
 * 게시글 상호작용(좋아요, 북마크) 관리를 위한 커스텀 훅
 * @param {Array} initialPosts - 초기 게시글 목록
 * @returns {Object} 게시글 상호작용 관련 상태와 핸들러
 */
export function usePostInteractions(initialPosts = []) {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);
  
  // 초기 데이터 설정 시 좋아요/북마크 상태 추출
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      const likedIds = initialPosts
        .filter(post => post.isLiked === true)
        .map(post => post.id);
        
      const bookmarkedIds = initialPosts
        .filter(post => post.isBookmarked === true)
        .map(post => post.id);
      
      console.log('usePostInteractions - 좋아요 목록 추출:', likedIds);
      console.log('usePostInteractions - 북마크 목록 추출:', bookmarkedIds);
      
      setLikedPostIds(likedIds);
      setBookmarkedPostIds(bookmarkedIds);
      setPosts(initialPosts);
    }
  }, [initialPosts]);
  
  // 좋아요 처리
  const handleLike = useCallback(async (postId) => {
    try {
      console.log('usePostInteractions - 좋아요 요청:', postId);
      const token = localStorage.getItem('token');
      
      // 토큰 전달을 통해 API 호출 실패 방지
      const result = await postService.toggleLike(postId, token);
      console.log('usePostInteractions - 좋아요 응답:', result?.data);
      
      // 좋아요 ID 목록 업데이트
      setLikedPostIds(prev => {
        const isLiked = prev.includes(postId);
        const newIds = isLiked 
          ? prev.filter(id => id !== postId) 
          : [...prev, postId];
          
        console.log('usePostInteractions - 좋아요 상태 변경:', { postId, 이전상태: isLiked, 새목록: newIds });
        return newIds;
      });
      
      // 게시글 데이터 업데이트
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            const isCurrentlyLiked = likedPostIds.includes(postId);
            return {
              ...post,
              isLiked: !isCurrentlyLiked,
              likeCount: isCurrentlyLiked 
                ? Math.max(0, (post.likeCount || 0) - 1) 
                : (post.likeCount || 0) + 1
            };
          }
          return post;
        });
      });
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    }
  }, [likedPostIds]);
  
  // 북마크 처리
  const handleBookmark = useCallback(async (postId) => {
    try {
      console.log('usePostInteractions - 북마크 요청:', postId);
      const token = localStorage.getItem('token');
      
      // 토큰 전달을 통해 API 호출 실패 방지
      const result = await postService.toggleBookmark(postId, token);
      console.log('usePostInteractions - 북마크 응답:', result?.data);
      
      // 북마크 ID 목록 업데이트
      setBookmarkedPostIds(prev => {
        const isBookmarked = prev.includes(postId);
        const newIds = isBookmarked 
          ? prev.filter(id => id !== postId) 
          : [...prev, postId];
          
        console.log('usePostInteractions - 북마크 상태 변경:', { postId, 이전상태: isBookmarked, 새목록: newIds });
        return newIds;
      });
      
      // 게시글 데이터 업데이트
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isBookmarked: !bookmarkedPostIds.includes(postId)
            };
          }
          return post;
        });
      });
    } catch (error) {
      console.error('북마크 처리 중 오류:', error);
    }
  }, [bookmarkedPostIds]);
  
  // 댓글 수 계산 객체 생성
  const commentCounts = posts.reduce((acc, post) => {
    acc[post.id] = post.commentCount || 0;
    return acc;
  }, {});
  
  return {
    posts,
    likedPostIds,
    bookmarkedPostIds,
    commentCounts,
    handleLike,
    handleBookmark
  };
}
