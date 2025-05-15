import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

const getUserFromToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return {
            username: decoded.sub,
            email: decoded.email,
        };
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                try {
                    const userInfo = await userService.getMe();
                    setUser(userInfo);
                } catch (e) {
                    console.error('AuthContext 사용자 정보 로드 중 오류:', e);
                    // 토큰에서 가져온 기본 정보로 대체
                    const tokenUser = getUserFromToken(token);
                    if (tokenUser) {
                        setUser(tokenUser);
                    } else {
                        // 토큰이 유효하지 않은 경우 인증 상태 초기화
                        setIsAuthenticated(false);
                        localStorage.removeItem('token');
                    }
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        const userInfo = await userService.getMe();
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Axios 인터셉터 설정
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 