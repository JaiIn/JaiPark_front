import axios from 'axios';
import { API_URL, getAuthHeader } from './config';

export const userApi = {
  getMe: (token) => axios.get(`${API_URL}/users/me`, getAuthHeader(token)),
  updateMe: (data, token) => axios.put(`${API_URL}/users/me`, data, getAuthHeader(token)),
  changePassword: (data, token) => axios.put(`${API_URL}/users/me/password`, data, getAuthHeader(token)),
  getUserProfile: (username, token) => axios.get(`${API_URL}/users/${username}`, getAuthHeader(token)),
  follow: (username, token) => axios.post(`${API_URL}/users/${username}/follow`, {}, getAuthHeader(token)),
  unfollow: (username, token) => axios.delete(`${API_URL}/users/${username}/follow`, getAuthHeader(token)),
  getFollowing: (username, token) => axios.get(`${API_URL}/users/${username}/following`, getAuthHeader(token)),
  getFollowers: (username, token) => axios.get(`${API_URL}/users/${username}/followers`, getAuthHeader(token)),
  getFollowStatus: (username, token) => axios.get(`${API_URL}/users/${username}/follow-status`, getAuthHeader(token)),
}; 