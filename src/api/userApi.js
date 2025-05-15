import axios from 'axios';
import { API_URL } from './config';

// 인증 헤더 가져오기 함수 수정
const getAuthHeader = (token) => {
  // 토큰이 없어도 오류 발생하지 않도록 수정
  if (!token) {
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const userApi = {
  getMe: (token) => {
    try {
      return axios.get(`${API_URL}/users/me`, getAuthHeader(token));
    } catch (error) {
      console.error('getMe API 호출 중 오류:', error);
      throw error;
    }
  },
  updateMe: (data, token) => axios.put(`${API_URL}/users/me`, data, getAuthHeader(token)),
  changePassword: (data, token) => axios.put(`${API_URL}/users/me/password`, data, getAuthHeader(token)),
  getUserProfile: (username, token) => axios.get(`${API_URL}/users/${username}`, getAuthHeader(token)),
  follow: (username, token) => axios.post(`${API_URL}/users/${username}/follow`, {}, getAuthHeader(token)),
  unfollow: (username, token) => axios.delete(`${API_URL}/users/${username}/follow`, getAuthHeader(token)),
  getFollowing: (username, token) => axios.get(`${API_URL}/users/${username}/following`, getAuthHeader(token)),
  getFollowers: (username, token) => axios.get(`${API_URL}/users/${username}/followers`, getAuthHeader(token)),
  getFollowStatus: (username, token) => axios.get(`${API_URL}/users/${username}/follow-status`, getAuthHeader(token)),
}; 