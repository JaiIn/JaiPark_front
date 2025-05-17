/**
 * 홈 페이지 컴포넌트
 * - 사용자의 팔로잉 게시글 및 최신 게시글 표시
 */

import React, { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaUser } from 'react-icons/fa';

// 컴포넌트
import { Card, LoadingSpinner, Alert } from '../components/ui';
import { PostList } from '../components/post';

// 컨텍스트
import { useAuth } from '../context/AuthContext';

// 커스텀 훅
import { usePagination } from '../hooks/common/dataHooks';
import { useHomeData } from '../hooks/home/useHomeData';
import { usePostInteractions } from '../hooks/interaction/usePostInteractions';

/**
 * Home 페이지 컴포넌트
 * @returns {JSX.Element} 홈 페이지 컴포넌트
 */
const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 홈 데이터 로드
  const { homeData, loading, error, loadHomeData, totalFollowingPosts } = useHomeData();
  
  // 게시글 상호작용 (좋아요, 북마크)
  const { likedPostIds, bookmarkedPostIds, handleLike, handleBookmark } = usePostInteractions(
    homeData.followingPosts
  );
  
  // 페이지네이션
  const { currentPage, totalPages, setTotalItems, goToPage } = usePagination(0, 10);
  
  // 총 게시글 수 설정
  useEffect(() => {
    setTotalItems(totalFollowingPosts);
  }, [totalFollowingPosts, setTotalItems]);
  
  // 환영 메시지
  const welcomeMessage = useMemo(() => {
    return user ? `안녕하세요, ${user.nickname || user.username}님!` : '홈';
  }, [user]);
  
  // 전체 화면 로딩 중 표시
  if (loading && !homeData.followingPosts.length) {
    return <LoadingSpinner size="xl" fullScreen message="콘텐츠를 불러오는 중입니다..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-black mb-6">{welcomeMessage}</h1>
      
      {/* 오류 메시지 */}
      {error && (
        <Alert 
          type="error" 
          title="데이터 로드 오류" 
          message={error}
          dismissible
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 영역 */}
        <div className="lg:col-span-2">
          <PostList
            title="팔로우한 사람들의 게시글"
            posts={homeData.followingPosts}
            loading={loading}
            emptyMessage="팔로우한 사람들의 게시글이 없습니다."
            emptyAction={
              <Link to="/posts" className="text-indigo-600 hover:text-indigo-800 font-medium">
                모든 게시글 보기
              </Link>
            }
            showPagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            postCardVariant="default"
            onPostLike={handleLike}
            onPostBookmark={handleBookmark}
            likedPosts={likedPostIds}
            bookmarkedPosts={bookmarkedPostIds}
          />
        </div>
        
        {/* 사이드바 영역 */}
        <div className="space-y-6">
          {/* 최신 게시글 섹션 */}
          <Card
            header={<h3 className="text-xl font-bold text-gray-800">최신 게시글</h3>}
          >
            {homeData.latestPosts && homeData.latestPosts.length > 0 ? (
              <ul className="space-y-3">
                {homeData.latestPosts.map(post => (
                  <li key={post.id}>
                    <Link 
                      to={`/posts/${post.id}`}
                      className="text-indigo-600 hover:text-indigo-800 line-clamp-1 block"
                    >
                      {post.title}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {post.nickname || post.username} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">최신 게시글이 없습니다.</p>
            )}
            <div className="mt-4">
              <Link 
                to="/posts" 
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-block"
              >
                모든 게시글 보기 &rarr;
              </Link>
            </div>
          </Card>
          
          {/* 바로가기 링크 섹션 */}
          <Card header={<h3 className="text-xl font-bold text-gray-800">바로가기</h3>}>
            <div className="space-y-2">
              <Link 
                to="/posts/new"
                className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-center hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> 새 글 작성하기
              </Link>
              <Link 
                to="/mypage"
                className="block w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-center hover:bg-gray-200 transition flex items-center justify-center"
              >
                <FaUser className="mr-2" /> 내 프로필
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// 불필요한 리렌더링 방지를 위한 메모이제이션
export default React.memo(Home);
