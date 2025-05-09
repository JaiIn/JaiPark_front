import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaTrash, FaEdit } from 'react-icons/fa';
import '../../styles/common.css';

const PostDetail = ({ post, onDelete, onLike, onBookmark, isLiked, isBookmarked }) => {
    const navigate = useNavigate();

    if (!post) return null;

    return (
        <div className="modern-card p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="modern-heading-1">{post.title}</h1>
                    <div className="flex items-center space-x-4 mt-2" style={{ color: 'var(--text-secondary)' }}>
                        <span>작성자: {post.author?.nickname || post.author?.username || post.author}</span>
                        <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>조회수: {post.viewCount}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onLike(post.id)}
                        className="p-2 rounded-full hover:bg-red-50 transition-colors"
                        style={{ color: isLiked(post.id) ? 'var(--danger)' : 'var(--text-secondary)' }}
                    >
                        {isLiked(post.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button
                        onClick={() => onBookmark(post.id)}
                        className="p-2 rounded-full hover:bg-yellow-50 transition-colors"
                        style={{ color: isBookmarked(post.id) ? 'var(--warning)' : 'var(--text-secondary)' }}
                    >
                        {isBookmarked(post.id) ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                    <Link
                        to={`/posts/${post.id}/edit`}
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                        style={{ color: 'var(--info)' }}
                    >
                        <FaEdit />
                    </Link>
                    <button
                        onClick={() => onDelete(post.id)}
                        className="p-2 rounded-full hover:bg-red-50 transition-colors"
                        style={{ color: 'var(--danger)' }}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
            <div 
                className="prose max-w-none mb-8 p-4 rounded-lg"
                style={{ 
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-primary)'
                }}
            >
                {post.content}
            </div>
            <div className="flex justify-between items-center">
                <Link 
                    to="/posts"
                    className="modern-button modern-button-secondary"
                >
                    목록으로
                </Link>
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="modern-button modern-button-secondary"
                    >
                        이전
                    </button>
                    <button
                        onClick={() => navigate(1)}
                        className="modern-button modern-button-secondary"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail; 