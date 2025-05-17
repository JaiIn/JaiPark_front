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
      
      // 낙관적 업데이트 (즉시 UI 업데이트)
      const isCurrentlyLiked = likedPostIds.includes(postId);
      const newLikedState = !isCurrentlyLiked;
      
      // 좋아요 ID 목록 업데이트
      setLikedPostIds(prev => {
        const newIds = newLikedState
          ? [...new Set([...prev, postId])]
          : prev.filter(id => id !== postId);
          
        console.log('usePostInteractions - 좋아요 상태 변경 (낙관적):', { 
          postId, 
          이전상태: isCurrentlyLiked, 
          새상태: newLikedState, 
          새목록: newIds 
        });
        return newIds;
      });
      
      // 게시글 데이터 업데이트
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            // 좋아요 개수 변경 (즐시 적용)
            const currentCount = post.likeCount || 0;
            const newCount = newLikedState 
              ? currentCount + 1 
              : Math.max(0, currentCount - 1);
              
            return {
              ...post,
              isLiked: newLikedState,
              likeCount: newCount
            };
          }
          return post;
        });
      });
      
      // API 호출
      const token = localStorage.getItem('token');
      const result = await postService.toggleLike(postId, token);
      
      // 응답 데이터 처리
      if (result && result.data) {
        console.log('usePostInteractions - 좋아요 응답:', result.data);
        
        // 서버 응답과 클라이언트 상태가 다른 경우 (톱금하지 않음)
        if (result.data.liked !== newLikedState) {
          console.log('usePostInteractions - 서버 응답과 클라이언트 상태가 다름:', {
            postId,
            서버상태: result.data.liked,
            클라이언트상태: newLikedState
          });
          
          // 서버 응답으로 상태 재조정 (필요한 경우만)
          setLikedPostIds(prev => {
            if (result.data.liked) {
              return [...new Set([...prev, postId])];
            } else {
              return prev.filter(id => id !== postId);
            }
          });
          
          // 게시글 데이터도 서버 응답에 맞춰 업데이트
          setPosts(prev => {
            return prev.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: result.data.liked,
                  likeCount: result.data.count || post.likeCount || 0
                };
              }
              return post;
            });
          });
        }
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      
      // 오류 발생 시 상태 되돌리기
      const isCurrentlyLiked = likedPostIds.includes(postId);
      
      // 좋아요 ID 목록 복원
      setLikedPostIds(prev => {
        const restoredIds = isCurrentlyLiked
          ? prev.filter(id => id !== postId)
          : [...new Set([...prev, postId])];
          
        console.log('usePostInteractions - 오류로 인한 좋아요 상태 복원:', { 
          postId, 
          복원된상태: !isCurrentlyLiked 
        });
        return restoredIds;
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
              isLiked: !isCurrentlyLiked,
              likeCount: restoredCount
            };
          }
          return post;
        });
      });
    }
  }, [likedPostIds]);
  
  // 북마크 처리
  const handleBookmark = useCallback(async (postId) => {
    try {
      console.log('usePostInteractions - 북마크 요청:', postId);
      
      // 낙관적 업데이트 (즉시 UI 업데이트)
      const isCurrentlyBookmarked = bookmarkedPostIds.includes(postId);
      const newBookmarkedState = !isCurrentlyBookmarked;
      
      // 북마크 ID 목록 업데이트
      setBookmarkedPostIds(prev => {
        const newIds = newBookmarkedState
          ? [...new Set([...prev, postId])]
          : prev.filter(id => id !== postId);
          
        console.log('usePostInteractions - 북마크 상태 변경 (낙관적):', { 
          postId, 
          이전상태: isCurrentlyBookmarked, 
          새상태: newBookmarkedState, 
          새목록: newIds 
        });
        return newIds;
      });
      
      // 게시글 데이터 업데이트
      setPosts(prev => {
        return prev.map(post => {
          if (post.id === postId) {
            // 북마크 개수 변경 (즐시 적용)
            const currentCount = post.bookmarkCount || 0;
            const newCount = newBookmarkedState 
              ? currentCount + 1 
              : Math.max(0, currentCount - 1);
              
            return {
              ...post,
              isBookmarked: newBookmarkedState,
              bookmarkCount: newCount
            };
          }
          return post;
        });
      });
      
      // API 호출
      const token = localStorage.getItem('token');
      const result = await postService.toggleBookmark(postId, token);
      
      // 응답 데이터 처리
      if (result && result.data) {
        console.log('usePostInteractions - 북마크 응답:', result.data);
        
        // 서버 응답과 클라이언트 상태가 다른 경우 (톱깐하지 않음)
        if (result.data.bookmarked !== newBookmarkedState) {
          console.log('usePostInteractions - 서버 응답과 클라이언트 상태가 다름:', {
            postId,
            서버상태: result.data.bookmarked,
            클라이언트상태: newBookmarkedState
          });
          
          // 서버 응답으로 상태 재조정 (필요한 경우만)
          setBookmarkedPostIds(prev => {
            if (result.data.bookmarked) {
              return [...new Set([...prev, postId])];
            } else {
              return prev.filter(id => id !== postId);
            }
          });
          
          // 게시글 데이터도 서버 응답에 맞춰 업데이트
          setPosts(prev => {
            return prev.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  isBookmarked: result.data.bookmarked,
                  bookmarkCount: result.data.count || post.bookmarkCount || 0
                };
              }
              return post;
            });
          });
        }
      }
    } catch (error) {
      console.error('북마크 처리 중 오류:', error);
      
      // 오류 발생 시 상태 되돌리기
      const isCurrentlyBookmarked = bookmarkedPostIds.includes(postId);
      
      // 북마크 ID 목록 복원
      setBookmarkedPostIds(prev => {
        const restoredIds = isCurrentlyBookmarked
          ? prev.filter(id => id !== postId)
          : [...new Set([...prev, postId])];
          
        console.log('usePostInteractions - 오류로 인한 북마크 상태 복원:', { 
          postId, 
          복원된상태: !isCurrentlyBookmarked 
        });
        return restoredIds;
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
              isBookmarked: !isCurrentlyBookmarked,
              bookmarkCount: restoredCount
            };
          }
          return post;
        });
      });
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
