import { commentApi } from '../api/commentApi';

export const commentService = {
    // 댓글 목록 조회
    getComments: async (postId) => {
        const response = await commentApi.getComments(postId);
        return response.data;
    },

    // 댓글 작성
    createComment: async (postId, content) => {
        const token = localStorage.getItem('token');
        const response = await commentApi.createComment(postId, { content }, token);
        return response.data;
    },

    // 댓글 수정
    updateComment: async (postId, commentId, content) => {
        const token = localStorage.getItem('token');
        const response = await commentApi.updateComment(postId, commentId, { content }, token);
        return response.data;
    },

    // 댓글 삭제
    deleteComment: async (postId, commentId) => {
        const token = localStorage.getItem('token');
        await commentApi.deleteComment(postId, commentId, token);
    },

    getMyComments: async () => {
        const token = localStorage.getItem('token');
        const response = await commentApi.getMyComments(token);
        return response.data;
    },
}; 