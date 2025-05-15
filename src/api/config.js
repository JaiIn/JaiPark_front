export const API_URL = 'http://localhost:8080/api';

export const getAuthHeader = (token) => {
    if (!token) {
        // 토큰이 없을 경우 오류 발생하지 않도록 수정
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