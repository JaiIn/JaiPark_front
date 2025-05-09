import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import PostTable from '../posts/PostTable';

const TABS = [
    { key: 'posts', label: '내가 쓴 글' },
    { key: 'comments', label: '내가 쓴 댓글' },
    { key: 'liked', label: '좋아요한 글' },
    { key: 'bookmarked', label: '북마크한 글' },
];

const ProfileTabs = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTabData(activeTab);
        // eslint-disable-next-line
    }, [activeTab]);

    const fetchTabData = async (tab) => {
        setLoading(true);
        try {
            if (tab === 'posts') {
                setPosts(await userService.getMyPosts());
            } else if (tab === 'comments') {
                setComments(await userService.getMyComments());
            } else if (tab === 'liked') {
                setLikedPosts(await userService.getLikedPosts());
            } else if (tab === 'bookmarked') {
                setBookmarkedPosts(await userService.getBookmarkedPosts());
            }
        } catch (e) {
            // 에러 처리
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mt-12">
            <div className="flex justify-center mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`mx-2 px-6 py-2 rounded-full text-lg font-semibold transition border-2 focus:outline-none
                            ${activeTab === tab.key
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="border-t border-gray-200 mb-4"></div>
            <div className="bg-white rounded-lg shadow p-4 min-h-[120px]">
                {loading ? (
                    <div className="text-center py-4">로딩 중...</div>
                ) : (
                    <>
                        {activeTab === 'posts' && <PostTable posts={posts} />}
                        {activeTab === 'comments' && (
                            <ul className="divide-y">
                                {comments.map((c) => (
                                    <li key={c.id} className="py-2">
                                        <span className="font-bold">{c.content}</span>
                                        <span className="ml-2 text-gray-500 text-sm">({c.createdAt && new Date(c.createdAt).toLocaleString()})</span>
                                        <span className="ml-2 text-gray-400 text-xs">글ID: {c.postId || '-'}</span>
                                    </li>
                                ))}
                                {comments.length === 0 && <div className="text-center text-gray-400">댓글이 없습니다.</div>}
                            </ul>
                        )}
                        {activeTab === 'liked' && <PostTable posts={likedPosts} />}
                        {activeTab === 'bookmarked' && <PostTable posts={bookmarkedPosts} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileTabs; 