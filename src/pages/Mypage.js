import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { userService } from '../services/userService';
import profileDefault from '../assets/profile-default.png';

const Mypage = () => {
    const { user, isAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();
    const [myPosts, setMyPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllMyPosts, setShowAllMyPosts] = useState(false);
    const [showAllMyComments, setShowAllMyComments] = useState(false);
    const [showAllLikedPosts, setShowAllLikedPosts] = useState(false);
    const [showAllBookmarkedPosts, setShowAllBookmarkedPosts] = useState(false);
    const [error, setError] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowings, setShowFollowings] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // 내 정보 최신화
        const fetchUserInfo = async () => {
            try {
                const userInfo = await userService.getMe();
                if (userInfo) {
                    setUser(userInfo);
                }
            } catch (e) {}
        };
        fetchUserInfo();

        const fetchUserData = async () => {
            if (!user?.username) return;

            try {
                setIsLoading(true);
                const [posts, liked, bookmarked, comments] = await Promise.all([
                    postService.getPostsByUsername(user.username),
                    postService.getLikedPosts(user.username),
                    postService.getBookmarkedPosts(user.username),
                    commentService.getCommentsByUsername(user.username)
                ]);
                setMyPosts(posts);
                setLikedPosts(liked);
                setBookmarkedPosts(bookmarked);
                setMyComments(comments);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('데이터를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.username) {
            fetchUserData();
        }
    }, [isAuthenticated, navigate, user]);

    if (!user) {
        return <div className="text-center py-8 text-black text-lg font-bold">사용자 정보를 불러오는 중...</div>;
    }

    if (isLoading) {
        return <div className="text-center py-8 text-black text-lg font-bold">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-100 py-10">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* 프로필 */}
                <section className="bg-white shadow-xl rounded-2xl p-8 flex items-center gap-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg">
                        <img
                            src={user.profileImage || profileDefault}
                            alt="프로필"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    <div className="flex-1">
                        <div className="text-3xl font-extrabold text-black mb-1">닉네임: {user.nickname}</div>
                        <div className="text-black font-semibold">아이디: {user.username}</div>
                        <div className="text-black font-semibold">이메일: {user.email}</div>
                        <div className="flex gap-6 mt-2">
                            <button className="text-blue-600 font-bold hover:underline" onClick={() => setShowFollowers(true)}>
                                팔로워 {user.followerCount ?? (user.followers ? user.followers.length : 0)}
                            </button>
                            <button className="text-blue-600 font-bold hover:underline" onClick={() => setShowFollowings(true)}>
                                팔로잉 {user.followingCount ?? (user.followings ? user.followings.length : 0)}
                            </button>
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold transition-colors"
                            onClick={() => navigate('/mypage/edit')}
                        >
                            내 정보 수정
                        </button>
                    </div>
                </section>

                {/* 팔로워/팔로잉 모달 */}
                {showFollowers && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-80 max-h-[60vh] overflow-y-auto">
                            <h3 className="text-black font-bold mb-4">팔로워 목록</h3>
                            <ul>
                                {(user.followers || []).map(f => (
                                    <li key={f.username} className="py-2 border-b last:border-b-0 text-black">{f.nickname || f.username}</li>
                                ))}
                            </ul>
                            <button className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowFollowers(false)}>닫기</button>
                        </div>
                    </div>
                )}
                {showFollowings && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-80 max-h-[60vh] overflow-y-auto">
                            <h3 className="text-black font-bold mb-4">팔로잉 목록</h3>
                            <ul>
                                {(user.followings || []).map(f => (
                                    <li key={f.username} className="py-2 border-b last:border-b-0 text-black">{f.nickname || f.username}</li>
                                ))}
                            </ul>
                            <button className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowFollowings(false)}>닫기</button>
                        </div>
                    </div>
                )}

                {/* 컨텐츠 */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 내가 쓴 글 */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-black mb-4">내가 쓴 글</h2>
                        {myPosts.length === 0 ? (
                            <p className="text-black font-semibold">작성한 게시글이 없습니다.</p>
                        ) : (
                            <>
                            <ul className="divide-y divide-neutral-200">
                                {(showAllMyPosts ? myPosts : myPosts.slice(0, 3)).map(post => (
                                    <li key={post.id} className="py-3 hover:bg-neutral-100 rounded-lg transition">
                                        <a href={`/posts/${post.id}`} className="block">
                                            <div className="font-bold text-black">{post.title}</div>
                                            <div className="text-sm text-black mt-1">{post.content}</div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {myPosts.length > 3 && (
                                <button
                                    className="mt-2 text-blue-500 hover:underline"
                                    onClick={() => setShowAllMyPosts(!showAllMyPosts)}
                                >
                                    {showAllMyPosts ? '접기' : '더보기'}
                                </button>
                            )}
                            </>
                        )}
                    </div>
                    {/* 내가 쓴 댓글 */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-black mb-4">내가 쓴 댓글</h2>
                        {myComments.length === 0 ? (
                            <p className="text-black font-semibold">작성한 댓글이 없습니다.</p>
                        ) : (
                            <>
                            <ul className="divide-y divide-neutral-200">
                                {(showAllMyComments ? myComments : myComments.slice(0, 3)).map(comment => (
                                    <li
                                        key={comment.id}
                                        className="py-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                                        onClick={() => navigate(`/posts/${comment.postId}`)}
                                    >
                                        <div className="font-bold text-black">{comment.content}</div>
                                        <div className="text-sm text-black mt-1">
                                            원글: {comment.postTitle && comment.postTitle.trim() !== '' ? comment.postTitle : '제목 없음'}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {myComments.length > 3 && (
                                <button
                                    className="mt-2 text-blue-500 hover:underline"
                                    onClick={() => setShowAllMyComments(!showAllMyComments)}
                                >
                                    {showAllMyComments ? '접기' : '더보기'}
                                </button>
                            )}
                            </>
                        )}
                    </div>
                    {/* 좋아요한 글 */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-black mb-4">좋아요한 글</h2>
                        {likedPosts.length === 0 ? (
                            <p className="text-black font-semibold">좋아요한 게시글이 없습니다.</p>
                        ) : (
                            <>
                            <ul className="divide-y divide-neutral-200">
                                {(showAllLikedPosts ? likedPosts : likedPosts.slice(0, 3)).map(post => (
                                    <li key={post.id} className="py-3 hover:bg-neutral-100 rounded-lg transition">
                                        <a href={`/posts/${post.id}`} className="block">
                                            <div className="font-bold text-black">{post.title}</div>
                                            <div className="text-sm text-black mt-1">{post.content}</div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {likedPosts.length > 3 && (
                                <button
                                    className="mt-2 text-blue-500 hover:underline"
                                    onClick={() => setShowAllLikedPosts(!showAllLikedPosts)}
                                >
                                    {showAllLikedPosts ? '접기' : '더보기'}
                                </button>
                            )}
                            </>
                        )}
                    </div>
                    {/* 북마크한 글 */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-black mb-4">북마크한 글</h2>
                        {bookmarkedPosts.length === 0 ? (
                            <p className="text-black font-semibold">북마크한 게시글이 없습니다.</p>
                        ) : (
                            <>
                            <ul className="divide-y divide-neutral-200">
                                {(showAllBookmarkedPosts ? bookmarkedPosts : bookmarkedPosts.slice(0, 3)).map(post => (
                                    <li key={post.id} className="py-3 hover:bg-neutral-100 rounded-lg transition">
                                        <a href={`/posts/${post.id}`} className="block">
                                            <div className="font-bold text-black">{post.title}</div>
                                            <div className="text-sm text-black mt-1">{post.content}</div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {bookmarkedPosts.length > 3 && (
                                <button
                                    className="mt-2 text-blue-500 hover:underline"
                                    onClick={() => setShowAllBookmarkedPosts(!showAllBookmarkedPosts)}
                                >
                                    {showAllBookmarkedPosts ? '접기' : '더보기'}
                                </button>
                            )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Mypage; 