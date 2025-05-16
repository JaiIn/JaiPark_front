import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, EmptyState, Pagination } from '../common/UIComponents';
import PostCard from '../post/PostCard';

/**
 * 게시글 목록 컴포넌트
 * 다양한 상황에서 재사용 가능한 게시글 목록 표시 컴포넌트
 */
const PostList = ({
  posts = [],
  loading = false,
  error = null,
  title = '게시글',
  emptyMessage = '게시글이 없습니다.',
  emptyAction = null,
  showPagination = true,
  currentPage = 0,
  totalPages = 1,
  onPageChange = () => {},
  postCardVariant = 'default',
  onPostLike,
  onPostBookmark,
  likedPosts = [],
  bookmarkedPosts = [],
  commentCounts = {}
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // 좋아요 및 북마크 상태 관리
  const [likes, setLikes] = useState(new Set(likedPosts));
  const [bookmarks, setBookmarks] = useState(new Set(bookmarkedPosts));
  
  // props로 전달된 좋아요/북마크 목록이 변경되면 상태 업데이트
  useEffect(() => {
    console.log('PostList received likedPosts:', likedPosts);
    setLikes(new Set(likedPosts));
  }, [likedPosts]);
  
  useEffect(() => {
    console.log('PostList received bookmarkedPosts:', bookmarkedPosts);
    setBookmarks(new Set(bookmarkedPosts));
  }, [bookmarkedPosts]);
  
  // 좋아요 처리
  const handleLike = useCallback((postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // 좋아요 토글
    setLikes(prev => {
      const newLikes = new Set(prev);
      if (newLikes.has(postId)) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }
      console.log('PostList - 좋아요 로컬 상태 업데이트:', Array.from(newLikes));
      return newLikes;
    });
    
    // 상위 컴포넌트 핸들러 호출
    if (onPostLike) {
      console.log('PostList - 좋아요 핸들러 호출:', { postId });
      onPostLike(postId);
    }
  }, [isAuthenticated, navigate, onPostLike]);
  
  // 북마크 처리
  const handleBookmark = useCallback((postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // 북마크 토글
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(postId)) {
        newBookmarks.delete(postId);
      } else {
        newBookmarks.add(postId);
      }
      console.log('PostList - 북마크 로컬 상태 업데이트:', Array.from(newBookmarks));
      return newBookmarks;
    });
    
    // 상위 컴포넌트 핸들러 호출
    if (onPostBookmark) {
      console.log('PostList - 북마크 핸들러 호출:', { postId });
      onPostBookmark(postId);
    }
  }, [isAuthenticated, navigate, onPostBookmark]);
  
  // 게시글이 없는 경우 표시할 기본 액션
  const defaultEmptyAction = (
    <Link to="/posts/new" className="text-indigo-600 hover:text-indigo-800 font-medium">
      새 글 작성하기
    </Link>
  );
  
  return (
    <div className="space-y-6">
      {/* 제목이 있으면 표시 */}
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      {/* 로딩 중인 경우 */}
      {loading && posts.length === 0 && <LoadingSpinner />}
      
      {/* 게시글이 없는 경우 */}
      {!loading && posts.length === 0 ? (
        <EmptyState
          title={emptyMessage}
          action={emptyAction || (isAuthenticated ? defaultEmptyAction : null)}
        />
      ) : (
        <>
          {/* 게시글 목록 */}
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                variant={postCardVariant}
                showActions={isAuthenticated}
                isLiked={likes.has(post.id)}
                isBookmarked={bookmarks.has(post.id)}
                commentCount={commentCounts[post.id] || post.commentCount || 0}
                onLikeClick={handleLike}
                onBookmarkClick={handleBookmark}
              />
            ))}
          </div>
          
          {/* 로딩 중이면서 게시글이 있는 경우 (추가 로딩) */}
          {loading && posts.length > 0 && <LoadingSpinner />}
          
          {/* 페이지네이션 */}
          {showPagination && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

PostList.propTypes = {
  /** 게시글 배열 */
  posts: PropTypes.array,
  /** 로딩 상태 */
  loading: PropTypes.bool,
  /** 에러 메시지 */
  error: PropTypes.string,
  /** 목록 제목 */
  title: PropTypes.string,
  /** 게시글 없을 때 표시할 메시지 */
  emptyMessage: PropTypes.string,
  /** 게시글 없을 때 표시할 액션 */
  emptyAction: PropTypes.node,
  /** 페이지네이션 표시 여부 */
  showPagination: PropTypes.bool,
  /** 현재 페이지 번호 */
  currentPage: PropTypes.number,
  /** 전체 페이지 수 */
  totalPages: PropTypes.number,
  /** 페이지 변경 핸들러 */
  onPageChange: PropTypes.func,
  /** 게시글 카드 스타일 */
  postCardVariant: PropTypes.oneOf(['default', 'compact', 'featured', 'outline']),
  /** 좋아요 클릭 핸들러 */
  onPostLike: PropTypes.func,
  /** 북마크 클릭 핸들러 */
  onPostBookmark: PropTypes.func,
  /** 좋아요 표시된 게시글 ID 배열 */
  likedPosts: PropTypes.array,
  /** 북마크 표시된 게시글 ID 배열 */
  bookmarkedPosts: PropTypes.array,
  /** 게시글별 댓글 수 (객체: { postId: count }) */
  commentCounts: PropTypes.object
};

export default React.memo(PostList);
