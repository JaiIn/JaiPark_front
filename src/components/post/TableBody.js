import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaTrash, FaEdit } from 'react-icons/fa';

const TableBody = ({ posts, onDelete, onLike, onBookmark, isLiked, isBookmarked }) => {
    return (
        <tbody className="bg-white divide-y divide-neutral-200">
            {posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-100 transition-colors">
                    <td className="text-center px-4 py-3 text-black font-bold">{post.id}</td>
                    <td className="px-4 py-3">
                        <Link 
                            to={`/posts/${post.id}`}
                            className="text-black hover:text-primary-700 font-bold transition-colors"
                        >
                            {post.title}
                        </Link>
                    </td>
                    <td className="text-center px-4 py-3 text-black font-bold">{post.nickname || post.author || post.username}</td>
                    <td className="text-center px-4 py-3 text-black">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="text-center px-4 py-3 text-black">{post.viewCount}</td>
                    <td className="text-center px-4 py-3">
                        <button
                            onClick={() => onLike(post.id)}
                            className="p-2 rounded-full hover:bg-red-100 transition-colors"
                            style={{ color: isLiked(post.id) ? '#ef4444' : '#000' }}
                        >
                            {isLiked(post.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </td>
                    <td className="text-center px-4 py-3">
                        <button
                            onClick={() => onBookmark(post.id)}
                            className="p-2 rounded-full hover:bg-yellow-100 transition-colors"
                            style={{ color: isBookmarked(post.id) ? '#f59e0b' : '#000' }}
                        >
                            {isBookmarked(post.id) ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                    </td>
                    <td className="text-center px-4 py-3">
                        <div className="flex justify-center space-x-2">
                            <Link
                                to={`/posts/${post.id}/edit`}
                                className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                                style={{ color: '#3b82f6' }}
                            >
                                <FaEdit />
                            </Link>
                            <button
                                onClick={() => onDelete(post.id)}
                                className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                style={{ color: '#ef4444' }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default TableBody; 