import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { userService } from '../services/userService';
import { FaPaperPlane, FaUser, FaCircle, FaUsers, FaComments } from 'react-icons/fa';
import defaultProfileImage from '../assets/profile-default.png';

const Chat = () => {
    const { isAuthenticated, user } = useAuth();
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isTyping, setIsTyping] = useState({});
    const [onlineUsers, setOnlineUsers] = useState({});
    const messagesEndRef = useRef(null);
    const messageListRef = useRef(null);
    const typingTimeoutRef = useRef({});
    const [activeTab, setActiveTab] = useState('chatRooms'); // 'chatRooms' 또는 'following'
    const [following, setFollowing] = useState([]);
    const [loadingFollowing, setLoadingFollowing] = useState(false);

    // 알림 권한 요청
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    // 채팅방 목록 및 메시지 로드
    useEffect(() => {
        if (isAuthenticated) {
            // 채팅방 목록 로드
            loadChatRooms();

            // 채팅 서비스 연결
            const token = localStorage.getItem('token');
            chatService.connect(token)
                .then(() => {
                    console.log('채팅 서비스 연결됨');
                    
                    // 메시지 수신 리스너
                    const unsubMessage = chatService.onMessage((message) => {
                        handleNewMessage(message);
                    });
                    
                    // 타이핑 상태 리스너
                    const unsubTyping = chatService.onTyping((event) => {
                        const { senderId, chatRoomId, data } = event;
                        setIsTyping(prev => ({
                            ...prev,
                            [chatRoomId]: data ? senderId : false
                        }));
                    });
                    
                    // 읽음 상태 리스너
                    const unsubRead = chatService.onRead((event) => {
                        // 메시지 읽음 처리 로직
                        if (selectedRoom && selectedRoom.id === event.chatRoomId) {
                            setMessages(prev => 
                                prev.map(msg => 
                                    msg.id <= event.data && msg.senderId === user.username
                                        ? { ...msg, read: true }
                                        : msg
                                )
                            );
                        }
                    });
                    
                    // 온라인 상태 리스너
                    const unsubStatus = chatService.onStatusChange((event) => {
                        const { senderId, data } = event;
                        setOnlineUsers(prev => ({
                            ...prev,
                            [senderId]: data
                        }));
                    });
                    
                    return () => {
                        unsubMessage();
                        unsubTyping();
                        unsubRead();
                        unsubStatus();
                        chatService.disconnect();
                    };
                })
                .catch(error => {
                    console.error('채팅 서비스 연결 오류:', error);
                });
        }
    }, [isAuthenticated, user]);

    // 메시지 자동 스크롤
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 메시지 로드
    useEffect(() => {
        if (selectedRoom) {
            loadMessages(selectedRoom.id);
            
            // 선택된 채팅방의 메시지 읽음 처리
            chatService.markAsRead(selectedRoom.id);
        }
    }, [selectedRoom]);

    // 채팅방 목록 로드
    const loadChatRooms = async () => {
        try {
            setIsLoading(true);
            const rooms = await chatService.getChatRooms();
            setChatRooms(rooms);
            
            // 온라인 상태 초기화
            const onlineStatus = {};
            rooms.forEach(room => {
                onlineStatus[room.otherUserId] = false;
            });
            setOnlineUsers(onlineStatus);
            
            setIsLoading(false);
        } catch (error) {
            console.error('채팅방 목록 로드 오류:', error);
            setIsLoading(false);
        }
    };

    // 팔로잉 목록 로드
    const loadFollowing = async () => {
        try {
            setLoadingFollowing(true);
            // 실제 API 호출
            if (user && user.username) {
                const followingData = await userService.getFollowing(user.username);
                setFollowing(followingData || []);
            }
            setLoadingFollowing(false);
        } catch (error) {
            console.error('팔로잉 목록 로드 오류:', error);
            setLoadingFollowing(false);
        }
    };

    // 메시지 로드
    const loadMessages = async (roomId, newPage = 0) => {
        try {
            setIsLoading(true);
            const response = await chatService.getChatMessages(roomId, newPage);
            
            const loadedMessages = response.content || [];
            if (newPage === 0) {
                setMessages(loadedMessages.reverse());
            } else {
                setMessages(prev => [...loadedMessages.reverse(), ...prev]);
            }
            
            setPage(newPage);
            setHasMore(!response.last);
            setIsLoading(false);
        } catch (error) {
            console.error('메시지 로드 오류:', error);
            setIsLoading(false);
        }
    };

    // 메시지 전송
    const sendMessage = async () => {
        if (!message.trim() || !selectedRoom) return;
        
        try {
            const trimmedMessage = message.trim();
            const receiverId = selectedRoom.otherUserId;
            
            setMessage('');
            
            // 메시지 전송
            await chatService.sendMessage(receiverId, trimmedMessage);
            
            // 타이핑 상태 제거
            sendTypingStatus(false);
        } catch (error) {
            console.error('메시지 전송 오류:', error);
        }
    };

    // 새 메시지 처리
    const handleNewMessage = (newMessage) => {
        const isMyMessage = newMessage.senderId === user.username;
        
        // 알림 표시 (내가 보낸 메시지가 아닌 경우에만)
        if (!isMyMessage) {
            // 웹 알림 API가 지원되는지 확인
            if ("Notification" in window) {
                // 알림 권한 요청
                if (Notification.permission === "granted") {
                    // 새 메시지 알림 생성
                    const notification = new Notification(
                        `새 메시지: ${newMessage.senderId}`, {
                            body: newMessage.content,
                            icon: defaultProfileImage
                        }
                    );
                    
                    // 5초 후 알림 자동 닫기
                    setTimeout(() => {
                        notification.close();
                    }, 5000);
                }
                // 알림 권한이 없는 경우 권한 요청
                else if (Notification.permission !== "denied") {
                    Notification.requestPermission();
                }
            }
        }
        
        // 현재 채팅방의 메시지인지 확인
        if (selectedRoom && selectedRoom.otherUserId === newMessage.senderId) {
            // 메시지 목록에 추가
            setMessages(prev => [...prev, newMessage]);
            
            // 읽음 처리
            chatService.markAsRead(selectedRoom.id);
        }
        
        // 채팅방 목록 업데이트
        setChatRooms(prev => {
            // 해당 채팅방 찾기
            const roomIndex = prev.findIndex(room => 
                room.otherUserId === newMessage.senderId ||
                room.otherUserId === newMessage.receiverId
            );
            
            // 채팅방이 존재하면 업데이트
            if (roomIndex >= 0) {
                const updatedRooms = [...prev];
                updatedRooms[roomIndex] = {
                    ...updatedRooms[roomIndex],
                    lastMessage: newMessage.content,
                    lastMessageTime: newMessage.timestamp
                };
                
                // 안 읽은 메시지 수 업데이트
                if (!isMyMessage && selectedRoom?.otherUserId !== newMessage.senderId) {
                    updatedRooms[roomIndex].unreadCount = 
                        (updatedRooms[roomIndex].unreadCount || 0) + 1;
                }
                
                // 최신 메시지가 있는 채팅방을 맨 위로 정렬
                return updatedRooms.sort((a, b) => 
                    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                );
            }
            
            // 채팅방이 없으면 새로 로드
            loadChatRooms();
            return prev;
        });
    };

    // 타이핑 상태 전송
    const sendTypingStatus = (isTyping) => {
        if (!selectedRoom) return;
        
        chatService.sendTypingStatus(selectedRoom.otherUserId, isTyping);
    };

    // 메시지 입력 시 타이핑 상태 전송
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        
        // 타이핑 상태 전송
        if (e.target.value.length > 0) {
            sendTypingStatus(true);
            
            // 타이머 설정 (3초 후 타이핑 상태 제거)
            if (typingTimeoutRef.current[selectedRoom?.id]) {
                clearTimeout(typingTimeoutRef.current[selectedRoom.id]);
            }
            
            typingTimeoutRef.current[selectedRoom.id] = setTimeout(() => {
                sendTypingStatus(false);
            }, 3000);
        } else {
            sendTypingStatus(false);
        }
    };

    // 유저 검색
    const searchUsers = async () => {
        if (!searchUser.trim()) return;
        
        try {
            // 유저 검색 API 호출 (백엔드에 구현 필요)
            // const users = await userService.searchUsers(searchUser);
            // setUsers(users);
            
            // 임시 코드: 실제 API 구현 전에는 더미 데이터 사용
            setUsers([
                { id: 1, username: 'user1', nickname: '사용자1', profileImage: null },
                { id: 2, username: 'user2', nickname: '사용자2', profileImage: null },
                { id: 3, username: 'user3', nickname: '사용자3', profileImage: null },
            ]);
        } catch (error) {
            console.error('사용자 검색 오류:', error);
        }
    };

    // 채팅방 생성
    const createChatRoom = async (userId) => {
        try {
            const chatRoom = await chatService.createOrGetChatRoom(userId);
            
            // 채팅방 목록 다시 로드
            await loadChatRooms();
            
            // 생성된 채팅방 선택
            const newRoom = chatRooms.find(room => room.id === chatRoom.id);
            if (newRoom) {
                setSelectedRoom(newRoom);
            }
            
            // 검색 초기화
            setSearchUser('');
            setUsers([]);
            
            // 채팅방 탭으로 전환
            setActiveTab('chatRooms');
        } catch (error) {
            console.error('채팅방 생성 오류:', error);
        }
    };

    // 스크롤 이벤트 처리
    const handleScroll = () => {
        if (!messageListRef.current || !hasMore || isLoading) return;
        
        const { scrollTop } = messageListRef.current;
        
        // 스크롤이 맨 위에 도달하면 이전 메시지 로드
        if (scrollTop === 0) {
            loadMessages(selectedRoom.id, page + 1);
        }
    };

    // 메시지 영역으로 스크롤
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // 팔로잉 탭 클릭 시 팔로잉 목록 로드
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'following') {
            loadFollowing();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 text-black">
            <h1 className="text-3xl font-bold mb-6">채팅</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[70vh]">
                {/* 채팅방 목록 */}
                <div className="md:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="사용자 검색..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                            />
                            <button
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-500"
                                onClick={searchUsers}
                            >
                                검색
                            </button>
                        </div>
                        
                        {/* 검색 결과 */}
                        {users.length > 0 && (
                            <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                                {users.map(user => (
                                    <div
                                        key={user.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                        onClick={() => createChatRoom(user.username)}
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                            <img
                                                src={user.profileImage || defaultProfileImage}
                                                alt={user.nickname}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.nickname}</div>
                                            <div className="text-xs text-gray-500">@{user.username}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* 탭 메뉴 */}
                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-3 text-center ${activeTab === 'chatRooms' ? 'bg-indigo-50 text-indigo-600 font-medium border-b-2 border-indigo-500' : 'text-gray-500'}`}
                            onClick={() => handleTabChange('chatRooms')}
                        >
                            채팅방
                        </button>
                        <button
                            className={`flex-1 py-3 text-center ${activeTab === 'following' ? 'bg-indigo-50 text-indigo-600 font-medium border-b-2 border-indigo-500' : 'text-gray-500'}`}
                            onClick={() => handleTabChange('following')}
                        >
                            팔로잉
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {/* 채팅방 목록 탭 */}
                        {activeTab === 'chatRooms' && (
                            <>
                                {isLoading && chatRooms.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-black">
                                        로딩 중...
                                    </div>
                                ) : chatRooms.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-black">
                                        채팅방이 없습니다.
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {chatRooms.map(room => (
                                            <div
                                                key={room.id}
                                                className={`p-4 hover:bg-gray-100 cursor-pointer ${selectedRoom?.id === room.id ? 'bg-indigo-50' : ''}`}
                                                onClick={() => setSelectedRoom(room)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                                                        <img
                                                            src={room.profileImage || defaultProfileImage}
                                                            alt={room.otherUserNickname}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {onlineUsers[room.otherUserId] && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center">
                                                            <h3 className="font-medium truncate">{room.otherUserNickname}</h3>
                                                            <span className="text-xs text-gray-500">{new Date(room.lastMessageTime).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate">{room.lastMessage || '새로운 채팅방'}</p>
                                                    </div>
                                                    {room.unreadCount > 0 && (
                                                        <div className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                            {room.unreadCount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        
                        {/* 팔로잉 목록 탭 */}
                        {activeTab === 'following' && (
                            <>
                                {loadingFollowing ? (
                                    <div className="flex items-center justify-center h-full text-black">
                                        팔로잉 목록 로딩 중...
                                    </div>
                                ) : following.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-black">
                                        <FaUsers className="text-gray-300 text-4xl mb-2" />
                                        <p>팔로우한 사용자가 없습니다.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {following.map(followUser => (
                                            <div
                                                key={followUser.id || followUser.username}
                                                className="p-4 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => createChatRoom(followUser.username)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                                        <img
                                                            src={followUser.profileImage || defaultProfileImage}
                                                            alt={followUser.nickname || followUser.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{followUser.nickname || followUser.username}</div>
                                                        <div className="text-xs text-gray-500">@{followUser.username}</div>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <button className="text-indigo-500 hover:text-indigo-700">
                                                            <FaComments className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
                {/* 채팅 메시지 */}
                <div className="md:col-span-3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    {!selectedRoom ? (
                        <div className="flex items-center justify-center h-full text-black">
                            채팅방을 선택해주세요.
                        </div>
                    ) : (
                        <>
                            {/* 채팅방 헤더 */}
                            <div className="p-4 border-b flex items-center">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                                    <img
                                        src={selectedRoom.profileImage || defaultProfileImage}
                                        alt={selectedRoom.otherUserNickname}
                                        className="w-full h-full object-cover"
                                    />
                                    {onlineUsers[selectedRoom.otherUserId] && (
                                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{selectedRoom.otherUserNickname}</h3>
                                    <div className="text-xs text-gray-500 flex items-center">
                                        {onlineUsers[selectedRoom.otherUserId] ? (
                                            <>
                                                <FaCircle className="w-2 h-2 text-green-500 mr-1" />
                                                <span>온라인</span>
                                            </>
                                        ) : (
                                            '오프라인'
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 메시지 목록 */}
                            <div 
                                className="flex-1 p-4 overflow-y-auto bg-gray-50" 
                                ref={messageListRef}
                                onScroll={handleScroll}
                            >
                                {isLoading && messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-20 text-black">
                                        메시지를 불러오는 중...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-black">
                                        <FaUser className="w-12 h-12 mb-2 text-gray-300" />
                                        <p>대화를 시작해보세요!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {isLoading && hasMore && (
                                            <div className="text-center text-black text-sm py-2">
                                                이전 메시지 불러오는 중...
                                            </div>
                                        )}
                                        
                                        {messages.map((msg, idx) => {
                                            const isMine = msg.senderId === user.username;
                                            return (
                                                <div
                                                    key={msg.id || idx}
                                                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[70%] ${isMine ? 'bg-indigo-100' : 'bg-white border'} text-black rounded-lg p-3 shadow-sm`}>
                                                        <div className="text-sm">{msg.content}</div>
                                                        <div className="text-xs text-right mt-1 text-gray-500 flex justify-end items-center">
                                                            {isMine && msg.read && (
                                                                <span className="text-blue-500 mr-1 text-[10px]">읽음</span>
                                                            )}
                                                            <span>{formatDate(msg.timestamp)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* 타이핑 표시 */}
                                        {isTyping[selectedRoom.id] && isTyping[selectedRoom.id] !== user.username && (
                                            <div className="flex justify-start">
                                                <div className="bg-gray-200 rounded-lg p-3 shadow-sm">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>
                            
                            {/* 메시지 입력 */}
                            <div className="p-4 border-t">
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="메시지를 입력하세요..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                                        value={message}
                                        onChange={handleMessageChange}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                        style={{ backgroundColor: '#333' }}
                                    />
                                    <button
                                        className="px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600"
                                        onClick={sendMessage}
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;