import axios from 'axios';
import { API_URL, getAuthHeader } from './config';

export const postApi = {
    // 게시글 목록 조회 (오프셋 페이지네이션)
    getPosts: (page = 0, size = 10) => {
        return axios.get(`${API_URL}/posts?page=${page}&size=${size}`);
    },
    
    // 키셋 페이지네이션을 이용한 게시글 목록 조회
    getPostsWithCursor: (lastPostId = null, limit = 20) => {
        const url = new URL(`${API_URL}/posts/cursor`);
        if (lastPostId) url.searchParams.set('lastPostId', lastPostId);
        url.searchParams.set('limit', limit);
        return axios.get(url.toString());
    },
    
    // 시간 기반 키셋 페이지네이션을 이용한 게시글 목록 조회
    getPostsWithTimeCursor: (createdAt = null, id = null, limit = 20) => {
        const url = new URL(`${API_URL}/posts/time-cursor`);
        if (createdAt) url.searchParams.set('createdAt', createdAt);
        if (id) url.searchParams.set('id', id);
        url.searchParams.set('limit', limit);
        return axios.get(url.toString());
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
    
    // 배치로 여러 게시글의 상태 조회
    getBatchPostsData: (postIds, token) => {
        return axios.post(`${API_URL}/posts/batch`, { postIds }, getAuthHeader(token));
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
    getPostsByUsername: (username, token) => {
        return axios.get(`${API_URL}/posts/my`, getAuthHeader(token));
    },

    // 사용자의 댓글 조회
    getCommentsByUsername: (username, token) => {
        return axios.get(`${API_URL}/comments/my`, getAuthHeader(token));
    },

    // 좋아요한 게시글 조회
    getLikedPosts: (username, token) => {
        return axios.get(`${API_URL}/posts/liked`, getAuthHeader(token));
    },

    // 북마크한 게시글 조회
    getBookmarkedPosts: (username, token) => {
        return axios.get(`${API_URL}/posts/bookmarked`, getAuthHeader(token));
    },

    // 게시글 검색
    searchPosts: (keyword, page = 0, size = 10) => {
        return axios.get(`${API_URL}/posts/search?keyword=${keyword}&page=${page}&size=${size}`);
    },

    // 팔로잉한 게시글 조회
    getFollowingsPosts: (token) => {
        return axios.get(`${API_URL}/posts/followings`, getAuthHeader(token));
    },
    
    // 팔로잉한 게시글 커서 기반 조회
    getFollowingsPostsWithCursor: (token, createdAt = null, id = null, limit = 20) => {
        const url = new URL(`${API_URL}/posts/followings/cursor`);
        if (createdAt) url.searchParams.set('createdAt', createdAt);
        if (id) url.searchParams.set('id', id);
        url.searchParams.set('limit', limit);
        return axios.get(url.toString(), getAuthHeader(token));
    },
    
    // 홈 페이지 데이터를 한 번에 가져오는 메서드
    getHomePageData: async () => {
        try {
            console.log('postApi: 홈 페이지 데이터 로드 시작');
            const token = localStorage.getItem('token');
            console.log('postApi: 토큰 확인', token ? '토큰 있음' : '토큰 없음');
            
            // 병렬로 여러 API 호출 실행
            console.log('postApi: API 호출 시작');
            const [latestPostsRes, followingPostsRes, likedPostsRes, bookmarkedPostsRes] = await Promise.all([
                axios.get(`${API_URL}/posts?page=0&size=5`),
                axios.get(`${API_URL}/posts/followings`, getAuthHeader(token)),
                axios.get(`${API_URL}/posts/liked`, getAuthHeader(token)),
                axios.get(`${API_URL}/posts/bookmarked`, getAuthHeader(token))
            ]);
            
            // 응답에서 데이터 추출
            console.log('postApi: 응답 데이터', {
                latestPostsCount: latestPostsRes?.data?.content?.length || 0,
                followingPostsCount: followingPostsRes?.data?.length || 0,
                likedPostsCount: likedPostsRes?.data?.length || 0,
                bookmarkedPostsCount: bookmarkedPostsRes?.data?.length || 0
            });
            
            return {
                latestPosts: latestPostsRes.data.content || [],
                followingPosts: followingPostsRes.data || [],
                likedPosts: likedPostsRes.data || [],
                bookmarkedPosts: bookmarkedPostsRes.data || []
            };
        } catch (error) {
            console.error('postApi: 홈 페이지 데이터 로드 중 오류:', error);
            // 오류 발생 시 빈 데이터 반환
            return {
                latestPosts: [],
                followingPosts: [],
                likedPosts: [],
                bookmarkedPosts: []
            };
        }
    }
};