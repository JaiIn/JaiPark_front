import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import PostList from '../post/PostList';
import ProfileTabs from '../profile/ProfileTabs';
import ProfileCard from '../profile/ProfileCard';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(true);
    const { user } = useAuth();
    const query = useQuery();
    const searchKeyword = query.get('search') || '';

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            let data;
            if (searchKeyword.trim()) {
                data = await postService.searchPosts(searchKeyword);
            } else {
                data = await postService.getPosts();
            }
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('게시글 로딩 실패:', error);
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!showProfile) {
            loadPosts();
        }
        // eslint-disable-next-line
    }, [searchKeyword, showProfile]);

    return (
        <div className="p-4">
            <div className="tabs mb-4">
                <a
                    className={`tab tab-bordered ${showProfile ? 'tab-active' : ''}`}
                    onClick={() => setShowProfile(true)}
                >
                    내 정보
                </a>
                <a
                    className={`tab tab-bordered ${!showProfile ? 'tab-active' : ''}`}
                    onClick={() => setShowProfile(false)}
                >
                    자유 게시판
                </a>
            </div>
            {showProfile ? (
                user ? (
                    <>
                        <ProfileCard user={user} />
                        <ProfileTabs user={user} />
                    </>
                ) : (
                    <div className="text-center text-gray-500">로그인이 필요합니다.</div>
                )
            ) : isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <PostList posts={Array.isArray(posts) ? posts : []} onPostUpdate={loadPosts} />
            )}
        </div>
    );
};

export default Home; 