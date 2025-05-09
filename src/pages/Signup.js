import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        nickname: '',
        gender: '',
        birth: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.signup(formData);
            navigate('/login', { state: { message: '회원가입이 완료되었습니다! 로그인해주세요.' } });
        } catch (err) {
            setError(err.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
                        계정 만들기
                    </h2>
                    <p className="mt-2 text-center text-sm text-black">
                        또는{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            기존 계정으로 로그인
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">아이디</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="아이디"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="nickname" className="sr-only">닉네임</label>
                            <input
                                id="nickname"
                                name="nickname"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="닉네임"
                                value={formData.nickname}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">이메일 주소</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="이메일 주소"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">비밀번호</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="sr-only">성별</label>
                            <select
                                id="gender"
                                name="gender"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                <option value="">성별 선택</option>
                                <option value="M">남성</option>
                                <option value="F">여성</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="birth" className="sr-only">생년월일</label>
                            <input
                                id="birth"
                                name="birth"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black bg-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formData.birth}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            disabled={isLoading}
                        >
                            {isLoading ? '가입 중...' : '회원가입'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup; 