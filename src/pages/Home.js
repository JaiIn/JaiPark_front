import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { useDataFetching, usePagination } from '../hooks/common/dataHooks';
import { LoadingSpinner, Alert } from '../components/common/UIComponents';
import PostList from '../components/posts/PostList';
import { FaPlus, FaUser } from 'react-icons/fa';

/**
 * 홈 페이지 컴포넌트
 * 사용자의 팔로잉 게시글 및 최신 게시글을 표시합니다.
 */
const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // 데이터 로딩 커스텀 훅 사용
  const { 
    data, 
    loading, 
    error, 
    fetchData: fetchHomeData 
  } = useDataFetching(postService.getHomePageData);
  
  // 데이터 구조 초기화
  const [homeData, setHomeData] = useState({
    latestPosts: [],
    followingPosts: [],
    notifications: []
  });
  
  // 페이지네이션 커스텀 훅 사용
  const { 
    currentPage, 
    totalPages, 
    setTotalItems, 
    goToPage 
  } = usePagination(0, 10);
  
  // 게시글 상호작용 상태
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);
  
  // 초기 데이터 로드
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      try {
        const result = await fetchHomeData();
        if (result) {
          setHomeData({
            latestPosts: Array.isArray(result.latestPosts) ? result.latestPosts : [],
            followingPosts: Array.isArray(result.followingPosts) ? result.followingPosts : [],
            notifications: Array.isArray(result.notifications) ? result.notifications : []
          });
          
          // 게시글에서 좋아요/북마크 상태 추출
          const likedIds = result.followingPosts
            ?.filter(post => post.isLiked)
            ?.map(post => post.id) || [];
            
          const bookmarkedIds = result.followingPosts
            ?.filter(post => post.isBookmarked)
            ?.map(post => post.id) || [];
            
          setLikedPostIds(likedIds);
          setBookmarkedPostIds(bookmarkedIds);
          
          // 총 게시글 수 설정
          const totalPosts = result.followingPosts?.length || 0;
          setTotalItems(totalPosts);
        }
      } catch (err) {
        // 에러는 useDataFetching 내부에서 처리됨
        console.error('홈 데이터 로드 실패:', err);
      }
    };
    
    loadData();
  }, [isAuthenticated, navigate, fetchHomeData, setTotalItems]);
  
  // 환영 메시지
  const welcomeMessage = useMemo(() => {
    return user ? `안녕하세요, ${user.nickname || user.username}님!` : '홈';
  }, [user]);
  
  // 좋아요 처리
  const handlePostLike = async (postId) => {
    try {
      await postService.toggleLike(postId);
      // 좋아요 상태 업데이트
      setLikedPostIds(prev => 
        prev.includes(postId) 
          ? prev.filter(id => id !== postId) 
          : [...prev, postId]
      );
    } catch (err) {
      console.error('좋아요 처리 중 오류:', err);
    }
  };
  
  // 북마크 처리
  const handlePostBookmark = async (postId) => {
    try {
      await postService.toggleBookmark(postId);
      // 북마크 상태 업데이트
      setBookmarkedPostIds(prev => 
        prev.includes(postId) 
          ? prev.filter(id => id !== postId) 
          : [...prev, postId]
      );
    } catch (err) {
      console.error('북마크 처리 중 오류:', err);
    }
  };
  
  // 전체 화면 로딩 중 표시
  if (loading && !homeData.followingPosts.length) {
    return <LoadingSpinner size="large" fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-black mb-6">{welcomeMessage}</h1>
      
      {error && (
        <Alert type="error" dismissible>
          <p>{error}</p>
        </Alert>
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
              <Link to="/posts" className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block">
                모든 게시글 보기
              </Link>
            }
            showPagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            postCardVariant="default"
            onPostLike={handlePostLike}
            onPostBookmark={handlePostBookmark}
            likedPosts={likedPostIds}
            bookmarkedPosts={bookmarkedPostIds}
          />
        </div>
        
        {/* 사이드바 영역 */}
        <div className="space-y-6">
          {/* 최신 게시글 섹션 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">최신 게시글</h3>
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
            <Link to="/posts" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-4 inline-block">
              모든 게시글 보기 &rarr;
            </Link>
          </div>
          
          {/* 바로가기 링크 섹션 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">바로가기</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

// 불필요한 리렌더링 방지를 위한 메모이제이션
export default React.memo(Home);
