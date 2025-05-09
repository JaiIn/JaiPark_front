import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    postService.getFollowingsPosts()
      .then(setPosts)
      .catch(() => setError('게시글을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="text-center py-8 text-black text-lg font-bold">로딩 중...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-black mb-6">팔로우한 사람들의 게시글</h1>
      {posts.length === 0 ? (
        <div className="text-center py-8 text-black">게시글이 없습니다.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition">
              <Link to={`/posts/${post.id}`} className="text-primary-700 hover:text-primary-900 font-bold text-xl mb-2 transition-colors">
                {post.title}
              </Link>
              <div className="text-sm text-black mb-2 line-clamp-2">{post.content}</div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>작성자: {post.nickname || post.username}</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 