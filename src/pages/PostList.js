import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import PostTable from '../components/posts/PostTable';
import Pagination from '../components/posts/Pagination';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get('search');

    const fetchPosts = async (page) => {
        try {
            setIsLoading(true);
            const response = searchKeyword
                ? await postService.searchPosts(searchKeyword, page)
                : await postService.getPosts(page);
            setPosts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('게시글을 불러오는데 실패했습니다:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(0);
        fetchPosts(0);
    }, [searchKeyword]);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mx-auto px-4 py-8 text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">
                    {searchKeyword ? `"${searchKeyword}" 검색 결과` : '자유 게시판'}
                </h1>
                {isAuthenticated && (
                    <Link
                        to="/posts/new"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        글쓰기
                    </Link>
                )}
            </div>

            {isLoading ? (
                <div className="text-center py-4 text-black">로딩 중...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-8 text-black">
                    {searchKeyword ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
                </div>
            ) : (
                <>
                    <PostTable posts={posts} />
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default PostList; 