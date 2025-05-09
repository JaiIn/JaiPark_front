import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaBookmark } from 'react-icons/fa';

const PostList = ({ posts, onPostUpdate }) => {
    return (
        <div className="flex flex-col gap-4">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="p-5 bg-white shadow-md border border-gray-200 rounded-lg hover:shadow-lg transition-all"
                >
                    <Link to={`/posts/${post.id}`}>
                        <div className="text-lg font-bold mb-2 text-blue-700 hover:underline">
                            {post.title}
                        </div>
                    </Link>
                    <div className="text-gray-600 mb-3">
                        {post.content.length > 200
                            ? `${post.content.substring(0, 200)}...`
                            : post.content}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <span className="badge badge-info text-white">{post.username}</span>
                            <span className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <FaHeart className="text-red-500" />
                                <span className="text-sm">{post.likeCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaBookmark className="text-yellow-500" />
                                <span className="text-sm">{post.bookmarkCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList; 