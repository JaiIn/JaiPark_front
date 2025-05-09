import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchKeyword, setSearchKeyword] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/posts?search=${encodeURIComponent(searchKeyword.trim())}`);
        }
    };

    return (
        <nav className="bg-white shadow mb-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/home" className="text-2xl font-bold text-indigo-600">JaiPark</Link>
                    
                    <div className="flex-1 max-w-xl mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="게시글 제목 검색"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)}
                            />
                            <button 
                                type="submit" 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                            >
                                <FaSearch className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/posts" className="text-gray-700 hover:text-indigo-600 font-medium">자유 게시판</Link>
                                <Link to="/mypage" className="text-indigo-600 hover:text-indigo-800 font-medium">내 정보</Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">로그인</Link>
                                <Link to="/signup" className="text-gray-700 hover:text-indigo-600 font-medium">회원가입</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 