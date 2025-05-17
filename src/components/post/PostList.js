/**
 * 게시글 목록 컴포넌트
 * - 다양한 상황에서 재사용 가능한 게시글 목록 표시
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PostCard from './PostCard';
import { LoadingSpinner, EmptyState, Pagination } from '../ui';

/**
 * PostList 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element} 게시글 목록 컴포넌트
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
  onPostComment,
  likedPosts = [],
  bookmarkedPosts = [],
  commentCounts = {},
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // 좋아요 처리
  const handleLike = (postId, newStatus) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    console.log('PostList - handleLike', { postId, newStatus });
    
    // 현재 좋아요 상태 확인
    const isLiked = likedPosts.includes(postId);
    
    // onPostLike 함수가 있으면 호출
    if (onPostLike) {
      onPostLike(postId, newStatus !== undefined ? newStatus : !isLiked);
    }
  };
  
  // 북마크 처리
  const handleBookmark = (postId, newStatus) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    console.log('PostList - handleBookmark', { postId, newStatus });
    
    // 현재 북마크 상태 확인
    const isBookmarked = bookmarkedPosts.includes(postId);
    
    // onPostBookmark 함수가 있으면 호출
    if (onPostBookmark) {
      onPostBookmark(postId, newStatus !== undefined ? newStatus : !isBookmarked);
    }
  };
  
  // 댓글 처리
  const handleComment = (postId) => {
    navigate(`/posts/${postId}`);
    
    if (onPostComment) {
      onPostComment(postId);
    }
  };
  
  // 게시글이 없는 경우 표시할 기본 액션
  const defaultEmptyAction = (
    <Link to="/posts/new" className="text-indigo-600 hover:text-indigo-800 font-medium">
      새 글 작성하기
    </Link>
  );
  
  // 사용할 Empty 액션 결정
  const actionToUse = emptyAction || (isAuthenticated ? defaultEmptyAction : null);
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 제목이 있으면 표시 */}
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* 로딩 중인 경우 */}
      {loading && posts.length === 0 && <LoadingSpinner size="lg" />}
      
      {/* 게시글이 없는 경우 */}
      {!loading && posts.length === 0 ? (
        <EmptyState
          title={emptyMessage}
          action={actionToUse}
        />
      ) : (
        <>
          {/* 게시글 목록 */}
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  // 댓글, 좋아요, 북마크 수가 0으로 나오는 문제 해결
                  commentCount: post.commentCount || commentCounts[post.id] || 0,
                  likeCount: post.likeCount || 0,
                  bookmarkCount: post.bookmarkCount || 0
                }}
                variant={postCardVariant}
                showActions={isAuthenticated}
                isLiked={likedPosts.includes(post.id) || post.isLiked}
                isBookmarked={bookmarkedPosts.includes(post.id) || post.isBookmarked}
                commentCount={post.commentCount || commentCounts[post.id] || 0}
                onLikeClick={handleLike}
                onBookmarkClick={handleBookmark}
                onCommentClick={handleComment}
              />
            ))}
          </div>
          
          {/* 로딩 중이면서 게시글이 있는 경우 (추가 로딩) */}
          {loading && posts.length > 0 && (
            <div className="py-4">
              <LoadingSpinner size="md" />
            </div>
          )}
          
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
  /** 댓글 클릭 핸들러 */
  onPostComment: PropTypes.func,
  /** 좋아요 표시된 게시글 ID 배열 */
  likedPosts: PropTypes.array,
  /** 북마크 표시된 게시글 ID 배열 */
  bookmarkedPosts: PropTypes.array,
  /** 게시글별 댓글 수 (객체: { postId: count }) */
  commentCounts: PropTypes.object,
  /** 추가 클래스 */
  className: PropTypes.string,
};

export default PostList;
