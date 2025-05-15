import axios from 'axios';
import { API_URL, getAuthHeader } from './config';

export const chatApi = {
  // 채팅방 목록 조회
  getChatRooms: (token) => axios.get(`${API_URL}/chat/rooms`, getAuthHeader(token)),
  
  // 특정 사용자와의 채팅방 생성 또는 조회
  createOrGetChatRoom: (userId, token) => axios.post(`${API_URL}/chat/rooms`, { userId }, getAuthHeader(token)),
  
  // 채팅 메시지 조회
  getChatMessages: (roomId, page = 0, size = 20, token) => 
    axios.get(`${API_URL}/chat/rooms/${roomId}/messages?page=${page}&size=${size}`, getAuthHeader(token)),
  
  // 메시지 읽음 처리
  markAsRead: (roomId, token) => 
    axios.post(`${API_URL}/chat/rooms/${roomId}/read`, {}, getAuthHeader(token)),
  
  // 안 읽은 메시지 수 조회
  getUnreadCount: (token) => 
    axios.get(`${API_URL}/chat/unread`, getAuthHeader(token)),
  
  // 특정 채팅방의 안 읽은 메시지 수 조회
  getUnreadCountInRoom: (roomId, token) => 
    axios.get(`${API_URL}/chat/rooms/${roomId}/unread`, getAuthHeader(token)),
  
  // REST API로 메시지 전송
  sendMessage: (messageData, token) => 
    axios.post(`${API_URL}/chat/messages`, messageData, getAuthHeader(token)),
};
