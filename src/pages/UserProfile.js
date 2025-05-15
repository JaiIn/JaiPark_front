import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import useFollow from '../hooks/useFollow';
import FollowButton from '../components/profile/FollowButton';
import FollowList from '../components/profile/FollowList';
import { chatService } from '../services/chatService';
import { FaComments } from 'react-icons/fa';

const UserProfile = () => {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  const followHook = useFollow(username);
  const { followStatus, followers, following, fetchStatus, fetchFollowers, fetchFollowing, follow, unfollow } = followHook;

  // 채팅방 생성 및 이동
  const startChat = async () => {
    try {
      const chatRoom = await chatService.createOrGetChatRoom(username);
      navigate('/chat');
    } catch (error) {
      console.error('채팅방 생성 오류:', error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const profile = await userService.getUserProfile(username);
      console.log('UserProfile userData:', profile);
      setUser(profile);
      await fetchStatus();
    } catch {
      setError('유저 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    setShowFollowers(false);
    setShowFollowing(false);
  }, [username]);

  const handleShowFollowers = async () => {
    if (!showFollowers) {
      await fetchFollowers();
    }
    setShowFollowers(!showFollowers);
    setShowFollowing(false);
  };
  const handleShowFollowing = async () => {
    if (!showFollowing) {
      await fetchFollowing();
    }
    setShowFollowing(!showFollowing);
    setShowFollowers(false);
  };

  if (loading) return <div className="text-center py-8 text-black text-lg font-bold">로딩 중...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-100 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center gap-8">
        <div className="flex items-center gap-8 w-full">
          <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
            {user.profileImage ? (
              <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-black mb-1">{user.nickname || user.username}</h1>
            <div className="text-black font-semibold">@{user.username}</div>
            <div className="text-black font-semibold">{user.email}</div>
            <div className="flex items-center gap-4 mt-2">
              <button className="text-blue-500 hover:underline" onClick={handleShowFollowers}>
                팔로워 {followStatus.followerCount}
              </button>
              <button className="text-blue-500 hover:underline" onClick={handleShowFollowing}>
                팔로잉 {followStatus.followingCount}
              </button>
            </div>
            <div className="mt-4 flex space-x-4">
              {me && me.username !== username && (
                <>
                  <FollowButton isFollowing={followStatus.isFollowing} onFollow={follow} onUnfollow={unfollow} />
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                    onClick={startChat}
                  >
                    <FaComments />
                    <span>메시지 보내기</span>
                  </button>
                </>
              )}
              <button className="text-blue-500 hover:underline" onClick={() => navigate(-1)}>돌아가기</button>
            </div>
          </div>
        </div>
        <FollowList title="팔로워 목록" users={followers} visible={showFollowers} />
        <FollowList title="팔로잉 목록" users={following} visible={showFollowing} />
      </div>
    </div>
  );
};

export default UserProfile;