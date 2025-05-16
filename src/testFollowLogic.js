import axios from 'axios';

// API 기본 URL
const API_URL = 'http://localhost:8080/api';

// 인증 헤더
const getAuthHeader = (token) => {
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

/**
 * 팔로우 로직 테스트
 * 이 함수는 개발자 도구 콘솔에서 실행할 수 있습니다.
 */
export async function testFollowLogic() {
    try {
        // 1. 현재 토큰 가져오기
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('로그인이 필요합니다');
            return;
        }

        // 2. 현재 사용자 정보 가져오기
        const myProfile = await axios.get(`${API_URL}/users/me`, getAuthHeader(token));
        console.log('내 프로필:', myProfile.data);

        // 3. 모든 사용자 목록 가져오기 (API가 필요, 여기서는 mockup)
        console.log('다른 사용자 목록을 가져오는 API가 없습니다. 직접 사용자명을 입력하세요.');

        // 4. 팔로우할 특정 사용자 입력 받기 (예: 'user2')
        const usernameToFollow = window.prompt('팔로우할 사용자명을 입력하세요:');
        if (!usernameToFollow) {
            console.log('작업이 취소되었습니다.');
            return;
        }

        // 5. 팔로우 요청 보내기
        try {
            const followResponse = await axios.post(
                `${API_URL}/users/${usernameToFollow}/follow`,
                {},
                getAuthHeader(token)
            );
            console.log('팔로우 성공:', followResponse.data);
        } catch (error) {
            console.error('팔로우 실패:', error.response?.data || error.message);
        }

        // 6. 팔로잉 목록 확인
        const followingList = await axios.get(`${API_URL}/users/me/following`, getAuthHeader(token));
        console.log('팔로잉 목록:', followingList.data);

        // 7. 팔로잉한 게시글 가져오기
        const followingPosts = await axios.get(`${API_URL}/posts/followings`, getAuthHeader(token));
        console.log('팔로잉 게시글:', followingPosts.data);

        return {
            myProfile: myProfile.data,
            followingList: followingList.data,
            followingPosts: followingPosts.data
        };
    } catch (error) {
        console.error('테스트 중 오류 발생:', error);
    }
}

/**
 * 전체 팔로우 테스트 (React 컴포넌트에서 사용 가능)
 * @returns {Promise<object>} 테스트 결과
 */
export async function runFullFollowTest() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }
        
        // 1. 현재 팔로잉 목록 조회
        console.log('1. 현재 팔로잉 목록 조회 중...');
        const currentFollowing = await axios.get(`${API_URL}/users/me`, getAuthHeader(token));
        console.log('현재 팔로잉:', currentFollowing.data.followings || []);
        
        // 2. 팔로우할 사용자 확인
        const usernameToFollow = window.prompt('팔로우할 사용자명을 입력하세요:');
        if (!usernameToFollow) {
            console.log('작업이 취소되었습니다.');
            return;
        }
        
        // 3. 팔로우 상태 확인
        try {
            const statusCheck = await axios.get(
                `${API_URL}/users/${usernameToFollow}/follow-status`, 
                getAuthHeader(token)
            );
            console.log('팔로우 상태:', statusCheck.data);
            
            // 이미 팔로우 중인 경우
            if (statusCheck.data.isFollowing) {
                // window.confirm 사용하여 ESLint 경고 해결
                const unfollow = window.confirm(`이미 ${usernameToFollow}님을 팔로우하고 있습니다. 언팔로우하시겠습니까?`);
                if (unfollow) {
                    await axios.delete(
                        `${API_URL}/users/${usernameToFollow}/follow`,
                        getAuthHeader(token)
                    );
                    console.log('언팔로우 성공');
                }
                return;
            }
        } catch (error) {
            console.log('팔로우 상태 확인 실패, 새로 팔로우를 시도합니다.');
        }
        
        // 4. 팔로우 요청
        try {
            console.log(`${usernameToFollow} 팔로우 시도 중...`);
            await axios.post(
                `${API_URL}/users/${usernameToFollow}/follow`,
                {},
                getAuthHeader(token)
            );
            console.log('팔로우 성공');
        } catch (error) {
            console.error('팔로우 실패:', error.response?.data || error.message);
            return;
        }
        
        // 5. 팔로잉 게시글 확인
        console.log('팔로잉 게시글 확인 중...');
        try {
            const followingPosts = await axios.get(`${API_URL}/posts/followings`, getAuthHeader(token));
            console.log('팔로잉 게시글 수:', followingPosts.data.length);
            console.log('팔로잉 게시글:', followingPosts.data);
            
            // 게시글이 없는 경우
            if (!followingPosts.data.length) {
                console.log(`${usernameToFollow}님의 게시글이 없거나 데이터를 가져오지 못했습니다.`);
            }
            
            return {
                success: true,
                posts: followingPosts.data
            };
        } catch (error) {
            console.error('팔로잉 게시글 조회 실패:', error);
            return {
                success: false,
                error: error.message
            };
        }
    } catch (error) {
        console.error('전체 테스트 실패:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 콘솔에서 사용 가능하도록 전역 객체에 등록
if (typeof window !== 'undefined') {
    window.testFollowLogic = testFollowLogic;
    window.runFullFollowTest = runFullFollowTest;
}
