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

            // 채팅방 접속시 모든 알림 읽음 처리
            chatService.markAllMessagesAsRead()
              .then(() => console.log('모든 채팅 알림 읽음 처리 완료'))
              .catch(err => console.error('채팅 알림 읽음 처리 오류:', err));

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
        
        const trimmedMessage = message.trim();
        const receiverId = selectedRoom.otherUserId;
        
        // 메시지 입력창 초기화
        setMessage('');
        
        // 임시 메시지 추가 (즉시 화면에 표시)
        const tempMessage = {
            id: `temp-${Date.now()}`,
            senderId: user.username,
            receiverId: receiverId,
            content: trimmedMessage,
            timestamp: new Date().toISOString(),
            read: false,
            chatRoomId: selectedRoom.id,
            type: 'TEXT',
            sending: true // 전송 중 상태 표시
        };
        
        // 메시지 목록에 임시 메시지 추가
        setMessages(prev => [...prev, tempMessage]);
        
        // 타이핑 상태 제거
        sendTypingStatus(false);
        
        try {
            // 서버에 메시지 전송
            const sentMessage = await chatService.sendMessage(receiverId, trimmedMessage);
            
            // 임시 메시지를 서버에서 받은 메시지로 교체
            setMessages(prev => prev.map(msg => 
                msg.id === tempMessage.id ? sentMessage : msg
            ));
        } catch (error) {
            console.error('메시지 전송 오류:', error);
            
            // 오류 발생 시 임시 메시지에 오류 표시 추가
            setMessages(prev => prev.map(msg => 
                msg.id === tempMessage.id ? {...msg, sending: false, error: true} : msg
            ));
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
    
    // 실패한 메시지 재전송
    const handleResendMessage = async (failedMessage) => {
        // 기존 오류 메시지를 전송 중 상태로 변경
        setMessages(prev => prev.map(msg => 
            msg.id === failedMessage.id ? {...msg, sending: true, error: false} : msg
        ));
        
        try {
            // 서버에 메시지 재전송
            const sentMessage = await chatService.sendMessage(failedMessage.receiverId, failedMessage.content);
            
            // 임시 메시지를 서버에서 받은 메시지로 교체
            setMessages(prev => prev.map(msg => 
                msg.id === failedMessage.id ? sentMessage : msg
            ));
        } catch (error) {
            console.error('메시지 재전송 오류:', error);
            
            // 오류 발생 시 임시 메시지에 오류 표시 추가
            setMessages(prev => prev.map(msg => 
                msg.id === failedMessage.id ? {...msg, sending: false, error: true} : msg
            ));
        }
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
        <div className="w-full min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 text-black">
                <h1 className="text-3xl font-bold mb-6 text-indigo-800">채팅</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[80vh] bg-white shadow-md rounded-lg overflow-hidden">
                {/* 채팅방 목록 */}
                <div className="md:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="사용자 검색..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black bg-white"
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                            />
                            <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                onClick={searchUsers}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
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
                            className={`flex-1 py-3 text-center ${activeTab === 'chatRooms' ? 'bg-indigo-50 text-indigo-600 font-semibold border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200'}`}
                            onClick={() => handleTabChange('chatRooms')}
                        >
                            채팅방
                        </button>
                        <button
                            className={`flex-1 py-3 text-center ${activeTab === 'following' ? 'bg-indigo-50 text-indigo-600 font-semibold border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200'}`}
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
                                    <div className="flex flex-col items-center justify-center h-full text-black">
                                        <FaComments className="text-gray-300 text-4xl mb-3" />
                                        <p className="text-lg font-medium">채팅방이 없습니다.</p>
                                        <p className="text-sm text-gray-500 mt-2">사용자를 검색하여 채팅을 시작해보세요!</p>
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
                                                            <span className="text-xs text-gray-500">{formatDate(room.lastMessageTime)}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate mt-1">{room.lastMessage || '새로운 채팅방'}</p>
                                                    </div>
                                                    {room.unreadCount > 0 && (
                                                        <div className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
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
                        <div className="flex flex-col items-center justify-center h-full text-black">
                            <FaComments className="text-gray-300 text-5xl mb-4" />
                            <p className="text-xl font-medium">채팅방을 선택해주세요.</p>
                        </div>
                    ) : (
                        <>
                            {/* 채팅방 헤더 */}
                            <div className="p-4 border-b flex items-center bg-gray-50">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src={selectedRoom.profileImage || defaultProfileImage}
                                        alt={selectedRoom.otherUserNickname}
                                        className="w-full h-full object-cover"
                                    />
                                    {onlineUsers[selectedRoom.otherUserId] && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedRoom.otherUserNickname}</h3>
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                        {onlineUsers[selectedRoom.otherUserId] ? (
                                            <>
                                                <FaCircle className="w-2 h-2 text-green-500 mr-1" />
                                                <span>온라인</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCircle className="w-2 h-2 text-gray-400 mr-1" />
                                                <span>오프라인</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 메시지 목록 */}
                            <div 
                                className="flex-1 p-4 overflow-y-auto bg-gray-50 bg-gradient-to-b from-gray-50 to-white" 
                                ref={messageListRef}
                                onScroll={handleScroll}
                            >
                                {isLoading && messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-20 text-black">
                                        메시지를 불러오는 중...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-black">
                                        <FaUser className="w-16 h-16 mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">대화를 시작해보세요!</p>
                                        <p className="text-sm text-gray-500 mt-2">'{selectedRoom.otherUserNickname}'님과의 처음 채팅입니다.</p>
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
                                                className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}
                                            >
                                                <div className={`max-w-[70%] ${isMine ? 
                                                    msg.error ? 'bg-red-100 border-red-300 border' : 
                                                    msg.sending ? 'bg-blue-50 border-blue-200 border' : 'bg-indigo-100' 
                                                    : 'bg-white border'} text-black rounded-lg p-3 shadow-sm ${isMine ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                                        <div className="text-sm">{msg.content}</div>
                                                        <div className="text-xs text-right mt-1 text-gray-500 flex justify-end items-center">
                                                            {isMine && msg.sending && (
                                                                <span className="text-blue-500 mr-1 text-[10px] font-medium">전송 중...</span>
                                                            )}
                                                            {isMine && msg.error && (
                                                                <div className="flex items-center mr-1">
                                                                    <span className="text-red-500 mr-1 text-[10px] font-medium">전송 실패</span>
                                                                    <button
                                                                        className="text-blue-500 text-[10px] underline font-medium"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            // 실패한 메시지 재전송
                                                                            handleResendMessage(msg);
                                                                        }}
                                                                    >
                                                                        재전송
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {isMine && msg.read && (
                                                                <span className="text-blue-500 mr-1 text-[10px] font-medium">읽음</span>
                                                            )}
                                                            <span className="text-gray-400">{formatDate(msg.timestamp)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* 타이핑 표시 */}
                                        {isTyping[selectedRoom.id] && isTyping[selectedRoom.id] !== user.username && (
                                            <div className="flex justify-start mb-2">
                                                <div className="bg-gray-200 rounded-lg p-2 shadow-sm rounded-tl-none max-w-[70%]">
                                                    <div className="flex space-x-1 px-1">
                                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>
                            
                            {/* 메시지 입력 */}
                            <div className="p-4 border-t bg-white">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="메시지를 입력하세요..."
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black bg-white"
                                        value={message}
                                        onChange={handleMessageChange}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    />
                                    <button
                                        className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors duration-200"
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
        </div>
    );
};

export default Chat;