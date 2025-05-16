import axios from 'axios';
import { API_URL, getAuthHeader } from '../api/config';

export const chatService = {
  // 연결 상태 관리
  isConnected: false,
  messageCallbacks: [],
  typingCallbacks: [],
  readCallbacks: [],
  statusCallbacks: [],
  pollingInterval: null,
  lastMessageTime: null,
  
  // 연결 (폴링 시작)
  connect: (token) => {
    if (chatService.isConnected) return Promise.resolve();
    
    return new Promise((resolve) => {
      // 폴링 시작 (5초마다 새 메시지 확인)
      chatService.startPolling();
      chatService.isConnected = true;
      console.log('채팅 서비스 연결됨 (폴링 모드)');
      resolve();
    });
  },
  
  // 연결 해제 (폴링 중지)
  disconnect: () => {
    if (chatService.pollingInterval) {
      clearInterval(chatService.pollingInterval);
      chatService.pollingInterval = null;
    }
    chatService.isConnected = false;
    console.log('채팅 서비스 연결 해제됨');
  },
  
  // 폴링 시작 (주기적으로 새 메시지 확인)
  startPolling: () => {
    // 이전 인터벌 제거
    if (chatService.pollingInterval) {
      clearInterval(chatService.pollingInterval);
    }
    
    // 마지막 확인 시간 초기화
    chatService.lastMessageTime = new Date().toISOString();
    
    // 5초마다 새 메시지 확인
    chatService.pollingInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        // 채팅방 목록 가져오기
        const rooms = await chatService.getChatRooms();
        
        // 새 메시지 확인
        for (const room of rooms) {
          // 마지막 메시지 시간 이후의 메시지만 확인
          if (new Date(room.lastMessageTime) > new Date(chatService.lastMessageTime)) {
            const messages = await chatService.getChatMessages(room.id, 0, 1);
            if (messages && messages.content && messages.content.length > 0) {
              const latestMessage = messages.content[0];
              
              // 콜백 호출
              chatService.messageCallbacks.forEach(callback => callback(latestMessage));
            }
          }
        }
        
        // 마지막 확인 시간 업데이트
        chatService.lastMessageTime = new Date().toISOString();
      } catch (error) {
        console.error('메시지 폴링 중 오류:', error);
      }
    }, 5000);
  },
  
  // 메시지 전송
  sendMessage: (receiverId, content) => {
  const token = localStorage.getItem('token');
  if (!token) return Promise.reject('토큰이 없습니다');
  
  // 발신자 정보 추출
  const payload = JSON.parse(atob(token.split('.')[1]));
  const senderId = payload.sub;
  
  const chatRoomId = [senderId, receiverId].sort().join('_');
  
  const messageData = {
  senderId,
  receiverId,
  content,
  chatRoomId,
  timestamp: new Date(),
  read: false,
    type: 'TEXT' // 기본 타입 지정
  };
  
  // REST API로 메시지 전송
  return axios.post(`${API_URL}/chat/messages`, messageData, getAuthHeader(token))
  .then(response => {
    // 메시지 전송 성공 후 콜백 호출
    chatService.messageCallbacks.forEach(callback => callback(response.data));
    return response.data;
      });
  },
  
  // 타이핑 상태 전송 (REST API로 대체)
  sendTypingStatus: (receiverId, isTyping) => {
    // 폴링 방식으로는 실시간 타이핑 상태를 전송하기 어려우므로 
    // 실제 구현 시에는 별도의 WebSocket 연결이 필요
    console.log('타이핑 상태 전송 (폴링 모드에서는 미구현)');
  },
  
  // 읽음 상태 전송
  markAsRead: (chatRoomId) => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('토큰이 없습니다');
    
    // REST API로 읽음 상태 전송
    return axios.post(`${API_URL}/chat/rooms/${chatRoomId}/read`, {}, getAuthHeader(token))
      .then(response => {
        // 읽음 처리 성공 후 콜백 호출
        chatService.readCallbacks.forEach(callback => 
          callback({ 
            chatRoomId, 
            type: 'READ',
            data: true 
          })
        );
        return response.data;
      });
  },
  
  // 채팅방 목록 조회
  getChatRooms: async () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('토큰이 없습니다');
    
    try {
      const response = await axios.get(`${API_URL}/chat/rooms`, getAuthHeader(token));
      return response.data;
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
      return [];
    }
  },
  
  // 특정 사용자와의 채팅방 생성 또는 조회
  createOrGetChatRoom: async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('토큰이 없습니다');
    
    try {
      const response = await axios.post(`${API_URL}/chat/rooms`, { userId }, getAuthHeader(token));
      return response.data;
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      throw error;
    }
  },
  
  // 채팅 메시지 조회
  getChatMessages: async (roomId, page = 0, size = 20) => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('토큰이 없습니다');
    
    try {
      const response = await axios.get(
        `${API_URL}/chat/rooms/${roomId}/messages?page=${page}&size=${size}`, 
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      console.error('채팅 메시지 조회 실패:', error);
      return { content: [], empty: true, totalPages: 0 };
    }
  },
  
  // 안 읽은 메시지 수 조회
  getUnreadCount: async () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('토큰이 없습니다');
    
    try {
      const response = await axios.get(`${API_URL}/chat/unread`, getAuthHeader(token));
      return response.data;
    } catch (error) {
      console.error('안 읽은 메시지 수 조회 실패:', error);
      return 0;
    }
  },
  
  // 특정 채팅방의 안 읽은 메시지 수 조회
  getUnreadCountInRoom: async (roomId) => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('토큰이 없습니다');
    
    try {
      const response = await axios.get(`${API_URL}/chat/rooms/${roomId}/unread`, getAuthHeader(token));
      return response.data;
    } catch (error) {
      console.error('채팅방 안 읽은 메시지 수 조회 실패:', error);
      return 0;
    }
  },
  
  // 콜백 등록 - 메시지 수신
  onMessage: (callback) => {
    chatService.messageCallbacks.push(callback);
    return () => {
      chatService.messageCallbacks = chatService.messageCallbacks.filter(cb => cb !== callback);
    };
  },
  
  // 콜백 등록 - 타이핑 상태
  onTyping: (callback) => {
    chatService.typingCallbacks.push(callback);
    return () => {
      chatService.typingCallbacks = chatService.typingCallbacks.filter(cb => cb !== callback);
    };
  },
  
  // 콜백 등록 - 읽음 상태
  onRead: (callback) => {
    chatService.readCallbacks.push(callback);
    return () => {
      chatService.readCallbacks = chatService.readCallbacks.filter(cb => cb !== callback);
    };
  },
  
  // 콜백 등록 - 온라인 상태
  onStatusChange: (callback) => {
    chatService.statusCallbacks.push(callback);
    return () => {
      chatService.statusCallbacks = chatService.statusCallbacks.filter(cb => cb !== callback);
    };
  }
};
