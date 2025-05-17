import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import PostActions from '../components/posts/PostActions';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [likeStatus, setLikeStatus] = useState({ liked: false, count: 0 });
    const [bookmarkStatus, setBookmarkStatus] = useState({ bookmarked: false, count: 0 });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPost();
        fetchComments();
        if (isAuthenticated) {
            fetchLikeStatus();
            fetchBookmarkStatus();
        }
    }, [id, isAuthenticated]);

    const fetchPost = async () => {
        try {
            setIsLoading(true);
            const data = await postService.getPost(id);
            setPost(data);
        } catch (error) {
            setError('게시글을 불러오는데 실패했습니다.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await commentService.getComments(id);
            setComments(data);
        } catch (error) {
            console.error('댓글을 불러오는데 실패했습니다:', error);
        }
    };

    const fetchLikeStatus = async () => {
        try {
            const data = await postService.getLikeStatus(id);
            setLikeStatus({ liked: data.liked, count: data.count });
        } catch {}
    };

    const fetchBookmarkStatus = async () => {
        try {
            const data = await postService.getBookmarkStatus(id);
            setBookmarkStatus({ bookmarked: data.bookmarked, count: data.count });
        } catch {}
    };

    const handleDeletePost = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await postService.deletePost(id);
                navigate('/posts');
            } catch (error) {
                setError('게시글 삭제에 실패했습니다.');
                console.error(error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            await commentService.createComment(id, newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            setError('댓글 작성에 실패했습니다.');
            console.error(error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            try {
                await commentService.deleteComment(id, commentId);
                fetchComments();
            } catch (error) {
                setError('댓글 삭제에 실패했습니다.');
                console.error(error);
            }
        }
    };

    const handleLike = async () => {
        setActionLoading(true);
        try {
            const data = await postService.toggleLike(id);
            // 낙관적 업데이트를 위해 지금 상태의 반대로 설정
            const newStatus = !likeStatus.liked;
            const newCount = newStatus ? likeStatus.count + 1 : Math.max(likeStatus.count - 1, 0);
            setLikeStatus({ liked: newStatus, count: newCount });
            
            // 서버 응답으로 정확한 상태 업데이트
            if (data && typeof data.liked !== 'undefined' && typeof data.count !== 'undefined') {
                setLikeStatus({ liked: data.liked, count: data.count });
            }
        } catch (error) {
            console.error('좋아요 처리 오류:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleBookmark = async () => {
        setActionLoading(true);
        try {
            const data = await postService.toggleBookmark(id);
            // 낙관적 업데이트를 위해 지금 상태의 반대로 설정
            const newStatus = !bookmarkStatus.bookmarked;
            const newCount = newStatus ? bookmarkStatus.count + 1 : Math.max(bookmarkStatus.count - 1, 0);
            setBookmarkStatus({ bookmarked: newStatus, count: newCount });
            
            // 서버 응답으로 정확한 상태 업데이트
            if (data && typeof data.bookmarked !== 'undefined' && typeof data.count !== 'undefined') {
                setBookmarkStatus({ bookmarked: data.bookmarked, count: data.count });
            }
        } catch (error) {
            console.error('북마크 처리 오류:', error);
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8 text-black text-lg font-bold">로딩 중...</div>;
    }

    if (!post) {
        return <div className="text-center py-4 text-black">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-black">{post.title}</h1>
                    {isAuthenticated && user?.username === post.username && (
                        <div className="space-x-2">
                            <button
                                onClick={() => navigate(`/posts/${id}/edit`)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
                <PostActions
                    liked={likeStatus.liked}
                    likeCount={likeStatus.count}
                    onLike={handleLike}
                    bookmarked={bookmarkStatus.bookmarked}
                    bookmarkCount={bookmarkStatus.count}
                    onBookmark={handleBookmark}
                    disabled={actionLoading || !isAuthenticated}
                />
                <div className="text-black mb-4">
                    <span className="font-bold">
                        작성자: <span className="cursor-pointer hover:underline" onClick={() => navigate(`/profile/${post.username}`)}>{post.nickname || post.username}</span>
                    </span>
                    <span className="mx-2">|</span>
                    <span>작성일: {new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="prose max-w-none text-black">
                    {post.content}
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-black mb-4">댓글</h2>
                {isAuthenticated ? (
                    <CommentForm
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onSubmit={handleCommentSubmit}
                        isLoading={commentLoading}
                    />
                ) : (
                    <p className="text-black mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
                )}
                <CommentList comments={comments} user={user} onDelete={handleDeleteComment} />
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
        </div>
    );
};

export default PostDetail; 