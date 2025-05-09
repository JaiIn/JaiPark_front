import React from 'react';
import { Link } from 'react-router-dom';

const AuthLinks = ({ isAuthenticated, onLogout }) => {
    return (
        <div className="flex items-center space-x-4">
            {isAuthenticated ? (
                <>
                    <Link to="/mypage" className="px-4 py-2 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition">
                        마이페이지
                    </Link>
                    <button 
                        onClick={onLogout} 
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition">
                        로그인
                    </Link>
                    <Link 
                        to="/signup" 
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition"
                    >
                        회원가입
                    </Link>
                </>
            )}
        </div>
    );
};

export default AuthLinks; 