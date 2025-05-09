import React from 'react';
import { Link } from 'react-router-dom';

const PostListItem = ({ post }) => (
    <tr className="hover:bg-neutral-100">
        <td className="px-6 py-4 whitespace-nowrap">
            <Link to={`/posts/${post.id}`} className="text-primary-700 hover:text-primary-900 font-bold transition-colors">
                {post.title}
            </Link>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-neutral-900 font-semibold">{post.username}</td>
        <td className="px-6 py-4 whitespace-nowrap text-neutral-900">{new Date(post.createdAt).toLocaleDateString()}</td>
    </tr>
);

export default PostListItem; 