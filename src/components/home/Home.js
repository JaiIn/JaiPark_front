import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import PostList from '../post/PostList';
import ProfileTabs from '../profile/ProfileTabs';
import ProfileCard from '../profile/ProfileCard';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(true);
    const [likedPosts, setLikedPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const { user, isAuthenticated } = useAuth();
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

    // 사용자의 좋아요 및 북마크 상태 로딩
    const loadUserInteractions = async () => {
        if (!isAuthenticated) return;
        
        try {
            // 좋아요 상태 로딩
            const likedData = await postService.getLikedPosts();
            if (Array.isArray(likedData)) {
                setLikedPosts(likedData.map(post => post.id));
            }
            
            // 북마크 상태 로딩
            const bookmarkedData = await postService.getBookmarkedPosts();
            if (Array.isArray(bookmarkedData)) {
                setBookmarkedPosts(bookmarkedData.map(post => post.id));
            }
        } catch (error) {
            console.error('사용자 상호작용 로딩 실패:', error);
        }
    };
    
    // 게시글 좋아요 처리
    const handlePostLike = async (postId, newStatus) => {
        if (!isAuthenticated) return;
        
        try {
            // 서버에 좋아요 상태 업데이트 요청
            await postService.toggleLike(postId);
            
            // UI 상태 업데이트 (낙관적 업데이트)
            if (newStatus) {
                setLikedPosts(prev => [...prev, postId]);
            } else {
                setLikedPosts(prev => prev.filter(id => id !== postId));
            }
            
            // 게시글 목록 업데이트 (좋아요 수 반영)
            setPosts(prev => {
                return prev.map(post => {
                    if (post.id === postId) {
                        const likeCount = post.likeCount || 0;
                        return {
                            ...post,
                            likeCount: newStatus ? likeCount + 1 : Math.max(likeCount - 1, 0),
                            isLiked: newStatus
                        };
                    }
                    return post;
                });
            });
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            toast.error('좋아요 처리 중 오류가 발생했습니다.');
        }
    };
    
    // 게시글 북마크 처리
    const handlePostBookmark = async (postId, newStatus) => {
        if (!isAuthenticated) return;
        
        try {
            // 서버에 북마크 상태 업데이트 요청
            await postService.toggleBookmark(postId);
            
            // UI 상태 업데이트 (낙관적 업데이트)
            if (newStatus) {
                setBookmarkedPosts(prev => [...prev, postId]);
            } else {
                setBookmarkedPosts(prev => prev.filter(id => id !== postId));
            }
            
            // 게시글 목록 업데이트 (북마크 수 반영)
            setPosts(prev => {
                return prev.map(post => {
                    if (post.id === postId) {
                        const bookmarkCount = post.bookmarkCount || 0;
                        return {
                            ...post,
                            bookmarkCount: newStatus ? bookmarkCount + 1 : Math.max(bookmarkCount - 1, 0),
                            isBookmarked: newStatus
                        };
                    }
                    return post;
                });
            });
        } catch (error) {
            console.error('북마크 처리 실패:', error);
            toast.error('북마크 처리 중 오류가 발생했습니다.');
        }
    };
    
    useEffect(() => {
        if (!showProfile) {
            loadPosts();
            if (isAuthenticated) {
                loadUserInteractions();
            }
        }
        // eslint-disable-next-line
    }, [searchKeyword, showProfile, isAuthenticated]);

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
                <PostList 
                    posts={Array.isArray(posts) ? posts : []} 
                    onPostUpdate={loadPosts}
                    likedPosts={likedPosts}
                    bookmarkedPosts={bookmarkedPosts}
                    onPostLike={handlePostLike}
                    onPostBookmark={handlePostBookmark}
                />
            )}
        </div>
    );
};

export default Home; 