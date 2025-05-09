import React from 'react';
import PostListItem from './PostListItem';

const PostTable = ({ posts }) => {
    const safePosts = Array.isArray(posts) ? posts : [];
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">작성자</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">작성일</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {safePosts.map((post) => (
                        <PostListItem key={post.id} post={post} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PostTable; 