/**
 * 게시글 상호작용(좋아요, 북마크) 관리를 위한 커스텀 훅
 */

import { useState, useCallback, useEffect } from 'react';
import { postService } from '../../services/postService';

/**
 * 게시글 상호작용 관리 훅
 * @param {Array} initialPosts - 초기 게시글 목록
 * @returns {Object} - 게시글 상호작용 관련 상태 및 핸들러
 */
export function usePostInteractions(initialPosts = []) {
  // 게시글 목록 상태
  const [posts, setPosts] = useState(initialPosts);
  
  // 좋아요/북마크 상태 관리
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);
  
  // 초기 데이터 설정 시 좋아요/북마크 상태 추출
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      // 로그 추가
      console.log('usePostInteractions - 게시글 데이터 초기화:', initialPosts.length + '개');
      
      try {
        // 좋아요한 게시글 ID 추출
        const likedIds = initialPosts
          .filter(post => post.isLiked === true)
          .map(post => post.id);
          
        // 북마크한 게시글 ID 추출
        const bookmarkedIds = initialPosts
          .filter(post => post.isBookmarked === true)
          .map(post => post.id);
        
        console.log('usePostInteractions - 좋아요/북마크 목록 추출:', {
          좋아요: likedIds.length + '개',
          북마크: bookmarkedIds.length + '개'
        });
        
        setLikedPostIds(likedIds);
        setBookmarkedPostIds(bookmarkedIds);
        setPosts(initialPosts);
      } catch (err) {
        console.error('usePostInteractions - 좋아요/북마크 상태 추출 오류:', err);
      }
    }
  }, [initialPosts]);
  
  /**
   * 게시글 좋아요 처리 - 낙관적 업데이트 적용
   * @param {string} postId - 게시글 ID
   * @param {boolean} newStatus - 새로운 좋아요 상태
   */
  const handleLike = useCallback(async (postId, newStatus = null) => {
    try {
      console.log('usePostInteractions - 좋아요 요청:', postId);
      
      // 새 상태가 전달되지 않은 경우 현재 상태의 반대로 설정
      const isCurrentlyLiked = likedPostIds.includes(postId);
      const willLike = newStatus !== null ? newStatus : !isCurrentlyLiked;
      
      // 낙관적 업데이트 (UI 즉시 변경)
      // 1. 좋아요 ID 목록 업데이트
      setLikedPostIds(prev => {
        const newIds = willLike
          ? [...prev, postId] 
          : prev.filter(id => id !== postId);
        
        return newIds;
      });
      
      // 2. 게시글 데이터 업데이트
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            // 좋아요 수 계산
            const currentCount = post.likeCount || 0;
            const newCount = willLike 
              ? currentCount + 1 
              : Math.max(0, currentCount - 1);
            
            return {
              ...post,
              isLiked: willLike,
              likeCount: newCount
            };
          }
          return post;
        });
      });
      
      // API 호출
      const result = await postService.toggleLike(postId);
      
      // 서버 응답 처리 (서버와 클라이언트 상태가 다른 경우에만)
      if (result) {
        console.log('usePostInteractions - 좋아요 응답:', result);
        
        // 서버 응답에서 liked 값 추출
        const serverLikedState = !!result.liked;
        const serverCount = result.count || null;
        
        if (serverLikedState !== willLike || serverCount !== null) {
          console.log('usePostInteractions - 서버 응답과 클라이언트 상태 불일치:', {
            postId,
            클라이언트: { liked: willLike },
            서버: { liked: serverLikedState, count: serverCount }
          });
          
          // 서버 상태로 동기화
          setLikedPostIds(prev => {
            return serverLikedState
              ? [...new Set([...prev, postId])]
              : prev.filter(id => id !== postId);
          });
          
          setPosts(prev => {
            return prev.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: serverLikedState,
                  likeCount: serverCount !== null ? serverCount : post.likeCount
                };
              }
              return post;
            });
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      
      // 에러 발생 시 원래 상태로 되돌림
      const isCurrentlyLiked = likedPostIds.includes(postId);
      const willLike = newStatus !== null ? newStatus : !isCurrentlyLiked;
      
      // 좋아요 ID 목록 복원
      setLikedPostIds(prev => {
        return isCurrentlyLiked
          ? prev.filter(id => id !== postId)
          : [...prev, postId];
      });
      
      // 게시글 데이터 복원
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            const currentCount = post.likeCount || 0;
            const restoredCount = isCurrentlyLiked
              ? Math.max(0, currentCount - 1)
              : currentCount + 1;
            
            return {
              ...post,
              isLiked: !willLike,
              likeCount: restoredCount
            };
          }
          return post;
        });
      });
      
      return false;
    }
  }, [likedPostIds, postService]);
  
  /**
   * 게시글 북마크 처리 - 낙관적 업데이트 적용
   * @param {string} postId - 게시글 ID
   * @param {boolean} newStatus - 새로운 북마크 상태
   */
  const handleBookmark = useCallback(async (postId, newStatus = null) => {
    try {
      console.log('usePostInteractions - 북마크 요청:', postId);
      
      // 새 상태가 전달되지 않은 경우 현재 상태의 반대로 설정
      const isCurrentlyBookmarked = bookmarkedPostIds.includes(postId);
      const willBookmark = newStatus !== null ? newStatus : !isCurrentlyBookmarked;
      
      // 낙관적 업데이트 (UI 즉시 변경)
      // 1. 북마크 ID 목록 업데이트
      setBookmarkedPostIds(prev => {
        const newIds = willBookmark
          ? [...prev, postId]
          : prev.filter(id => id !== postId);
        
        return newIds;
      });
      
      // 2. 게시글 데이터 업데이트
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            // 북마크 수 계산
            const currentCount = post.bookmarkCount || 0;
            const newCount = willBookmark
              ? currentCount + 1
              : Math.max(0, currentCount - 1);
            
            return {
              ...post,
              isBookmarked: willBookmark,
              bookmarkCount: newCount
            };
          }
          return post;
        });
      });
      
      // API 호출
      const result = await postService.toggleBookmark(postId);
      
      // 서버 응답 처리 (서버와 클라이언트 상태가 다른 경우에만)
      if (result) {
        console.log('usePostInteractions - 북마크 응답:', result);
        
        // 서버 응답에서 bookmarked 값 추출
        const serverBookmarkedState = !!result.bookmarked;
        const serverCount = result.count || null;
        
        if (serverBookmarkedState !== willBookmark || serverCount !== null) {
          console.log('usePostInteractions - 서버 응답과 클라이언트 상태 불일치:', {
            postId,
            클라이언트: { bookmarked: willBookmark },
            서버: { bookmarked: serverBookmarkedState, count: serverCount }
          });
          
          // 서버 상태로 동기화
          setBookmarkedPostIds(prev => {
            return serverBookmarkedState
              ? [...new Set([...prev, postId])]
              : prev.filter(id => id !== postId);
          });
          
          setPosts(prev => {
            return prev.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  isBookmarked: serverBookmarkedState,
                  bookmarkCount: serverCount !== null ? serverCount : post.bookmarkCount
                };
              }
              return post;
            });
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('북마크 처리 실패:', error);
      
      // 에러 발생 시 원래 상태로 되돌림
      const isCurrentlyBookmarked = bookmarkedPostIds.includes(postId);
      const willBookmark = newStatus !== null ? newStatus : !isCurrentlyBookmarked;
      
      // 북마크 ID 목록 복원
      setBookmarkedPostIds(prev => {
        return isCurrentlyBookmarked
          ? prev.filter(id => id !== postId)
          : [...prev, postId];
      });
      
      // 게시글 데이터 복원
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            const currentCount = post.bookmarkCount || 0;
            const restoredCount = isCurrentlyBookmarked
              ? Math.max(0, currentCount - 1)
              : currentCount + 1;
            
            return {
              ...post,
              isBookmarked: !willBookmark,
              bookmarkCount: restoredCount
            };
          }
          return post;
        });
      });
      
      return false;
    }
  }, [bookmarkedPostIds, postService]);
  
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
    handleBookmark,
    
    // 추가 헬퍼 메서드
    isLiked: (postId) => likedPostIds.includes(postId),
    isBookmarked: (postId) => bookmarkedPostIds.includes(postId),
    
    // 게시글 상태 업데이트
    updatePost: (postId, updatedData) => {
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, ...updatedData } : post
        )
      );
    },
    
    // 댓글 수 업데이트
    updateCommentCount: (postId, count) => {
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, commentCount: count } : post
        )
      );
    }
  };
}

export default usePostInteractions;
