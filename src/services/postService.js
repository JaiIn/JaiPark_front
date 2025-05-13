import { postApi } from '../api/postApi';

export const postService = {
    // 게시글 목록 조회
    getPosts: async (page = 0, size = 10) => {
        const response = await postApi.getPosts(page, size);
        return response.data;
    },

    // 키셋 페이지네이션을 이용한 게시글 목록 조회
    getPostsWithCursor: async (lastPostId = null, limit = 20) => {
        const response = await postApi.getPostsWithCursor(lastPostId, limit);
        return response.data;
    },

    // 시간 기반 키셋 페이지네이션을 이용한 게시글 목록 조회
    getPostsWithTimeCursor: async (createdAt = null, id = null, limit = 20) => {
        const response = await postApi.getPostsWithTimeCursor(createdAt, id, limit);
        return response.data;
    },

    // 게시글 검색
    searchPosts: async (keyword, page = 0, size = 10) => {
        const response = await postApi.searchPosts(keyword, page, size);
        return response.data;
    },

    // 게시글 상세 조회
    getPost: async (id) => {
        const response = await postApi.getPost(id);
        return response.data;
    },

    // 게시글 작성
    createPost: async (title, content) => {
        const token = localStorage.getItem('token');
        const response = await postApi.createPost({ title, content }, token);
        return response.data;
    },

    // 게시글 수정
    updatePost: async (id, title, content) => {
        const token = localStorage.getItem('token');
        const response = await postApi.updatePost(id, { title, content }, token);
        return response.data;
    },

    // 게시글 삭제
    deletePost: async (id) => {
        const token = localStorage.getItem('token');
        await postApi.deletePost(id, token);
    },

    // 배치로 여러 게시글의 상태 조회
    getBatchPostsData: async (postIds) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getBatchPostsData(postIds, token);
        return response.data;
    },

    // 좋아요 상태 확인
    getLikeStatus: async (id) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getLikeStatus(id, token);
        return response.data;
    },

    // 좋아요 토글
    toggleLike: async (id) => {
        const token = localStorage.getItem('token');
        const response = await postApi.toggleLike(id, token);
        return response.data;
    },

    // 북마크 상태 확인
    getBookmarkStatus: async (id) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getBookmarkStatus(id, token);
        return response.data;
    },

    // 북마크 토글
    toggleBookmark: async (id) => {
        const token = localStorage.getItem('token');
        const response = await postApi.toggleBookmark(id, token);
        return response.data;
    },

    // 사용자의 게시글 목록 조회
    getPostsByUsername: async (username) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getPostsByUsername(username, token);
        return response.data;
    },

    // 사용자의 댓글 목록 조회
    getCommentsByUsername: async (username) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getCommentsByUsername(username, token);
        return response.data;
    },

    // 사용자가 좋아요한 게시글 목록 조회
    getLikedPosts: async (username) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getLikedPosts(username, token);
        return response.data;
    },

    // 사용자가 북마크한 게시글 목록 조회
    getBookmarkedPosts: async (username) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getBookmarkedPosts(username, token);
        return response.data;
    },

    // 팔로우한 사람들의 게시글 조회
    getFollowingsPosts: async () => {
        const token = localStorage.getItem('token');
        const response = await postApi.getFollowingsPosts(token);
        return response.data;
    },

    // 팔로우한 사람들의 게시글 커서 기반 조회
    getFollowingsPostsWithCursor: async (createdAt = null, id = null, limit = 20) => {
        const token = localStorage.getItem('token');
        const response = await postApi.getFollowingsPostsWithCursor(token, createdAt, id, limit);
        return response.data;
    },

    // 여러 API를 한 번에 호출하여 데이터 가져오기
    getUserDashboardData: async (username) => {
        const token = localStorage.getItem('token');
        
        // Promise.all을 사용하여 여러 API를 병렬로 호출
        const [userPosts, userComments, userLikes, userBookmarks] = await Promise.all([
            postApi.getPostsByUsername(username, token),
            postApi.getCommentsByUsername(username, token),
            postApi.getLikedPosts(username, token),
            postApi.getBookmarkedPosts(username, token)
        ]);

        // 모든 응답 데이터를 하나의 객체로 합침
        return {
            posts: userPosts.data,
            comments: userComments.data,
            likes: userLikes.data,
            bookmarks: userBookmarks.data
        };
    },

    // 홈 화면에 필요한 모든 데이터를 한 번에 가져오기
    getHomePageData: async () => {
        const token = localStorage.getItem('token');
        
        // Promise.all을 사용하여 여러 API를 병렬로 호출
        const [latestPosts, followingPosts, notifications] = await Promise.all([
            postApi.getPosts(0, 5),  // 최신 게시글 5개
            postApi.getFollowingsPosts(token), // 팔로우 게시글
            // notificationApi.getNotifications(token) // 알림 (실제 서비스에서 구현)
        ]);

        // 모든 응답 데이터를 하나의 객체로 합침
        return {
            latestPosts: latestPosts.data,
            followingPosts: followingPosts.data,
            // notifications: notifications.data
        };
    }
};