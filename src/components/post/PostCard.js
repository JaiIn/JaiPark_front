import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment } from 'react-icons/fa';

/**
 * 게시글 카드 컴포넌트
 * 다양한 스타일과 기능을 지원하는 재사용 가능한 게시글 표시 컴포넌트
 */
const PostCard = ({ 
  post, 
  variant = 'default',
  showActions = true,
  isLiked = false,
  isBookmarked = false,
  commentCount = 0,
  onLikeClick,
  onBookmarkClick
}) => {
  // 게시글 작성 시간 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}분 전`;
      }
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // 변형에 따른 스타일 적용
  const getCardStyle = () => {
    switch (variant) {
      case 'compact':
        return 'p-3 hover:bg-gray-50';
      case 'featured':
        return 'p-6 border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-xl';
      case 'outline':
        return 'p-4 border border-gray-200 hover:border-gray-300';
      default:
        return 'p-6 hover:shadow-lg';
    }
  };
  
  return (
    <div className={`bg-white shadow-md rounded-lg transition ${getCardStyle()}`}>
      {/* 게시글 제목 */}
      <Link to={`/posts/${post.id}`} className="text-indigo-700 hover:text-indigo-900 font-bold text-xl mb-2 block">
        {post.title}
      </Link>
      
      {/* 게시글 내용 (compact 모드에서는 생략) */}
      {variant !== 'compact' && (
        <p className="text-gray-700 line-clamp-2 mb-4">{post.content}</p>
      )}
      
      {/* 게시글 메타 정보 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          {/* 작성자 프로필로 이동하는 링크 */}
          <Link 
            to={`/profile/${post.username}`} 
            className="hover:text-indigo-600 font-medium"
          >
            {post.nickname || post.username}
          </Link>
          <span className="mx-2">•</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        {/* 액션 버튼들 */}
        {showActions && (
          <div className="flex items-center space-x-3">
            {/* 댓글 수 */}
            <div className="flex items-center">
              <FaComment className="text-gray-400 mr-1" />
              <span>{commentCount}</span>
            </div>
            
            {/* 좋아요 버튼 */}
            <button
              onClick={() => {
                console.log(`Like button clicked for post ${post.id}, current isLiked=${isLiked}`);
                onLikeClick && onLikeClick(post.id);
              }}
              className="flex items-center focus:outline-none"
              aria-label={isLiked ? "좋아요 취소" : "좋아요"}
              data-testid={`like-button-${post.id}`}
            >
              {isLiked ? (
                <FaHeart className="text-red-500 mr-1" />
              ) : (
                <FaRegHeart className="text-gray-400 mr-1" />
              )}
              <span>{post.likeCount || 0}</span>
            </button>
            
            {/* 북마크 버튼 */}
            <button
              onClick={() => {
                console.log(`Bookmark button clicked for post ${post.id}, current isBookmarked=${isBookmarked}`);
                onBookmarkClick && onBookmarkClick(post.id);
              }}
              className="flex items-center focus:outline-none"
              aria-label={isBookmarked ? "북마크 취소" : "북마크"}
              data-testid={`bookmark-button-${post.id}`}
            >
              {isBookmarked ? (
                <FaBookmark className="text-indigo-500 mr-1" />
              ) : (
                <FaRegBookmark className="text-gray-400 mr-1" />
              )}
              <span>{post.bookmarkCount || 0}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

PostCard.propTypes = {
  /** 게시글 데이터 */
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    username: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    createdAt: PropTypes.string,
    likeCount: PropTypes.number
  }).isRequired,
  /** 카드 스타일 변형 */
  variant: PropTypes.oneOf(['default', 'compact', 'featured', 'outline']),
  /** 액션 버튼(좋아요, 북마크 등) 표시 여부 */
  showActions: PropTypes.bool,
  /** 좋아요 상태 */
  isLiked: PropTypes.bool,
  /** 북마크 상태 */
  isBookmarked: PropTypes.bool,
  /** 댓글 개수 */
  commentCount: PropTypes.number,
  /** 좋아요 클릭 핸들러 */
  onLikeClick: PropTypes.func,
  /** 북마크 클릭 핸들러 */
  onBookmarkClick: PropTypes.func
};

export default React.memo(PostCard);
