/**
 * 게시글 액션 컴포넌트
 * - 좋아요, 북마크, 댓글 수 등 게시글 상호작용 UI
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment } from 'react-icons/fa';

/**
 * PostActions 컴포넌트
 * - 좋아요, 북마크, 댓글 수 표시 및 상호작용 처리
 * 
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element} PostActions 컴포넌트
 */
const PostActions = ({
  postId,
  isLiked = false,
  isBookmarked = false,
  likeCount = 0,
  bookmarkCount = 0,
  commentCount = 0,
  onLikeClick,
  onBookmarkClick,
  onCommentClick,
  showCounts = true,
  size = 'md',
  className = '',
  disabled = false,
}) => {
  // 아이콘 크기
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  // 텍스트 크기
  const textSizes = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
  };
  
  // 카운트 처리 (1000 -> 1k 등)
  const formatCount = (count) => {
    if (!showCounts) return '';
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    
    return count;
  };
  
  // 좋아요 버튼 클릭 처리
  const handleLikeClick = () => {
    if (!disabled && onLikeClick) {
      onLikeClick(postId, !isLiked);
    }
  };
  
  // 북마크 버튼 클릭 처리
  const handleBookmarkClick = () => {
    if (!disabled && onBookmarkClick) {
      onBookmarkClick(postId, !isBookmarked);
    }
  };
  
  // 댓글 버튼 클릭 처리
  const handleCommentClick = () => {
    if (!disabled && onCommentClick) {
      onCommentClick(postId);
    }
  };
  
  return (
    <div className={`flex items-center space-x-8 ${className}`}>
      {/* 댓글 버튼 */}
      <button
        type="button"
        className="flex items-center group"
        onClick={handleCommentClick}
        disabled={disabled}
        aria-label="댓글"
      >
        <FaComment className={`text-gray-700 group-hover:text-blue-600 mr-2 ${iconSizes[size]}`} />
        {showCounts && (
          <span className={`text-gray-700 font-medium group-hover:text-gray-900 ${textSizes[size]}`}>
            {formatCount(commentCount)}
          </span>
        )}
      </button>
      
      {/* 좋아요 버튼 */}
      <button
        type="button"
        className="flex items-center group"
        onClick={handleLikeClick}
        disabled={disabled}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        data-testid={`like-button-${postId}`}
      >
        {isLiked ? (
          <FaHeart className={`text-red-600 mr-2 ${iconSizes[size]}`} />
        ) : (
          <FaRegHeart className={`text-gray-700 group-hover:text-red-600 mr-2 ${iconSizes[size]}`} />
        )}
        {showCounts && (
          <span className={`text-gray-700 font-medium group-hover:text-gray-900 ${textSizes[size]}`}>
            {formatCount(likeCount)}
          </span>
        )}
      </button>
      
      {/* 북마크 버튼 */}
      <button
        type="button"
        className="flex items-center group"
        onClick={handleBookmarkClick}
        disabled={disabled}
        aria-label={isBookmarked ? "북마크 취소" : "북마크"}
        data-testid={`bookmark-button-${postId}`}
      >
        {isBookmarked ? (
          <FaBookmark className={`text-indigo-600 mr-2 ${iconSizes[size]}`} />
        ) : (
          <FaRegBookmark className={`text-gray-700 group-hover:text-indigo-600 mr-2 ${iconSizes[size]}`} />
        )}
        {showCounts && (
          <span className={`text-gray-700 font-medium group-hover:text-gray-900 ${textSizes[size]}`}>
            {formatCount(bookmarkCount)}
          </span>
        )}
      </button>
    </div>
  );
};

PostActions.propTypes = {
  /** 게시글 ID */
  postId: PropTypes.string.isRequired,
  /** 좋아요 상태 */
  isLiked: PropTypes.bool,
  /** 북마크 상태 */
  isBookmarked: PropTypes.bool,
  /** 좋아요 수 */
  likeCount: PropTypes.number,
  /** 북마크 수 */
  bookmarkCount: PropTypes.number,
  /** 댓글 수 */
  commentCount: PropTypes.number,
  /** 좋아요 클릭 핸들러 */
  onLikeClick: PropTypes.func,
  /** 북마크 클릭 핸들러 */
  onBookmarkClick: PropTypes.func,
  /** 댓글 클릭 핸들러 */
  onCommentClick: PropTypes.func,
  /** 카운트 표시 여부 */
  showCounts: PropTypes.bool,
  /** 아이콘 및 텍스트 크기 */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** 추가 클래스 */
  className: PropTypes.string,
  /** 비활성화 여부 */
  disabled: PropTypes.bool,
};

export default PostActions;
