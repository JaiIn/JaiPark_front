import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState({ 
    latestPosts: [],
    followingPosts: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 배치로 모든 홈 화면 데이터 가져오기
  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      const homeData = await postService.getHomePageData();
      setData(homeData);
      setError('');
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 키셋 페이지네이션을 위한 상태와 함수
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);

  // 더 많은 게시글 불러오기 (무한 스크롤)
  const loadMorePosts = useCallback(async () => {
    if (!cursor && data.followingPosts.length > 0) return;
    
    try {
      let newCursor = cursor;
      
      // 첫 페이지가 아니면 마지막 게시글 정보로 커서 생성
      if (!newCursor && data.followingPosts.length > 0) {
        const lastPost = data.followingPosts[data.followingPosts.length - 1];
        newCursor = {
          createdAt: lastPost.createdAt,
          id: lastPost.id
        };
      }
      
      const result = await postService.getFollowingsPostsWithCursor(
        newCursor?.createdAt,
        newCursor?.id,
        10
      );
      
      // 새 게시글과 다음 커서 설정
      if (result.posts && result.posts.length > 0) {
        setData(prev => ({
          ...prev,
          followingPosts: [...prev.followingPosts, ...result.posts]
        }));
        
        setCursor(result.nextCursor);
        setHasMore(!!result.nextCursor);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  }, [cursor, data.followingPosts]);

  // 스크롤 이벤트 감지 함수
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= 
      document.documentElement.scrollHeight - 300 &&
      hasMore && 
      !loading
    ) {
      loadMorePosts();
    }
  }, [hasMore, loading, loadMorePosts]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchHomeData();
    
    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, navigate, fetchHomeData, handleScroll]);

  // 환영 메시지 메모이제이션
  const welcomeMessage = useMemo(() => {
    return user ? `안녕하세요, ${user.username}님! 오늘의 소식입니다.` : '홈';
  }, [user]);

  if (loading && !data.followingPosts.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-black mb-6">{welcomeMessage}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 영역 */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">팔로우한 사람들의 게시글</h2>
          
          {data.followingPosts.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-600">게시글이 없거나 아직 팔로우한 사용자가 없습니다.</p>
              <Link to="/posts" className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block">
                모든 게시글 보기
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.followingPosts.map(post => (
                <div key={post.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
                  <Link to={`/posts/${post.id}`} className="text-indigo-700 hover:text-indigo-900 font-bold text-xl mb-2 block">
                    {post.title}
                  </Link>
                  <p className="text-gray-700 line-clamp-2 mb-4">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>작성자: {post.nickname || post.username}</span>
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              )}
              
              {hasMore && !loading && (
                <button 
                  onClick={loadMorePosts}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  더 불러오기
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* 사이드바 영역 */}
        <div className="space-y-6">
          {/* 최신 게시글 섹션 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">최신 게시글</h3>
            {data.latestPosts && data.latestPosts.length > 0 ? (
              <ul className="space-y-3">
                {data.latestPosts.map(post => (
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
                className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-center hover:bg-indigo-700 transition"
              >
                새 글 작성하기
              </Link>
              <Link 
                to="/mypage" 
                className="block w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-center hover:bg-gray-200 transition"
              >
                내 프로필
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);