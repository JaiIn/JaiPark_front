import axios from 'axios';
import { API_URL, getAuthHeader } from './config';

export const postApi = {
    // 게시글 목록 조회
    getPosts: (page = 0, size = 10) => {
        return axios.get(`${API_URL}/posts?page=${page}&size=${size}`);
    },

    // 게시글 상세 조회
    getPost: (id) => {
        return axios.get(`${API_URL}/posts/${id}`);
    },

    // 게시글 작성
    createPost: (data, token) => {
        return axios.post(`${API_URL}/posts`, data, getAuthHeader(token));
    },

    // 게시글 수정
    updatePost: (id, data, token) => {
        return axios.put(`${API_URL}/posts/${id}`, data, getAuthHeader(token));
    },

    // 게시글 삭제
    deletePost: (id, token) => {
        return axios.delete(`${API_URL}/posts/${id}`, getAuthHeader(token));
    },

    // 좋아요 상태 조회
    getLikeStatus: (id, token) => {
        return axios.get(`${API_URL}/posts/${id}/like`, getAuthHeader(token));
    },

    // 좋아요 토글
    toggleLike: (id, token) => {
        return axios.post(`${API_URL}/posts/${id}/like`, {}, getAuthHeader(token));
    },

    // 북마크 상태 조회
    getBookmarkStatus: (id, token) => {
        return axios.get(`${API_URL}/posts/${id}/bookmark`, getAuthHeader(token));
    },

    // 북마크 토글
    toggleBookmark: (id, token) => {
        return axios.post(`${API_URL}/posts/${id}/bookmark`, {}, getAuthHeader(token));
    },

    // 사용자의 게시글 조회
    getPostsByUsername: (token) => {
        return axios.get(`${API_URL}/posts/my`, getAuthHeader(token));
    },

    // 좋아요한 게시글 조회
    getLikedPosts: (token) => {
        return axios.get(`${API_URL}/posts/liked`, getAuthHeader(token));
    },

    // 북마크한 게시글 조회
    getBookmarkedPosts: (token) => {
        return axios.get(`${API_URL}/posts/bookmarked`, getAuthHeader(token));
    },

    // 게시글 검색
    searchPosts: (keyword, page = 0, size = 10) => {
        return axios.get(`${API_URL}/posts/search?keyword=${keyword}&page=${page}&size=${size}`);
    },

    // 팔로잉한 게시글 조회
    getFollowingsPosts: (token) => {
        return axios.get(`${API_URL}/posts/followings`, getAuthHeader(token));
    }
}; 