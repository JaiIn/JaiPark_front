import axios from 'axios';
import { API_URL } from './config';

export const authApi = {
    // 로그인
    login: (username, password) => {
        return axios.post(`${API_URL}/auth/login`, { username, password });
    },

    // 회원가입
    signup: (userData) => {
        return axios.post(`${API_URL}/auth/signup`, userData);
    },

    // 사용자 정보 조회
    getUserInfo: (token) => {
        return axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}; 