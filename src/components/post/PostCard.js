/**
 * 게시글 카드 컴포넌트
 * - 게시글 정보 표시 및 상호작용
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/helpers';
import PostActions from './PostActions';
import { Card } from '../ui';

/**
 * PostCard 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element} 게시글 카드 컴포넌트
 */
const PostCard = ({
  post,
  variant = 'default',
  showActions = true,
  showFullContent = false,
  isLiked = false,
  isBookmarked = false,
  onLikeClick,
  onBookmarkClick,
  onCommentClick,
  commentCount = 0,
  className = '',
  onClick,
}) => {
  if (!post) return null;
  
  // 게시글 작성 시간 포맷팅
  const formattedDate = formatRelativeTime(post.createdAt);
  
  // 게시글 내용 표시 처리
  const renderContent = () => {
    if (!post.content) return null;
    
    const content = showFullContent
      ? post.content
      : post.content.length > 150
        ? `${post.content.substring(0, 150)}...`
        : post.content;
    
    return (
      <p className="text-gray-700 whitespace-pre-wrap my-2">
        {content}
        {!showFullContent && post.content.length > 150 && (
          <Link to={`/posts/${post.id}`} className="text-indigo-600 hover:text-indigo-800 ml-1">
            더 보기
          </Link>
        )}
      </p>
    );
  };
  
  // 카드 변형에 따른 스타일 설정
  const getCardClassName = () => {
    switch (variant) {
      case 'compact':
        return 'p-3 hover:bg-gray-50';
      case 'featured':
        return 'border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-xl';
      case 'outline':
        return 'border border-gray-200 hover:border-gray-300';
      default:
        return 'hover:shadow-lg';
    }
  };
  
  return (
    <Card
      className={`transition duration-200 ${getCardClassName()} ${className}`}
      onClick={onClick}
      hoverable={!!onClick}
    >
      {/* 게시글 메타 정보 (작성자, 시간) */}
      <div className="flex items-center mb-3">
        {/* 작성자 프로필 이미지 */}
        <Link to={`/profile/${post.username}`} className="mr-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {post.profileImage ? (
              <img 
                src={post.profileImage} 
                alt={post.nickname || post.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                {(post.nickname || post.username || '').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        
        {/* 작성자 정보 및 시간 */}
        <div className="flex-grow">
          <Link to={`/profile/${post.username}`} className="font-medium text-gray-900 hover:text-indigo-600 block">
            {post.nickname || post.username}
          </Link>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>
      
      {/* 게시글 제목 */}
      <Link to={`/posts/${post.id}`} className="block">
        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 mb-2">
          {post.title}
        </h3>
      </Link>
      
      {/* 게시글 내용 (compact 모드에서는 생략) */}
      {variant !== 'compact' && renderContent()}
      
      {/* 게시글 태그 */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          {post.tags.map(tag => (
            <Link
              key={tag}
              to={`/posts/tags/${tag}`}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* 게시글 이미지 */}
      {post.imageUrl && (
        <div className="mt-3 mb-3 rounded-lg overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full object-cover"
            style={{ maxHeight: '300px' }}
          />
        </div>
      )}
      
      {/* 게시글 액션 버튼 */}
      {showActions && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <PostActions
            postId={post.id}
            isLiked={post.isLiked || isLiked}
            isBookmarked={post.isBookmarked || isBookmarked}
            likeCount={post.likeCount || 0}
            bookmarkCount={post.bookmarkCount || 0}
            commentCount={post.commentCount || commentCount || 0}
            onLikeClick={(id, newStatus) => onLikeClick && onLikeClick(id, newStatus)}
            onBookmarkClick={(id, newStatus) => onBookmarkClick && onBookmarkClick(id, newStatus)}
            onCommentClick={(id) => onCommentClick && onCommentClick(id)}
            size="md"
            className="justify-center"
          />
        </div>
      )}
    </Card>
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
    profileImage: PropTypes.string,
    createdAt: PropTypes.string,
    imageUrl: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    likeCount: PropTypes.number,
    bookmarkCount: PropTypes.number,
    commentCount: PropTypes.number,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
  }).isRequired,
  /** 카드 스타일 변형 */
  variant: PropTypes.oneOf(['default', 'compact', 'featured', 'outline']),
  /** 액션 버튼 표시 여부 */
  showActions: PropTypes.bool,
  /** 내용 전체 표시 여부 */
  showFullContent: PropTypes.bool,
  /** 좋아요 상태 (post 객체에 없는 경우 사용) */
  isLiked: PropTypes.bool,
  /** 북마크 상태 (post 객체에 없는 경우 사용) */
  isBookmarked: PropTypes.bool,
  /** 좋아요 클릭 핸들러 */
  onLikeClick: PropTypes.func,
  /** 북마크 클릭 핸들러 */
  onBookmarkClick: PropTypes.func,
  /** 댓글 클릭 핸들러 */
  onCommentClick: PropTypes.func,
  /** 댓글 개수 (post 객체에 없는 경우 사용) */
  commentCount: PropTypes.number,
  /** 추가 클래스 */
  className: PropTypes.string,
  /** 클릭 핸들러 */
  onClick: PropTypes.func,
};

export default PostCard;
