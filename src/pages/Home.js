import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { useNavigate } from 'react-router-dom';

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
        <ul className="divide-y divide-neutral-200">
          {posts.map(post => (
            <li key={post.id} className="py-3 hover:bg-neutral-100 rounded-lg transition">
              <a href={`/posts/${post.id}`} className="block">
                <div className="font-bold text-black">{post.title}</div>
                <div className="text-sm text-black mt-1">{post.content}</div>
                <div className="text-xs text-gray-500 mt-1">작성자: {post.username}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home; 