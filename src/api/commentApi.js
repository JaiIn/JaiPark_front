import axios from 'axios';
import { API_URL, getAuthHeader } from './config';

export const commentApi = {
    // 게시글의 댓글 목록 조회
    getComments: (postId) => {
        return axios.get(`${API_URL}/posts/${postId}/comments`);
    },

    // 댓글 작성
    createComment: (postId, data, token) => {
        return axios.post(`${API_URL}/posts/${postId}/comments`, data, getAuthHeader(token));
    },

    // 댓글 수정
    updateComment: (postId, commentId, data, token) => {
        return axios.put(`${API_URL}/posts/${postId}/comments/${commentId}`, data, getAuthHeader(token));
    },

    // 댓글 삭제
    deleteComment: (postId, commentId, token) => {
        return axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`, getAuthHeader(token));
    },

    // 사용자의 댓글 목록 조회
    getMyComments: (token) => {
        return axios.get(`${API_URL}/posts/0/comments/my`, getAuthHeader(token));
    }
}; 