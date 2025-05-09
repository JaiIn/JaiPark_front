import React from 'react';

const PostActions = ({ liked, likeCount, onLike, bookmarked, bookmarkCount, onBookmark, disabled }) => (
    <div className="flex items-center space-x-4 mb-4">
        <button
            onClick={onLike}
            disabled={disabled}
            className={`flex items-center px-3 py-1 rounded-full border transition
                ${liked ? 'border-pink-400' : 'border-neutral-300 hover:border-pink-300'}`}
        >
            <span className={`mr-1 text-xl ${liked ? 'text-red-500' : 'text-neutral-400'}`}>{liked ? '❤️' : '🤍'}</span>
            <span className="text-black">좋아요 <span className="ml-1">{likeCount}</span></span>
        </button>
        <button
            onClick={onBookmark}
            disabled={disabled}
            className={`flex items-center px-3 py-1 rounded-full border transition
                ${bookmarked ? 'border-yellow-400' : 'border-neutral-300 hover:border-yellow-300'}`}
        >
            <span className={`mr-1 text-xl ${bookmarked ? 'text-yellow-400' : 'text-neutral-400'}`}>{bookmarked ? '⭐' : '☆'}</span>
            <span className="text-black">북마크 <span className="ml-1">{bookmarkCount}</span></span>
        </button>
    </div>
);

export default PostActions; 