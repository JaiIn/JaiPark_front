import React from 'react';
import PostListItem from './PostListItem';

const TableBody = ({ posts }) => (
    <tbody className="bg-white divide-y divide-gray-200">
        {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
        ))}
    </tbody>
);

export default TableBody; 