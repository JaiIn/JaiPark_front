import React from 'react';
import { Link } from 'react-router-dom';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const PostTable = ({ posts, onDelete, onLike, onBookmark, isLiked, isBookmarked }) => {
    return (
        <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">게시글 목록</h2>
                <Link 
                    to="/posts/new" 
                    className="px-5 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
                >
                    새 글 작성
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                    <TableHeader />
                    <TableBody 
                        posts={posts}
                        onDelete={onDelete}
                        onLike={onLike}
                        onBookmark={onBookmark}
                        isLiked={isLiked}
                        isBookmarked={isBookmarked}
                    />
                </table>
            </div>
        </div>
    );
};

export default PostTable; 