import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import PostTable from '../components/posts/PostTable';
import Pagination from '../components/posts/Pagination';

// 상태 관리를 위한 리듀서
const postReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
        posts: action.payload.content,
        totalPages: action.payload.totalPages,
      };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'RESET_PAGE':
      return { ...state, currentPage: 0 };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const PostList = () => {
  // 초기 상태
  const initialState = {
    posts: [],
    currentPage: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
  };

  // useReducer를 사용한 상태 관리
  const [state, dispatch] = useReducer(postReducer, initialState);
  const { posts, currentPage, totalPages, isLoading, error } = state;

  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search');

  // 게시글 가져오기 함수를 useCallback으로 최적화
  const fetchPosts = useCallback(async (page) => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const response = searchKeyword
        ? await postService.searchPosts(searchKeyword, page)
        : await postService.getPosts(page);
      dispatch({ type: 'FETCH_SUCCESS', payload: response });
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
      dispatch({ type: 'FETCH_FAILURE', payload: error.message });
    }
  }, [searchKeyword]);

  // 키셋 페이지네이션을 위한 커서 기반 게시글 가져오기
  const fetchPostsWithCursor = useCallback(async (lastPostId = null) => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const response = await postService.getPostsWithCursor(lastPostId, 20);
      dispatch({ 
        type: 'FETCH_SUCCESS', 
        payload: {
          content: response,
          totalPages: Math.ceil(response.length / 20) // 임시 계산, 실제로는 API에서 제공해야 함
        } 
      });
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
      dispatch({ type: 'FETCH_FAILURE', payload: error.message });
    }
  }, []);
  
  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
  }, []);

  // 검색어가 변경되면 페이지 초기화
  useEffect(() => {
    dispatch({ type: 'RESET_PAGE' });
    fetchPosts(0);
  }, [searchKeyword, fetchPosts]);

  // 페이지가 변경되면 해당 페이지의 게시글 가져오기
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  // 제목 메모이제이션
  const pageTitle = useMemo(() => {
    return searchKeyword ? `"${searchKeyword}" 검색 결과` : '자유 게시판';
  }, [searchKeyword]);

  // 아무 게시글이 없는 경우 메시지 메모이제이션
  const emptyMessage = useMemo(() => {
    return searchKeyword ? '검색 결과가 없습니다.' : '게시글이 없습니다.';
  }, [searchKeyword]);

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">{pageTitle}</h1>
        {isAuthenticated && (
          <Link
            to="/posts/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            글쓰기
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>오류가 발생했습니다: {error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-black">{emptyMessage}</div>
      ) : (
        <>
          <PostTable posts={posts} />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(PostList);